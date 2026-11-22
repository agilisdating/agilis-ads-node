import { vi } from 'vitest';
import { Agilis, type ClientOptions } from '../src/index.js';
import { timers } from '../src/core.js';

export const TEST_KEY = 'pk_test_0123456789abcdefSECRETVALUE';
export const LIVE_KEY = 'pk_live_0123456789abcdefSECRETVALUE';

export interface RecordedCall {
  url: URL;
  method: string;
  headers: Record<string, string>;
  body: RequestInit['body'];
}

export type Reply =
  { status?: number; body?: unknown; headers?: Record<string, string>; raw?: string } | Error;

export function json(body: unknown, status = 200, headers: Record<string, string> = {}): Reply {
  return { status, body, headers };
}

/** A fake fetch that answers from a queue (the last reply repeats) and records each call. */
export function fakeFetch(replies: Reply[] = [json({ return_code: 'S1' })]) {
  const calls: RecordedCall[] = [];
  let index = 0;
  const fn = vi.fn(async (input: string, init: RequestInit) => {
    calls.push({
      url: new URL(input),
      method: init.method ?? 'GET',
      headers: { ...(init.headers as Record<string, string>) },
      body: init.body,
    });
    const reply = replies[Math.min(index, replies.length - 1)];
    index += 1;
    if (reply instanceof Error) throw reply;
    const text = reply.raw ?? (reply.body === undefined ? '' : JSON.stringify(reply.body));
    return new Response(text, {
      status: reply.status ?? 200,
      headers: { 'Content-Type': 'application/json', ...reply.headers },
    });
  });
  return { fn, calls };
}

/** A client with a fake fetch and recorded (instant) waits. */
export function setup(replies?: Reply[], options: ClientOptions = {}) {
  const fetch = fakeFetch(replies);
  const waits: number[] = [];
  vi.spyOn(timers, 'sleep').mockImplementation(async (ms: number) => {
    waits.push(ms);
  });
  vi.spyOn(timers, 'random').mockReturnValue(0.5);
  const client = new Agilis({ apiKey: TEST_KEY, fetch: fetch.fn, ...options });
  return { client, calls: fetch.calls, fetch: fetch.fn, waits };
}

/** The FormData sent with a call. */
export function formOf(call: RecordedCall): FormData {
  if (!(call.body instanceof FormData)) throw new Error('The request body was not FormData');
  return call.body;
}

/** The JSON body sent with a call. */
export function jsonOf(call: RecordedCall): unknown {
  return JSON.parse(String(call.body));
}
