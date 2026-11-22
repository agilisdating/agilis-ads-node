// Runs against the real API in Test mode. Reads, plus dryRun calls that create nothing.
// Needs AGILIS_TEST_API_KEY; skipped without it. Refuses a Live key.
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { Agilis, InvalidRequestError, PermissionError } from '../../src/index.js';

const apiKey = process.env.AGILIS_TEST_API_KEY ?? '';
const baseURL = process.env.AGILIS_BASE_URL || undefined;

if (apiKey.startsWith('pk_live_')) {
  throw new Error('Refusing to run the integration tests with a Live key. Use a pk_test_ key.');
}

const image = fileURLToPath(new URL('../fixtures/sample-offer.png', import.meta.url));

function future(days: number): string {
  const date = new Date(Date.now() + days * 86_400_000);
  date.setUTCMinutes(0, 0, 0);
  return date.toISOString().replace('.000Z', 'Z');
}

describe.skipIf(apiKey === '')('Test mode', () => {
  // The suite body is collected even when skipped, so only build the client with a key.
  const client = apiKey ? new Agilis({ apiKey, baseURL }) : (undefined as unknown as Agilis);

  it('uses a Test key', () => {
    expect(client.mode).toBe('test');
  });

  it('lists categories and interests', async () => {
    const categories = await client.categories.list();
    expect(Array.isArray(categories.categories)).toBe(true);
    expect(categories.lastResponse.status).toBe(200);
    const interests = await client.interests.list();
    expect(Array.isArray(interests.interests)).toBe(true);
  });

  it('lists Offers and Events', async () => {
    const offers = await client.offers.list({ limit: 5 });
    expect(Array.isArray(offers.data)).toBe(true);
    const events = await client.events.list({ limit: 5 });
    expect(Array.isArray(events.data)).toBe(true);
  });

  it('estimates an Offer price', async () => {
    const estimate = await client.offers.estimatePrice({
      start_datetime: future(7),
      end_datetime: future(9),
      location: [51.5074, -0.1278],
      radius: 10,
    });
    expect(estimate.return_code).toBe('S1');
  });

  it('reads the event config', async () => {
    const config = await client.eventConfig.get();
    expect(config.lastResponse.status).toBe(200);
  });

  it('lists webhook endpoints and events', async () => {
    try {
      const endpoints = await client.webhookEndpoints.list();
      expect(Array.isArray(endpoints.data)).toBe(true);
      const events = await client.webhookEvents.list({ limit: 5 });
      expect(Array.isArray(events.data)).toBe(true);
    } catch (error) {
      // An Advertiser's key may not manage webhooks.
      expect(error).toBeInstanceOf(PermissionError);
    }
  });

  it('checks an Offer with dryRun', async () => {
    const categories = await client.categories.list();
    const categoryId = categories.categories?.[0]?.category_id ?? 1;
    try {
      const result = await client.offers.create(
        {
          category_id: categoryId,
          title: 'SDK dry run',
          description: 'A dry run from the Node.js SDK tests. Nothing is created.',
          push_notification_title: 'SDK dry run',
          push_notification_message: 'A dry run from the Node.js SDK tests.',
          url: 'https://www.agilis.dating',
          image,
          location: [51.5074, -0.1278],
          radius: 10,
          start_datetime: future(7),
          expiry_datetime: future(9),
          payment_method: 'B',
        },
        { dryRun: true },
      );
      expect(result.return_code).toMatch(/^S/);
    } catch (error) {
      // A refusal (for example a balance too low) still shows the request was understood.
      expect(error).toBeInstanceOf(InvalidRequestError);
    }
  });

  it('checks an Event with dryRun', async () => {
    try {
      const result = await client.events.publish(
        {
          title: 'SDK dry run social',
          description: 'A dry run from the Node.js SDK tests. Nothing is published.',
          venue_name: 'Test venue',
          address: '1 Test Street',
          city: 'London',
          country_code: 'GB',
          location: [51.5133, -0.13],
          starts_at: future(14),
          ends_at: future(14.125),
          url: 'https://www.agilis.dating',
          image,
          payment_method: 'B',
        },
        { dryRun: true },
      );
      expect(result.return_code).toMatch(/^S/);
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidRequestError);
    }
  });
});
