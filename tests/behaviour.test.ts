import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Agilis,
  AgilisError,
  ApiError,
  AuthenticationError,
  ConflictError,
  ConnectionError,
  InvalidRequestError,
  NotFoundError,
  PermissionError,
  RateLimitError,
  VERSION,
} from '../src/index.js';
import { backoffDelay, timers } from '../src/core.js';
import { json, LIVE_KEY, setup, TEST_KEY } from './helpers.js';
import { readFileSync } from 'node:fs';

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

const offerParams = {
  category_id: 1,
  title: 'Title',
  description: 'Description',
  push_notification_title: 'Hello there',
  push_notification_message: 'A message here',
  url: 'https://example.com',
  image: { data: new Uint8Array([1]), filename: 'a.png' },
  location: [51.5, -0.1],
  radius: 10,
  start_datetime: '2027-07-10T08:00:00Z',
  expiry_datetime: '2027-07-12T08:00:00Z',
  payment_method: 'B' as const,
};

const unavailable = json({ message: 'Service unavailable' }, 503);

describe('mode', () => {
  it('is test for a pk_test_ key and live for a pk_live_ key', () => {
    expect(new Agilis({ apiKey: TEST_KEY }).mode).toBe('test');
    expect(new Agilis({ apiKey: TEST_KEY }).isLive).toBe(false);
    expect(new Agilis({ apiKey: LIVE_KEY }).mode).toBe('live');
    expect(new Agilis({ apiKey: LIVE_KEY }).isLive).toBe(true);
  });

  it('reads AGILIS_API_KEY from the environment', () => {
    vi.stubEnv('AGILIS_API_KEY', LIVE_KEY);
    expect(new Agilis().mode).toBe('live');
  });

  it('refuses a missing key or an unknown prefix, without echoing the key', () => {
    vi.stubEnv('AGILIS_API_KEY', '');
    expect(() => new Agilis()).toThrow(AgilisError);
    const bad = 'sk_something_secret_value';
    try {
      new Agilis({ apiKey: bad });
      expect.unreachable();
    } catch (error) {
      expect(String(error)).not.toContain(bad);
    }
  });

  it('fills environment from a live key', async () => {
    const { calls } = setup();
    const fetch = vi.fn(
      async (_url: string, _init: RequestInit) => new Response('{"data":[]}', { status: 200 }),
    );
    const live = new Agilis({ apiKey: LIVE_KEY, fetch });
    await live.events.list();
    expect(new URL(fetch.mock.calls[0][0] as string).searchParams.get('environment')).toBe('LIVE');
    expect(calls).toHaveLength(0);
  });
});

describe('version', () => {
  it('matches package.json', () => {
    const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    expect(VERSION).toBe(pkg.version);
  });
});

describe('idempotency', () => {
  it('generates one key per call and reuses it on every retry', async () => {
    const { client, calls } = setup([unavailable, unavailable, json({ return_code: 'S1' })]);
    await client.offers.create(offerParams);
    expect(calls).toHaveLength(3);
    const keys = calls.map((c) => c.headers['Idempotency-Key']);
    expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/);
    expect(new Set(keys).size).toBe(1);
  });

  it('uses a new key for a new call', async () => {
    const { client, calls } = setup();
    await client.events.publish({} as never);
    await client.events.publish({} as never);
    expect(calls[0].headers['Idempotency-Key']).not.toBe(calls[1].headers['Idempotency-Key']);
  });

  it('keeps the caller key across retries', async () => {
    const { client, calls } = setup([json({}, 429), json({ return_code: 'S1' })]);
    await client.events.publish({} as never, { idempotencyKey: 'abc' });
    expect(calls.map((c) => c.headers['Idempotency-Key'])).toEqual(['abc', 'abc']);
  });
});

describe('retries', () => {
  it('retries GET on 500, 502, 503 and 504, then succeeds', async () => {
    for (const status of [500, 502, 503, 504]) {
      const { client, calls } = setup([json({}, status), json({ categories: [] })]);
      await client.categories.list();
      expect(calls).toHaveLength(2);
      vi.restoreAllMocks();
    }
  });

  it('retries DELETE on 5xx', async () => {
    const { client, calls } = setup([unavailable, json({ return_code: 'S1' })]);
    await client.offers.delete(1);
    expect(calls).toHaveLength(2);
  });

  it('retries a POST with an Idempotency-Key on 5xx', async () => {
    const { client, calls } = setup([unavailable, json({ return_code: 'S1' })]);
    await client.events.publish({} as never);
    expect(calls).toHaveLength(2);
  });

  it('does not retry other POST requests on 5xx, including events.edit', async () => {
    const post = setup([unavailable, json({ return_code: 'S1' })]);
    await expect(post.client.offers.pause(1)).rejects.toBeInstanceOf(ApiError);
    expect(post.calls).toHaveLength(1);
    vi.restoreAllMocks();

    const patch = setup([json({}, 500), json({ return_code: 'S1' })]);
    await expect(patch.client.events.edit(1, { title: 'x' })).rejects.toBeInstanceOf(ApiError);
    expect(patch.calls).toHaveLength(1);
    vi.restoreAllMocks();

    const upload = setup([json({}, 502)]);
    await expect(
      upload.client.events.edit(1, { image: { data: new Uint8Array([1]), filename: 'a.png' } }),
    ).rejects.toBeInstanceOf(ApiError);
    expect(upload.calls).toHaveLength(1);
  });

  it('does not retry 501 or 4xx other than 429', async () => {
    for (const status of [400, 401, 403, 404, 409, 422, 501]) {
      const { client, calls } = setup([json({}, status)]);
      await expect(client.categories.list()).rejects.toBeInstanceOf(AgilisError);
      expect(calls).toHaveLength(1);
      vi.restoreAllMocks();
    }
  });

  it('retries 429 on any method, honouring Retry-After in seconds', async () => {
    const { client, calls, waits } = setup([
      json({ message: 'Too many requests' }, 429, { 'Retry-After': '7' }),
      json({ return_code: 'S1' }),
    ]);
    await client.offers.pause(1);
    expect(calls).toHaveLength(2);
    expect(waits).toEqual([7000]);
  });

  it('retries connection errors and timeouts', async () => {
    const { client, calls } = setup([new TypeError('fetch failed'), json({ categories: [] })]);
    await client.categories.list();
    expect(calls).toHaveLength(2);

    const timeoutFetch = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    );
    const slow = new Agilis({ apiKey: TEST_KEY, fetch: timeoutFetch, timeout: 5, maxRetries: 1 });
    const error = await slow.categories.list().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ConnectionError);
    expect((error as Error).message).toContain('timed out');
    expect(timeoutFetch).toHaveBeenCalledTimes(2);
  });

  it('waits 0.5 s x 2^attempt with jitter, at most 8 s', async () => {
    const { client, waits } = setup([unavailable], { maxRetries: 6 });
    await expect(client.categories.list()).rejects.toBeInstanceOf(ApiError);
    expect(waits).toEqual([500, 1000, 2000, 4000, 8000, 8000]);

    vi.spyOn(timers, 'random').mockReturnValue(0);
    expect(backoffDelay(0)).toBe(375);
    vi.spyOn(timers, 'random').mockReturnValue(0.999999);
    expect(backoffDelay(1)).toBeCloseTo(1250, 0);
    expect(backoffDelay(10)).toBe(8000);
  });

  it('stops after maxRetries (default 2)', async () => {
    const { client, calls } = setup([unavailable]);
    await expect(client.categories.list()).rejects.toBeInstanceOf(ApiError);
    expect(calls).toHaveLength(3);
  });

  it('can turn retries off per request', async () => {
    const { client, calls } = setup([unavailable]);
    await expect(client.categories.list({ maxRetries: 0 })).rejects.toBeInstanceOf(ApiError);
    expect(calls).toHaveLength(1);
  });

  it('throws RateLimitError with retryAfter when retries run out', async () => {
    const { client } = setup([json({ message: 'Slow down' }, 429, { 'Retry-After': '30' })], {
      maxRetries: 0,
    });
    const error = await client.categories.list().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(RateLimitError);
    expect((error as RateLimitError).retryAfter).toBe(30);
  });
});

describe('errors', () => {
  const table: [number, unknown][] = [
    [400, InvalidRequestError],
    [401, AuthenticationError],
    [403, PermissionError],
    [404, NotFoundError],
    [409, ConflictError],
    [422, InvalidRequestError],
    [429, RateLimitError],
    [500, ApiError],
    [418, ApiError],
  ];

  for (const [status, type] of table) {
    it(`maps HTTP ${status}`, async () => {
      const { client } = setup(
        [json({ return_code: 'E1', message: 'Explained', extra: 1 }, status, { 'X-Test': 'y' })],
        { maxRetries: 0 },
      );
      const error = (await client.categories.list().catch((e: unknown) => e)) as AgilisError;
      expect(error).toBeInstanceOf(type as typeof AgilisError);
      expect(error).toBeInstanceOf(AgilisError);
      expect(error.status).toBe(status);
      expect(error.returnCode).toBe('E1');
      expect(error.message).toBe('Explained');
      expect(error.body).toEqual({ return_code: 'E1', message: 'Explained', extra: 1 });
      expect(error.headers?.get('x-test')).toBe('y');
    });
  }

  it('raises InvalidRequestError for HTTP 200 with an E return code', async () => {
    const { client, calls } = setup([json({ return_code: 'E3', message: 'Balance too low' })]);
    const error = (await client.offers.create(offerParams).catch((e: unknown) => e)) as AgilisError;
    expect(error).toBeInstanceOf(InvalidRequestError);
    expect(error.status).toBe(200);
    expect(error.returnCode).toBe('E3');
    expect(error.message).toBe('Balance too low');
    expect(calls).toHaveLength(1);
  });

  it('treats S1 and S2 as success', async () => {
    const { client } = setup([json({ return_code: 'S1' }), json({ return_code: 'S2' })]);
    await expect(client.offers.pause(1)).resolves.toMatchObject({ return_code: 'S1' });
    await expect(client.offers.resume(1)).resolves.toMatchObject({ return_code: 'S2' });
  });

  it('keeps a body that is not JSON', async () => {
    const { client } = setup([{ status: 502, raw: '<html>Bad gateway</html>' }], { maxRetries: 0 });
    const error = (await client.categories.list().catch((e: unknown) => e)) as AgilisError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.body).toBe('<html>Bad gateway</html>');
    expect(error.message).toBe('The API returned HTTP 502');
  });

  it('raises ConnectionError when there is no response', async () => {
    const { client } = setup([new TypeError('fetch failed')], { maxRetries: 0 });
    const error = await client.categories.list().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(ConnectionError);
    expect((error as AgilisError).status).toBeUndefined();
  });

  it('raises ConnectionError on abort without retrying', async () => {
    const controller = new AbortController();
    controller.abort();
    const { client, calls } = setup([new Error('aborted')]);
    const error = await client.categories.list({ signal: controller.signal }).catch((e) => e);
    expect(error).toBeInstanceOf(ConnectionError);
    expect(calls).toHaveLength(1);
  });

  it('never puts the API key in error text', async () => {
    const replies = [
      json({ message: 'Unauthorised' }, 401),
      json({ return_code: 'E2', message: 'Nope' }, 200),
      new TypeError('fetch failed'),
      { status: 500, raw: 'oops' },
    ];
    for (const reply of replies) {
      const { client } = setup([reply], { maxRetries: 0 });
      const error = (await client.offers.create(offerParams).catch((e: unknown) => e)) as Error;
      expect(error).toBeInstanceOf(AgilisError);
      const texts = [
        error.message,
        String(error),
        error.stack ?? '',
        JSON.stringify(error),
        JSON.stringify(Object.entries(error)),
        String((error as { cause?: unknown }).cause ?? ''),
      ];
      for (const text of texts) expect(text).not.toContain(TEST_KEY);
      vi.restoreAllMocks();
    }
  });

  it('does not expose the API key on the client object', () => {
    const client = new Agilis({ apiKey: TEST_KEY });
    expect(JSON.stringify(client)).not.toContain(TEST_KEY);
    expect(JSON.stringify(client.offers)).not.toContain(TEST_KEY);
  });
});

describe('pagination', () => {
  it('follows next_cursor until has_more is false', async () => {
    const { client, calls } = setup([
      json({
        data: [{ offer_id: 1 }, { offer_id: 2 }],
        pagination: { has_more: true, next_cursor: 'c2' },
      }),
      json({ data: [{ offer_id: 3 }], pagination: { has_more: true, next_cursor: 'c3' } }),
      json({ data: [{ offer_id: 4 }], pagination: { has_more: false, next_cursor: null } }),
    ]);
    const ids: number[] = [];
    for await (const offer of client.offers.listAutoPaging({ limit: 2, offer_status: 'active' })) {
      ids.push(offer.offer_id!);
    }
    expect(ids).toEqual([1, 2, 3, 4]);
    expect(calls.map((c) => c.url.searchParams.get('cursor'))).toEqual([null, 'c2', 'c3']);
    for (const call of calls) {
      expect(call.url.searchParams.get('limit')).toBe('2');
      expect(call.url.searchParams.get('offer_status')).toBe('active');
      expect(call.url.searchParams.get('environment')).toBe('TEST');
    }
  });

  it('pages Events and webhook events', async () => {
    const events = setup([
      json({ data: [{ event_id: 1 }], pagination: { has_more: true, next_cursor: 'n' } }),
      json({ data: [{ event_id: 2 }], pagination: { has_more: false } }),
    ]);
    const eventIds: number[] = [];
    for await (const event of events.client.events.listAutoPaging()) eventIds.push(event.event_id!);
    expect(eventIds).toEqual([1, 2]);
    vi.restoreAllMocks();

    const hooks = setup([
      json({ return_code: 'S1', data: [{ id: 'whevt_1' }], pagination: { has_more: false } }),
    ]);
    const hookIds: string[] = [];
    for await (const event of hooks.client.webhookEvents.listAutoPaging({
      type: 'offer.started',
    })) {
      hookIds.push(event.id!);
    }
    expect(hookIds).toEqual(['whevt_1']);
    expect(hooks.calls).toHaveLength(1);
  });

  it('stops early when the caller breaks', async () => {
    const { client, calls } = setup([
      json({
        data: [{ offer_id: 1 }, { offer_id: 2 }],
        pagination: { has_more: true, next_cursor: 'c2' },
      }),
    ]);
    for await (const offer of client.offers.listAutoPaging()) {
      expect(offer.offer_id).toBe(1);
      break;
    }
    expect(calls).toHaveLength(1);
  });
});
