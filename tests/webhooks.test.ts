import { createHmac } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  Agilis,
  AgilisError,
  SignatureVerificationError,
  webhooks,
  type WebhookEvent,
} from '../src/index.js';

interface Vectors {
  secret: string;
  now_unix: number;
  tolerance_seconds: number;
  body: string;
  cases: { name: string; header: string; valid: boolean; error?: string }[];
}

const vectors = JSON.parse(
  readFileSync(new URL('./fixtures/webhook-signature-vectors.json', import.meta.url), 'utf8'),
) as Vectors;

function sign(body: string, secret: string, t: number): string {
  const v1 = createHmac('sha256', secret).update(`${t}.${body}`).digest('hex');
  return `t=${t},v1=${v1}`;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(vectors.now_unix * 1000);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('shared signature vectors', () => {
  it('has cases', () => {
    expect(vectors.cases.length).toBeGreaterThanOrEqual(12);
  });

  for (const c of vectors.cases) {
    it(`${c.name}: ${c.valid ? 'accepted' : `refused (${c.error})`}`, () => {
      const run = () =>
        webhooks.constructEvent(vectors.body, c.header, vectors.secret, vectors.tolerance_seconds);
      if (c.valid) {
        const event = run();
        expect(event.id).toBe('whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R');
        expect(event.type).toBe('event.published');
      } else {
        let error: unknown;
        try {
          run();
        } catch (e) {
          error = e;
        }
        expect(error).toBeInstanceOf(SignatureVerificationError);
        expect(error).toBeInstanceOf(AgilisError);
        expect((error as SignatureVerificationError).reason).toBe(c.error);
      }
    });
  }
});

describe('constructEvent', () => {
  const valid = vectors.cases.find((c) => c.name === 'valid')!.header;

  it('accepts the body as a Buffer or Uint8Array', () => {
    expect(webhooks.constructEvent(Buffer.from(vectors.body), valid, vectors.secret).type).toBe(
      'event.published',
    );
    expect(
      webhooks.constructEvent(new TextEncoder().encode(vectors.body), valid, vectors.secret).type,
    ).toBe('event.published');
  });

  it('accepts a header given as an array', () => {
    expect(webhooks.constructEvent(vectors.body, [valid], vectors.secret).id).toBeDefined();
  });

  it('is available on the client and the class', () => {
    const client = new Agilis({ apiKey: 'pk_test_x' });
    expect(client.webhooks.constructEvent(vectors.body, valid, vectors.secret).type).toBe(
      'event.published',
    );
    expect(Agilis.webhooks.constructEvent(vectors.body, valid, vectors.secret).type).toBe(
      'event.published',
    );
  });

  it('uses a default tolerance of 300 seconds', () => {
    const body = '{"id":"whevt_1","type":"offer.started","data":{"object":{}}}';
    const now = vectors.now_unix;
    expect(() => webhooks.constructEvent(body, sign(body, 's', now - 300), 's')).not.toThrow();
    expect(() => webhooks.constructEvent(body, sign(body, 's', now - 301), 's')).toThrow(
      SignatureVerificationError,
    );
    expect(() => webhooks.constructEvent(body, sign(body, 's', now - 301), 's', 600)).not.toThrow();
  });

  it('refuses a missing header', () => {
    for (const header of [undefined, null, '', '   ']) {
      try {
        webhooks.constructEvent(vectors.body, header, vectors.secret);
        expect.unreachable();
      } catch (error) {
        expect((error as SignatureVerificationError).reason).toBe('header');
      }
    }
  });

  it('refuses a parsed body', () => {
    try {
      webhooks.constructEvent(JSON.parse(vectors.body) as never, valid, vectors.secret);
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(SignatureVerificationError);
      expect((error as SignatureVerificationError).reason).toBe('payload');
    }
  });

  it('refuses a body that is signed but is not JSON', () => {
    const body = 'not json';
    try {
      webhooks.constructEvent(body, sign(body, 's', vectors.now_unix), 's');
      expect.unreachable();
    } catch (error) {
      expect((error as SignatureVerificationError).reason).toBe('payload');
    }
  });

  it('refuses a malformed v1 value', () => {
    const t = vectors.now_unix;
    for (const v1 of ['zz', 'abc', 'cefee31e'.repeat(9)]) {
      try {
        webhooks.constructEvent(vectors.body, `t=${t},v1=${v1}`, vectors.secret);
        expect.unreachable();
      } catch (error) {
        expect((error as SignatureVerificationError).reason).toBe('signature');
      }
    }
  });

  it('returns an event typed by type', () => {
    const event: WebhookEvent = webhooks.constructEvent(vectors.body, valid, vectors.secret);
    if (event.type === 'event.published') {
      expect(event.data.object.event_id).toBe(3104);
      expect(event.data.amount_charged).toBe(10);
      expect(event.data.object.title).toBe('Beginners Cuban Salsa: Friday Social');
    } else {
      expect.unreachable();
    }
  });
});
