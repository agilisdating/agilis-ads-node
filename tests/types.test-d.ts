import { describe, expectTypeOf, it } from 'vitest';
import type {
  Agilis,
  CreateOfferParams,
  Event,
  Offer,
  WebhookEvent,
  WebhookEventOf,
  WebhookEventType,
} from '../src/index.js';

describe('types', () => {
  it('narrows webhook events by type', () => {
    const handle = (event: WebhookEvent) => {
      switch (event.type) {
        case 'offer.started':
          expectTypeOf(event.data.object).toEqualTypeOf<Offer>();
          break;
        case 'event.cancelled':
          expectTypeOf(event.data.object).toEqualTypeOf<Event>();
          break;
        case 'balance.low':
          expectTypeOf(event.data.balance).toEqualTypeOf<number | undefined>();
          break;
        case 'invoice.created':
          expectTypeOf(event.data.object.invoice_number).toEqualTypeOf<string | undefined>();
          break;
      }
    };
    expectTypeOf(handle).toBeFunction();
    expectTypeOf<WebhookEventOf<'offer.created'>['type']>().toEqualTypeOf<'offer.created'>();
    expectTypeOf<'terms.version_issued'>().toExtend<WebhookEventType>();
  });

  it('makes environment optional and the image an upload', () => {
    expectTypeOf<CreateOfferParams['environment']>().toEqualTypeOf<'TEST' | 'LIVE' | undefined>();
    expectTypeOf<string>().toExtend<CreateOfferParams['image']>();
  });

  it('returns typed responses with the HTTP details', () => {
    type Result = Awaited<ReturnType<Agilis['offers']['list']>>;
    expectTypeOf<Result['data']>().toEqualTypeOf<Offer[] | undefined>();
    expectTypeOf<Result['lastResponse']['status']>().toEqualTypeOf<number>();
    type Mode = Agilis['mode'];
    expectTypeOf<Mode>().toEqualTypeOf<'test' | 'live'>();
  });
});
