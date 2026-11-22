import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Agilis } from '../src/index.js';
import { formOf, jsonOf, setup, TEST_KEY, type RecordedCall } from './helpers.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const png = { data: new Uint8Array([0x89, 0x50, 0x4e, 0x47]), filename: 'offer.png' };

interface Case {
  name: string;
  call: (client: Agilis) => Promise<unknown>;
  method: string;
  path: string;
  query?: Record<string, string>;
  json?: unknown;
  form?: Record<string, string[]>;
  file?: { name: string; filename: string; type: string };
  headers?: Record<string, string>;
  idempotent?: boolean;
}

const cases: Case[] = [
  { name: 'categories.list', call: (c) => c.categories.list(), method: 'GET', path: '/categories' },
  { name: 'interests.list', call: (c) => c.interests.list(), method: 'GET', path: '/interests' },
  {
    name: 'offers.estimatePrice',
    call: (c) =>
      c.offers.estimatePrice({
        start_datetime: '2027-07-10T08:00:00Z',
        end_datetime: '2027-07-12T20:30:00Z',
        location: [51.5074, -0.1278],
        radius: 10,
        gender: ['Male', 'Female'],
        interests: [3, 7],
      }),
    method: 'POST',
    path: '/offers/price-estimate',
    json: {
      start_datetime: '2027-07-10T08:00:00Z',
      end_datetime: '2027-07-12T20:30:00Z',
      location: [51.5074, -0.1278],
      radius: 10,
      gender: ['Male', 'Female'],
      interests: [3, 7],
      environment: 'TEST',
    },
  },
  {
    name: 'offers.create',
    call: (c) =>
      c.offers.create(
        {
          category_id: 1,
          title: '20% off summer sale',
          description: 'Discount valid through July',
          push_notification_title: '20% off this summer',
          push_notification_message: 'Show this at the till for 20% off.',
          url: 'https://example.com/offer',
          image: png,
          location: [51.5074, -0.1278],
          radius: 10,
          gender: ['Male', 'Female'],
          interests: [3, 7],
          start_datetime: '2027-07-10T08:00:00Z',
          expiry_datetime: '2027-07-12T20:30:00Z',
          payment_method: 'B',
        },
        { idempotencyKey: 'my-key-1', dryRun: true },
      ),
    method: 'POST',
    path: '/offers',
    query: { dry_run: 'true' },
    headers: { 'Idempotency-Key': 'my-key-1' },
    form: {
      category_id: ['1'],
      title: ['20% off summer sale'],
      'location[]': ['51.5074', '-0.1278'],
      'gender[]': ['Male', 'Female'],
      'interests[]': ['3', '7'],
      radius: ['10'],
      payment_method: ['B'],
      environment: ['TEST'],
    },
    file: { name: 'image', filename: 'offer.png', type: 'image/png' },
  },
  {
    name: 'offers.list',
    call: (c) => c.offers.list({ limit: 20, offer_status: 'active', cursor: 'abc' }),
    method: 'GET',
    path: '/offers',
    query: { environment: 'TEST', limit: '20', offer_status: 'active', cursor: 'abc' },
  },
  {
    name: 'offers.pause',
    call: (c) => c.offers.pause(45),
    method: 'POST',
    path: '/offers/45/pause',
  },
  {
    name: 'offers.resume',
    call: (c) => c.offers.resume(45),
    method: 'POST',
    path: '/offers/45/resume',
  },
  {
    name: 'offers.analytics',
    call: (c) => c.offers.analytics(45, { interval: '7d' }),
    method: 'GET',
    path: '/offers/45/analytics',
    query: { interval: '7d' },
  },
  {
    name: 'offers.delete',
    call: (c) => c.offers.delete(45, { dryRun: true }),
    method: 'DELETE',
    path: '/offers/45',
    query: { dry_run: 'true' },
  },
  {
    name: 'eventCategories.list',
    call: (c) => c.eventCategories.list(),
    method: 'GET',
    path: '/event-categories',
  },
  {
    name: 'eventCurrencies.list',
    call: (c) => c.eventCurrencies.list(),
    method: 'GET',
    path: '/event-currencies',
  },
  {
    name: 'eventConfig.get',
    call: (c) => c.eventConfig.get(),
    method: 'GET',
    path: '/event-config',
  },
  {
    name: 'events.preview',
    call: (c) =>
      c.events.preview({
        title: 'Salsa night',
        image: { data: new Blob([new Uint8Array([1, 2, 3])]), filename: 'salsa.JPG' },
        crop: { x: 10, y: 20, w: 300 },
      }),
    method: 'POST',
    path: '/events/preview',
    form: {
      title: ['Salsa night'],
      'crop[x]': ['10'],
      'crop[y]': ['20'],
      'crop[w]': ['300'],
      environment: ['TEST'],
    },
    file: { name: 'image', filename: 'salsa.JPG', type: 'image/jpeg' },
  },
  {
    name: 'events.publish',
    call: (c) =>
      c.events.publish(
        {
          title: 'Beginners Cuban Salsa',
          description: 'Drop-in class for absolute beginners.',
          venue_name: 'Bar Salsa',
          address: '96 Charing Cross Road',
          city: 'London',
          country_code: 'GB',
          location: [51.5133, -0.13],
          starts_at: '2027-10-16T18:30:00Z',
          ends_at: '2027-10-16T23:00:00Z',
          url: 'https://example.com/classes',
          price_min: 12,
          price_max: 12,
          currency: 'GBP',
          preview_token: 'ptok_1',
          payment_method: 'B',
          environment: 'TEST',
        },
        { dryRun: true },
      ),
    method: 'POST',
    path: '/events',
    query: { dry_run: 'true' },
    idempotent: true,
    form: {
      title: ['Beginners Cuban Salsa'],
      'location[]': ['51.5133', '-0.13'],
      price_min: ['12'],
      preview_token: ['ptok_1'],
      payment_method: ['B'],
      environment: ['TEST'],
    },
  },
  {
    name: 'events.list',
    call: (c) => c.events.list({ event_status: 'scheduled', owner_user_id: 41 }),
    method: 'GET',
    path: '/events',
    query: { environment: 'TEST', event_status: 'scheduled', owner_user_id: '41' },
  },
  { name: 'events.get', call: (c) => c.events.get(3104), method: 'GET', path: '/events/3104' },
  {
    name: 'events.edit (no file)',
    call: (c) =>
      c.events.edit(3104, {
        title: 'Thursday Comedy Club',
        location: [51.5, -0.1],
        crop: { x: 0, y: 0, w: 500 },
      }),
    method: 'PATCH',
    path: '/events/3104',
    form: {
      title: ['Thursday Comedy Club'],
      'location[]': ['51.5', '-0.1'],
      'crop[x]': ['0'],
      'crop[w]': ['500'],
    },
  },
  {
    name: 'events.edit (with file)',
    call: (c) => c.events.edit(3104, { title: 'Comedy', image: png }),
    method: 'POST',
    path: '/events/3104',
    headers: { 'X-HTTP-Method-Override': 'PATCH' },
    form: { title: ['Comedy'] },
    file: { name: 'image', filename: 'offer.png', type: 'image/png' },
  },
  {
    name: 'events.delete',
    call: (c) => c.events.delete(3104, { dryRun: true }),
    method: 'DELETE',
    path: '/events/3104',
    query: { dry_run: 'true' },
  },
  {
    name: 'events.reschedule',
    call: (c) =>
      c.events.reschedule(3104, {
        starts_at: '2027-10-23T18:30:00Z',
        ends_at: '2027-10-23T23:00:00Z',
      }),
    method: 'POST',
    path: '/events/3104/reschedule',
    json: { starts_at: '2027-10-23T18:30:00Z', ends_at: '2027-10-23T23:00:00Z' },
  },
  {
    name: 'events.cancel',
    call: (c) => c.events.cancel(3104, { dryRun: true }),
    method: 'POST',
    path: '/events/3104/cancel',
    query: { dry_run: 'true' },
  },
  {
    name: 'events.analytics',
    call: (c) => c.events.analytics(3104, { interval: '7d' }),
    method: 'GET',
    path: '/events/3104/analytics',
    query: { interval: '7d' },
  },
  {
    name: 'webhookEndpoints.list',
    call: (c) => c.webhookEndpoints.list(),
    method: 'GET',
    path: '/webhook-endpoints',
  },
  {
    name: 'webhookEndpoints.create',
    call: (c) =>
      c.webhookEndpoints.create({
        url: 'https://example.com/hooks',
        enabled_events: ['offer.started', 'event.published'],
        description: 'Main',
      }),
    method: 'POST',
    path: '/webhook-endpoints',
    json: {
      url: 'https://example.com/hooks',
      enabled_events: ['offer.started', 'event.published'],
      description: 'Main',
    },
  },
  {
    name: 'webhookEndpoints.get',
    call: (c) => c.webhookEndpoints.get('we_123'),
    method: 'GET',
    path: '/webhook-endpoints/we_123',
  },
  {
    name: 'webhookEndpoints.update',
    call: (c) => c.webhookEndpoints.update('we_123', { status: 'disabled' }),
    method: 'PATCH',
    path: '/webhook-endpoints/we_123',
    json: { status: 'disabled' },
  },
  {
    name: 'webhookEndpoints.delete',
    call: (c) => c.webhookEndpoints.delete('we_123'),
    method: 'DELETE',
    path: '/webhook-endpoints/we_123',
  },
  {
    name: 'webhookEndpoints.rollSecret',
    call: (c) => c.webhookEndpoints.rollSecret('we_123', { expires_in: '24h' }),
    method: 'POST',
    path: '/webhook-endpoints/we_123/roll-secret',
    json: { expires_in: '24h' },
  },
  {
    name: 'webhookEndpoints.sendTest',
    call: (c) => c.webhookEndpoints.sendTest('we_123', { type: 'offer.started' }),
    method: 'POST',
    path: '/webhook-endpoints/we_123/test',
    json: { type: 'offer.started' },
  },
  {
    name: 'webhookEvents.list',
    call: (c) => c.webhookEvents.list({ type: 'offer.started', delivery_success: false, limit: 5 }),
    method: 'GET',
    path: '/webhook-events',
    query: { type: 'offer.started', delivery_success: 'false', limit: '5' },
  },
  {
    name: 'webhookEvents.get',
    call: (c) => c.webhookEvents.get('whevt_1'),
    method: 'GET',
    path: '/webhook-events/whevt_1',
  },
  {
    name: 'webhookEvents.resend',
    call: (c) => c.webhookEvents.resend('whevt_1', { endpoint_id: 'we_123' }),
    method: 'POST',
    path: '/webhook-events/whevt_1/resend',
    json: { endpoint_id: 'we_123' },
  },
];

function checkCommon(call: RecordedCall) {
  expect(call.url.origin).toBe('https://ads.agilis.dating');
  expect(call.headers['x-api-key']).toBe(TEST_KEY);
  expect(call.headers.Accept).toBe('application/json');
  expect(call.headers['User-Agent']).toMatch(
    /^agilis-ads-node\/\d+\.\d+\.\d+ \(Node\.js v\d+\.\d+\.\d+\)$/,
  );
  expect(call.url.toString()).not.toContain(TEST_KEY);
}

describe('operations', () => {
  it('covers every operation in the API', () => {
    const names = new Set(cases.map((c) => c.name.replace(/ \(.*\)$/, '')));
    const spec = JSON.parse(
      readFileSync(new URL('../openapi/openapi.json', import.meta.url), 'utf8'),
    ) as { paths: Record<string, Record<string, unknown>> };
    const operations = Object.values(spec.paths).flatMap((item) =>
      Object.keys(item).filter((m) => ['get', 'post', 'patch', 'put', 'delete'].includes(m)),
    );
    expect(names.size).toBe(operations.length);
  });

  for (const c of cases) {
    it(`${c.name} sends ${c.method} ${c.path}`, async () => {
      const { client, calls } = setup();
      await c.call(client);
      expect(calls).toHaveLength(1);
      const [call] = calls;
      checkCommon(call);
      expect(call.method).toBe(c.method);
      expect(call.url.pathname).toBe(c.path);
      expect(Object.fromEntries(call.url.searchParams)).toEqual(c.query ?? {});

      for (const [name, value] of Object.entries(c.headers ?? {})) {
        expect(call.headers[name]).toBe(value);
      }
      if (c.idempotent) {
        expect(call.headers['Idempotency-Key']).toMatch(
          /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
        );
      } else if (!c.headers?.['Idempotency-Key']) {
        expect(call.headers['Idempotency-Key']).toBeUndefined();
      }
      if (c.method !== 'POST' || !c.file) {
        expect(call.headers['X-HTTP-Method-Override']).toBe(c.headers?.['X-HTTP-Method-Override']);
      }

      if (c.json !== undefined) {
        expect(call.headers['Content-Type']).toBe('application/json');
        expect(jsonOf(call)).toEqual(c.json);
      } else if (c.form !== undefined) {
        const form = formOf(call);
        for (const [name, values] of Object.entries(c.form)) {
          expect(form.getAll(name)).toEqual(values);
        }
        if (c.file) {
          const file = form.get(c.file.name);
          expect(file).toBeInstanceOf(Blob);
          expect((file as File).name).toBe(c.file.filename);
          expect((file as File).type).toBe(c.file.type);
        } else {
          expect(form.get('image')).toBeNull();
        }
      } else {
        expect(call.body).toBeUndefined();
      }
    });
  }

  it('keeps the caller environment when given', async () => {
    const { client, calls } = setup();
    await client.offers.list({ environment: 'TEST', limit: 1 });
    expect(calls[0].url.searchParams.get('environment')).toBe('TEST');
  });

  it('uses a custom base URL and encodes path parameters', async () => {
    const { client, calls } = setup(undefined, { baseURL: 'http://localhost:8080/' });
    await client.webhookEvents.get('a/b c');
    expect(calls[0].url.toString()).toBe('http://localhost:8080/webhook-events/a%2Fb%20c');
  });

  it('reads an image from a file path', async () => {
    const { client, calls } = setup();
    const path = fileURLToPath(new URL('./fixtures/sample-offer.png', import.meta.url));
    await client.events.preview({ title: 'x', image: path });
    const file = formOf(calls[0]).get('image') as File;
    expect(file.name).toBe('sample-offer.png');
    expect(file.type).toBe('image/png');
    expect(file.size).toBeGreaterThan(100);
  });

  it('reads an image from a stream', async () => {
    const { client, calls } = setup();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([1, 2]));
        controller.enqueue(new Uint8Array([3]));
        controller.close();
      },
    });
    await client.events.preview({ title: 'x', image: { data: stream, filename: 'a.gif' } });
    const file = formOf(calls[0]).get('image') as File;
    expect(file.type).toBe('image/gif');
    expect(new Uint8Array(await file.arrayBuffer())).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('returns the parsed body with unknown fields, status and headers', async () => {
    const { client } = setup([
      {
        status: 200,
        body: { categories: [{ category_id: 1, category_name: 'Retail', brand_new: 'kept' }] },
        headers: { 'X-RateLimit-Remaining': '59' },
      },
    ]);
    const result = await client.categories.list();
    expect(result.categories?.[0]).toEqual({
      category_id: 1,
      category_name: 'Retail',
      brand_new: 'kept',
    });
    expect(result.lastResponse.status).toBe(200);
    expect(result.lastResponse.headers.get('x-ratelimit-remaining')).toBe('59');
    expect(Object.keys(result)).toEqual(['categories']);
  });
});
