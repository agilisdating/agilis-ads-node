import { createHmac, timingSafeEqual } from 'node:crypto';
import { SignatureVerificationError } from './errors.js';
import type { WebhookEvent } from './types.js';

/** The name of the header that carries the signature. */
export const SIGNATURE_HEADER = 'Agilis-Signature';

/** The default tolerance, in seconds, between the signed time and now. */
export const DEFAULT_TOLERANCE = 300;

function parseHeader(header: string): { timestamp: number; signatures: string[] } {
  let timestamp: number | undefined;
  let timestampSeen = false;
  const signatures: string[] = [];
  for (const part of header.split(',')) {
    const index = part.indexOf('=');
    if (index < 0) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key === 't') {
      timestampSeen = true;
      timestamp = /^\d+$/.test(value) ? Number(value) : undefined;
    } else if (key === 'v1' && value !== '') {
      signatures.push(value);
    }
  }
  if (!timestampSeen || timestamp === undefined || !Number.isSafeInteger(timestamp)) {
    throw new SignatureVerificationError(
      `The ${SIGNATURE_HEADER} header has no valid timestamp.`,
      'header',
    );
  }
  if (signatures.length === 0) {
    throw new SignatureVerificationError(
      `The ${SIGNATURE_HEADER} header has no v1 signature.`,
      'header',
    );
  }
  return { timestamp, signatures };
}

function matches(expected: Buffer, candidate: string): boolean {
  if (!/^[0-9a-fA-F]+$/.test(candidate) || candidate.length !== expected.length * 2) return false;
  return timingSafeEqual(expected, Buffer.from(candidate, 'hex'));
}

/** Verifies and parses the webhook messages Agilis sends to your endpoints. */
export class Webhooks {
  /**
   * Checks a received message's `Agilis-Signature` header and returns the parsed event.
   *
   * @param rawBody The request body exactly as received (a string or bytes), before any JSON parsing.
   * @param signatureHeader The value of the `Agilis-Signature` header.
   * @param secret The endpoint's signing secret (`whsec_...`).
   * @param tolerance How far the signed time may be from now, in seconds. Default 300.
   * @throws SignatureVerificationError when the message cannot be trusted.
   */
  constructEvent(
    rawBody: string | Uint8Array,
    signatureHeader: string | string[] | null | undefined,
    secret: string,
    tolerance: number = DEFAULT_TOLERANCE,
  ): WebhookEvent {
    if (typeof rawBody !== 'string' && !(rawBody instanceof Uint8Array)) {
      throw new SignatureVerificationError(
        'Pass the raw request body as a string or Buffer, not a parsed object.',
        'payload',
      );
    }
    if (typeof secret !== 'string' || secret === '') {
      throw new TypeError('A webhook signing secret is required.');
    }
    const header = Array.isArray(signatureHeader) ? signatureHeader.join(',') : signatureHeader;
    if (typeof header !== 'string' || header.trim() === '') {
      throw new SignatureVerificationError(`The ${SIGNATURE_HEADER} header is missing.`, 'header');
    }

    const { timestamp, signatures } = parseHeader(header);

    const now = Math.floor(Date.now() / 1000);
    if (Math.abs(now - timestamp) > tolerance) {
      throw new SignatureVerificationError(
        'The signature timestamp is outside the tolerance.',
        'timestamp',
      );
    }

    const body = typeof rawBody === 'string' ? Buffer.from(rawBody, 'utf8') : Buffer.from(rawBody);
    const expected = createHmac('sha256', secret)
      .update(`${timestamp}.`, 'utf8')
      .update(body)
      .digest();
    if (!signatures.some((candidate) => matches(expected, candidate))) {
      throw new SignatureVerificationError('No signature matches the body.', 'signature');
    }

    try {
      return JSON.parse(body.toString('utf8')) as WebhookEvent;
    } catch {
      throw new SignatureVerificationError('The body is not valid JSON.', 'payload');
    }
  }
}

/** Webhook verification, usable without an API key. */
export const webhooks = new Webhooks();
