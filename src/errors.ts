/** Details shared by every error that comes from an API response. */
export interface AgilisErrorInit {
  status?: number;
  returnCode?: string;
  body?: unknown;
  headers?: Headers;
  cause?: unknown;
}

/** The base type of every error this library throws. */
export class AgilisError extends Error {
  /** The HTTP status, when there was a response. 200 for a refusal sent with HTTP 200. */
  readonly status: number | undefined;
  /** The API's `return_code`, such as `E3`, when the response carried one. */
  readonly returnCode: string | undefined;
  /** The parsed response body (or its text when it was not JSON). */
  readonly body: unknown;
  /** The response headers, when there was a response. */
  readonly headers: Headers | undefined;

  constructor(message: string, init: AgilisErrorInit = {}) {
    super(message, init.cause === undefined ? undefined : { cause: init.cause });
    this.name = new.target.name;
    this.status = init.status;
    this.returnCode = init.returnCode;
    this.body = init.body;
    this.headers = init.headers;
  }
}

/** HTTP 401: the API key is missing, unknown, disabled or expired. */
export class AuthenticationError extends AgilisError {}

/** HTTP 403: the key may not do this, for example a request for the other mode. */
export class PermissionError extends AgilisError {}

/** HTTP 404. */
export class NotFoundError extends AgilisError {}

/** HTTP 409. */
export class ConflictError extends AgilisError {}

/** HTTP 400 or 422, or a refusal sent with HTTP 200 and a `return_code` starting with `E`. */
export class InvalidRequestError extends AgilisError {}

/** HTTP 429. `retryAfter` is the number of seconds the API asked to wait, when it said. */
export class RateLimitError extends AgilisError {
  readonly retryAfter: number | undefined;

  constructor(message: string, init: AgilisErrorInit & { retryAfter?: number } = {}) {
    super(message, init);
    this.retryAfter = init.retryAfter;
  }
}

/** HTTP 5xx, or any other status not covered by a more specific error. */
export class ApiError extends AgilisError {}

/** No response was received: a network failure, a timeout or an aborted request. */
export class ConnectionError extends AgilisError {}

/** Why `constructEvent` refused a message. */
export type SignatureVerificationReason = 'header' | 'timestamp' | 'signature' | 'payload';

/** Thrown by `webhooks.constructEvent` when a message cannot be trusted. */
export class SignatureVerificationError extends AgilisError {
  readonly reason: SignatureVerificationReason;

  constructor(message: string, reason: SignatureVerificationReason) {
    super(message);
    this.reason = reason;
  }
}

/** Builds the error for a response, from its HTTP status. */
export function errorFromResponse(
  status: number,
  body: unknown,
  headers: Headers,
  retryAfter: number | undefined,
): AgilisError {
  const record = body !== null && typeof body === 'object' ? (body as Record<string, unknown>) : {};
  const returnCode = typeof record.return_code === 'string' ? record.return_code : undefined;
  const apiMessage =
    typeof record.message === 'string' && record.message !== '' ? record.message : '';
  const message = apiMessage || `The API returned HTTP ${status}`;
  const init: AgilisErrorInit = { status, returnCode, body, headers };

  if (status === 200) return new InvalidRequestError(message, init);
  if (status === 400 || status === 422) return new InvalidRequestError(message, init);
  if (status === 401) return new AuthenticationError(message, init);
  if (status === 403) return new PermissionError(message, init);
  if (status === 404) return new NotFoundError(message, init);
  if (status === 409) return new ConflictError(message, init);
  if (status === 429) return new RateLimitError(message, { ...init, retryAfter });
  return new ApiError(message, init);
}
