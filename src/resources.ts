import type {
  Core,
  CreateOptions,
  DryRunOptions,
  QueryValue,
  RequestOptions,
  WithResponse,
} from './core.js';
import type * as T from './types.js';

type Mode = 'test' | 'live';

function id(value: string | number): string {
  return encodeURIComponent(String(value));
}

function withEnvironment<P extends { environment?: unknown }>(params: P, mode: Mode): P {
  if (params.environment !== undefined && params.environment !== null) return params;
  return { ...params, environment: mode.toUpperCase() };
}

function query(params: object | undefined): Record<string, QueryValue> {
  return (params ?? {}) as Record<string, QueryValue>;
}

interface Paginated<Item> {
  data?: Item[];
  pagination?: { has_more?: boolean; next_cursor?: unknown };
}

async function* autoPage<Item, P extends { cursor?: string }>(
  fetchPage: (params: P) => Promise<Paginated<Item>>,
  params: P,
): AsyncGenerator<Item, void, undefined> {
  let current: P = { ...params };
  for (;;) {
    const page = await fetchPage(current);
    yield* page.data ?? [];
    const next = page.pagination?.next_cursor;
    if (!page.pagination?.has_more || typeof next !== 'string' || next === '') return;
    current = { ...current, cursor: next };
  }
}

abstract class Resource {
  constructor(
    protected readonly core: Core,
    protected readonly mode: Mode,
  ) {}
}

export class Categories extends Resource {
  /** GET /categories: the Offer categories. */
  list(options?: RequestOptions): Promise<WithResponse<T.ListCategoriesResponse>> {
    return this.core.request({ method: 'GET', path: '/categories', options });
  }
}

export class Interests extends Resource {
  /** GET /interests: the interests an Offer can target. */
  list(options?: RequestOptions): Promise<WithResponse<T.ListInterestsResponse>> {
    return this.core.request({ method: 'GET', path: '/interests', options });
  }
}

export class Offers extends Resource {
  /** POST /offers/price-estimate: the price of an Offer before creating it. */
  estimatePrice(
    params: T.EstimateOfferPriceParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.EstimateOfferPriceResponse>> {
    return this.core.request({
      method: 'POST',
      path: '/offers/price-estimate',
      json: withEnvironment(params, this.mode),
      options,
    });
  }

  /** POST /offers: creates an Offer (multipart, with its image). */
  create(
    params: T.CreateOfferParams,
    options?: CreateOptions,
  ): Promise<WithResponse<T.CreateOfferResponse>> {
    return this.core.request({
      method: 'POST',
      path: '/offers',
      form: withEnvironment(params, this.mode),
      idempotent: true,
      options,
    });
  }

  /** GET /offers: one page of your Offers. */
  list(
    params: T.ListOffersParams = {},
    options?: RequestOptions,
  ): Promise<WithResponse<T.ListOffersResponse>> {
    return this.core.request({
      method: 'GET',
      path: '/offers',
      query: query(withEnvironment(params, this.mode)),
      options,
    });
  }

  /** Every Offer matching `params`, following `next_cursor` page by page. */
  listAutoPaging(
    params: T.ListOffersParams = {},
    options?: RequestOptions,
  ): AsyncGenerator<T.Offer, void, undefined> {
    return autoPage((p) => this.list(p, options), params);
  }

  /** POST /offers/{offer_id}/pause */
  pause(
    offerId: number | string,
    options?: RequestOptions,
  ): Promise<WithResponse<T.PauseOfferResponse>> {
    return this.core.request({ method: 'POST', path: `/offers/${id(offerId)}/pause`, options });
  }

  /** POST /offers/{offer_id}/resume */
  resume(
    offerId: number | string,
    options?: RequestOptions,
  ): Promise<WithResponse<T.ResumeOfferResponse>> {
    return this.core.request({ method: 'POST', path: `/offers/${id(offerId)}/resume`, options });
  }

  /** GET /offers/{offer_id}/analytics */
  analytics(
    offerId: number | string,
    params: T.GetOfferAnalyticsParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.OfferAnalytics>> {
    return this.core.request({
      method: 'GET',
      path: `/offers/${id(offerId)}/analytics`,
      query: query(params),
      options,
    });
  }

  /** DELETE /offers/{offer_id} */
  delete(
    offerId: number | string,
    options?: DryRunOptions,
  ): Promise<WithResponse<T.DeleteOfferResponse>> {
    return this.core.request({ method: 'DELETE', path: `/offers/${id(offerId)}`, options });
  }
}

export class EventCategories extends Resource {
  /** GET /event-categories */
  list(options?: RequestOptions): Promise<WithResponse<T.ListEventCategoriesResponse>> {
    return this.core.request({ method: 'GET', path: '/event-categories', options });
  }
}

export class EventCurrencies extends Resource {
  /** GET /event-currencies */
  list(options?: RequestOptions): Promise<WithResponse<T.ListEventCurrenciesResponse>> {
    return this.core.request({ method: 'GET', path: '/event-currencies', options });
  }
}

export class EventConfigResource extends Resource {
  /** GET /event-config: the listing fee, your balance and the image rules. */
  get(options?: RequestOptions): Promise<WithResponse<T.EventConfig>> {
    return this.core.request({ method: 'GET', path: '/event-config', options });
  }
}

export class Events extends Resource {
  /** POST /events/preview: the category, fee and image framing, without publishing. */
  preview(
    params: T.PreviewEventParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.PreviewEventResponse>> {
    return this.core.request({
      method: 'POST',
      path: '/events/preview',
      form: withEnvironment(params, this.mode),
      options,
    });
  }

  /** POST /events: publishes an Event (multipart). */
  publish(
    params: T.PublishEventParams,
    options?: CreateOptions,
  ): Promise<WithResponse<T.PublishEventResponse>> {
    return this.core.request({
      method: 'POST',
      path: '/events',
      form: withEnvironment(params, this.mode),
      idempotent: true,
      options,
    });
  }

  /** GET /events: one page of your Events. */
  list(
    params: T.ListEventsParams = {},
    options?: RequestOptions,
  ): Promise<WithResponse<T.ListEventsResponse>> {
    return this.core.request({
      method: 'GET',
      path: '/events',
      query: query(withEnvironment(params, this.mode)),
      options,
    });
  }

  /** Every Event matching `params`, following `next_cursor` page by page. */
  listAutoPaging(
    params: T.ListEventsParams = {},
    options?: RequestOptions,
  ): AsyncGenerator<T.Event, void, undefined> {
    return autoPage((p) => this.list(p, options), params);
  }

  /** GET /events/{event_id} */
  get(
    eventId: number | string,
    options?: RequestOptions,
  ): Promise<WithResponse<T.GetEventResponse>> {
    return this.core.request({ method: 'GET', path: `/events/${id(eventId)}`, options });
  }

  /**
   * PATCH /events/{event_id}: changes a published Event. Always sent as a multipart POST
   * with `X-HTTP-Method-Override: PATCH`, with or without an image.
   */
  edit(
    eventId: number | string,
    params: T.EditEventParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.EditEventResponse>> {
    return this.core.request({
      method: 'POST',
      path: `/events/${id(eventId)}`,
      form: params as Record<string, unknown>,
      headers: { 'X-HTTP-Method-Override': 'PATCH' },
      options,
    });
  }

  /** DELETE /events/{event_id} */
  delete(
    eventId: number | string,
    options?: DryRunOptions,
  ): Promise<WithResponse<T.DeleteEventResponse>> {
    return this.core.request({ method: 'DELETE', path: `/events/${id(eventId)}`, options });
  }

  /** POST /events/{event_id}/reschedule */
  reschedule(
    eventId: number | string,
    params: T.RescheduleEventParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.RescheduleEventResponse>> {
    return this.core.request({
      method: 'POST',
      path: `/events/${id(eventId)}/reschedule`,
      json: params,
      options,
    });
  }

  /** POST /events/{event_id}/cancel */
  cancel(
    eventId: number | string,
    options?: DryRunOptions,
  ): Promise<WithResponse<T.CancelEventResponse>> {
    return this.core.request({ method: 'POST', path: `/events/${id(eventId)}/cancel`, options });
  }

  /** GET /events/{event_id}/analytics */
  analytics(
    eventId: number | string,
    params: T.GetEventAnalyticsParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.EventAnalytics>> {
    return this.core.request({
      method: 'GET',
      path: `/events/${id(eventId)}/analytics`,
      query: query(params),
      options,
    });
  }
}

export class WebhookEndpoints extends Resource {
  /** GET /webhook-endpoints */
  list(options?: RequestOptions): Promise<WithResponse<T.ListWebhookEndpointsResponse>> {
    return this.core.request({ method: 'GET', path: '/webhook-endpoints', options });
  }

  /** POST /webhook-endpoints: the response holds the signing secret, shown only this once. */
  create(
    params: T.CreateWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.CreateWebhookEndpointResponse>> {
    return this.core.request({ method: 'POST', path: '/webhook-endpoints', json: params, options });
  }

  /** GET /webhook-endpoints/{endpoint_id} */
  get(endpointId: string, options?: RequestOptions): Promise<WithResponse<T.WebhookEndpoint>> {
    return this.core.request({
      method: 'GET',
      path: `/webhook-endpoints/${id(endpointId)}`,
      options,
    });
  }

  /** PATCH /webhook-endpoints/{endpoint_id} */
  update(
    endpointId: string,
    params: T.UpdateWebhookEndpointParams,
    options?: RequestOptions,
  ): Promise<WithResponse<T.UpdateWebhookEndpointResponse>> {
    return this.core.request({
      method: 'PATCH',
      path: `/webhook-endpoints/${id(endpointId)}`,
      json: params,
      options,
    });
  }

  /** DELETE /webhook-endpoints/{endpoint_id} */
  delete(
    endpointId: string,
    options?: RequestOptions,
  ): Promise<WithResponse<T.DeleteWebhookEndpointResponse>> {
    return this.core.request({
      method: 'DELETE',
      path: `/webhook-endpoints/${id(endpointId)}`,
      options,
    });
  }

  /** POST /webhook-endpoints/{endpoint_id}/roll-secret: the new secret is shown only this once. */
  rollSecret(
    endpointId: string,
    params: T.RollWebhookSecretParams = {},
    options?: RequestOptions,
  ): Promise<WithResponse<T.RollWebhookSecretResponse>> {
    return this.core.request({
      method: 'POST',
      path: `/webhook-endpoints/${id(endpointId)}/roll-secret`,
      json: params,
      options,
    });
  }

  /** POST /webhook-endpoints/{endpoint_id}/test: sends a test event to the endpoint. */
  sendTest(
    endpointId: string,
    params: T.SendTestWebhookParams = {},
    options?: RequestOptions,
  ): Promise<WithResponse<T.SendTestWebhookResponse>> {
    return this.core.request({
      method: 'POST',
      path: `/webhook-endpoints/${id(endpointId)}/test`,
      json: params,
      options,
    });
  }
}

export class WebhookEvents extends Resource {
  /** GET /webhook-events: one page of the last 30 days' webhook events. */
  list(
    params: T.ListWebhookEventsParams = {},
    options?: RequestOptions,
  ): Promise<WithResponse<T.ListWebhookEventsResponse>> {
    return this.core.request({
      method: 'GET',
      path: '/webhook-events',
      query: query(params),
      options,
    });
  }

  /** Every webhook event matching `params`, following `next_cursor` page by page. */
  listAutoPaging(
    params: T.ListWebhookEventsParams = {},
    options?: RequestOptions,
  ): AsyncGenerator<T.WebhookEventSummary, void, undefined> {
    return autoPage((p) => this.list(p, options), params);
  }

  /** GET /webhook-events/{webhook_event_id} */
  get(
    webhookEventId: string,
    options?: RequestOptions,
  ): Promise<WithResponse<T.GetWebhookEventResponse>> {
    return this.core.request({
      method: 'GET',
      path: `/webhook-events/${id(webhookEventId)}`,
      options,
    });
  }

  /** POST /webhook-events/{webhook_event_id}/resend */
  resend(
    webhookEventId: string,
    params: T.ResendWebhookEventParams = {},
    options?: RequestOptions,
  ): Promise<WithResponse<T.ResendWebhookEventResponse>> {
    return this.core.request({
      method: 'POST',
      path: `/webhook-events/${id(webhookEventId)}/resend`,
      json: params,
      options,
    });
  }
}
