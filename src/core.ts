import { randomUUID } from 'node:crypto';
import { ConnectionError, errorFromResponse } from './errors.js';
import { resolveUpload, type Uploadable } from './uploads.js';
import { VERSION } from './version.js';

/** A `fetch`-compatible function. */
export type Fetch = (input: string, init: RequestInit) => Promise<Response>;

/** The HTTP status and headers of the response a result came from. */
export interface ResponseInfo {
  status: number;
  headers: Headers;
}

/** A parsed API response. Fields the library does not know about are kept. */
export type WithResponse<T> = T & {
  /** The HTTP status and response headers (for example `X-RateLimit-Remaining`). */
  readonly lastResponse: ResponseInfo;
};

/** Options for a single request. */
export interface RequestOptions {
  /** Timeout for each attempt, in milliseconds. Defaults to the client's. */
  timeout?: number;
  /** Retries after the first attempt. Defaults to the client's. */
  maxRetries?: number;
  /** Cancels the request. */
  signal?: AbortSignal;
  /** Extra request headers. */
  headers?: Record<string, string>;
}

/** Options for a request that can be checked without making the change. */
export interface DryRunOptions extends RequestOptions {
  /** Validate only: nothing is created, changed or charged. Sends `dry_run=true`. */
  dryRun?: boolean;
}

/** Options for a request that creates something and is safe to retry. */
export interface CreateOptions extends DryRunOptions {
  /** Your own Idempotency-Key. A random UUID is used, once per call, when you leave it out. */
  idempotencyKey?: string;
}

export type QueryValue = string | number | boolean | null | undefined;

export interface RequestSpec {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, QueryValue>;
  json?: unknown;
  form?: Record<string, unknown>;
  idempotent?: boolean;
  headers?: Record<string, string>;
  options?: RequestOptions & Partial<Pick<CreateOptions, 'dryRun' | 'idempotencyKey'>>;
}

export interface CoreConfig {
  apiKey: string;
  baseURL: string;
  timeout: number;
  maxRetries: number;
  fetch: Fetch;
}

/** Replaceable for tests. */
export const timers = {
  sleep: (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms)),
  random: (): number => Math.random(),
};

const RETRYABLE_5XX = new Set([500, 502, 503, 504]);

/** The wait before retry number `attempt + 1`, in milliseconds. */
export function backoffDelay(attempt: number): number {
  const base = 0.5 * 2 ** attempt;
  const jitter = 1 + (timers.random() * 0.5 - 0.25);
  return Math.min(8, base * jitter) * 1000;
}

/** Retry-After in seconds, from a number of seconds or an HTTP date. */
export function parseRetryAfter(value: string | null): number | undefined {
  if (value === null || value.trim() === '') return undefined;
  const seconds = Number(value);
  if (Number.isFinite(seconds)) return Math.max(0, seconds);
  const date = Date.parse(value);
  if (Number.isNaN(date)) return undefined;
  return Math.max(0, (date - Date.now()) / 1000);
}

function userAgent(): string {
  const runtime =
    typeof process !== 'undefined' && process.versions?.node
      ? `Node.js ${process.version}`
      : 'unknown runtime';
  return `agilis-ads-node/${VERSION} (${runtime})`;
}

function appendField(form: FormData, name: string, value: unknown): void {
  if (value === undefined || value === null) return;
  if (Array.isArray(value)) {
    for (const item of value) appendField(form, `${name}[]`, item);
    return;
  }
  if (typeof value === 'object') {
    for (const [key, inner] of Object.entries(value as Record<string, unknown>)) {
      appendField(form, `${name}[${key}]`, inner);
    }
    return;
  }
  form.append(name, String(value));
}

async function buildForm(fields: Record<string, unknown>): Promise<FormData> {
  const form = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    if (name === 'image') {
      if (value === undefined || value === null) continue;
      const file = await resolveUpload(value as Uploadable);
      form.append('image', file.blob, file.filename);
      continue;
    }
    appendField(form, name, value);
  }
  return form;
}

function parseBody(text: string): unknown {
  if (text === '') return undefined;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return text;
  }
}

function attachResponse<T>(body: T, info: ResponseInfo): WithResponse<T> {
  const target = (body !== null && typeof body === 'object' ? body : {}) as object;
  Object.defineProperty(target, 'lastResponse', {
    value: info,
    enumerable: false,
    configurable: true,
  });
  return target as WithResponse<T>;
}

/** Sends requests, retries them when it is safe, and maps errors. */
export class Core {
  readonly #config: CoreConfig;

  constructor(config: CoreConfig) {
    this.#config = config;
  }

  async request<T>(spec: RequestSpec): Promise<WithResponse<T>> {
    const options = spec.options ?? {};
    const maxRetries = options.maxRetries ?? this.#config.maxRetries;
    const timeout = options.timeout ?? this.#config.timeout;

    const url = new URL(this.#config.baseURL.replace(/\/+$/, '') + spec.path);
    for (const [key, value] of Object.entries(spec.query ?? {})) {
      if (value !== undefined && value !== null) url.searchParams.set(key, String(value));
    }
    if (options.dryRun) url.searchParams.set('dry_run', 'true');

    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': userAgent(),
      ...spec.headers,
      ...options.headers,
      'x-api-key': this.#config.apiKey,
    };
    if (spec.idempotent) headers['Idempotency-Key'] = options.idempotencyKey ?? randomUUID();

    let body: string | FormData | undefined;
    if (spec.json !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(spec.json);
    } else if (spec.form !== undefined) {
      body = await buildForm(spec.form);
    }

    const retryOn5xx =
      spec.method === 'GET' || spec.method === 'DELETE' || spec.idempotent === true;

    for (let attempt = 0; ; attempt++) {
      const canRetry = attempt < maxRetries;
      let response: Response;
      const controller = new AbortController();
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        controller.abort();
      }, timeout);
      const onAbort = () => controller.abort();
      options.signal?.addEventListener('abort', onAbort, { once: true });
      try {
        if (options.signal?.aborted) controller.abort();
        response = await this.#config.fetch(url.toString(), {
          method: spec.method,
          headers,
          body,
          signal: controller.signal,
        });
      } catch (error) {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
        if (options.signal?.aborted) {
          throw new ConnectionError('The request was aborted.', { cause: error });
        }
        if (canRetry) {
          await timers.sleep(backoffDelay(attempt));
          continue;
        }
        throw new ConnectionError(
          timedOut
            ? `The request timed out after ${timeout} ms.`
            : 'Could not connect to the Agilis API.',
          { cause: error },
        );
      }

      let text: string;
      try {
        text = await response.text();
      } catch (error) {
        clearTimeout(timer);
        options.signal?.removeEventListener('abort', onAbort);
        if (canRetry && !options.signal?.aborted) {
          await timers.sleep(backoffDelay(attempt));
          continue;
        }
        throw new ConnectionError('The connection closed before the response was read.', {
          cause: error,
        });
      }
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', onAbort);

      const parsed = parseBody(text);
      const retryAfter = parseRetryAfter(response.headers.get('retry-after'));
      const status = response.status;

      if (canRetry && (status === 429 || (RETRYABLE_5XX.has(status) && retryOn5xx))) {
        await timers.sleep(retryAfter !== undefined ? retryAfter * 1000 : backoffDelay(attempt));
        continue;
      }

      if (status < 200 || status >= 300) {
        throw errorFromResponse(status, parsed, response.headers, retryAfter);
      }

      const returnCode =
        parsed !== null && typeof parsed === 'object'
          ? (parsed as Record<string, unknown>).return_code
          : undefined;
      if (typeof returnCode === 'string' && returnCode.toUpperCase().startsWith('E')) {
        throw errorFromResponse(200, parsed, response.headers, retryAfter);
      }

      return attachResponse(parsed as T, { status, headers: response.headers });
    }
  }
}
