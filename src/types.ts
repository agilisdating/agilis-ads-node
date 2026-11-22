import type { operations, webhooks } from './generated/openapi.js';
import type { Uploadable } from './uploads.js';

type Op = keyof operations;
type JsonOf<T> = T extends { content: { 'application/json': infer B } } ? B : never;
type Ok<K extends Op> = operations[K]['responses'] extends { 200: infer R } ? JsonOf<R> : never;
type Query<K extends Op> = NonNullable<operations[K]['parameters']['query']>;
type JsonBody<K extends Op> =
  NonNullable<operations[K]['requestBody']> extends { content: { 'application/json': infer B } }
    ? B
    : never;
type FormBody<K extends Op> =
  NonNullable<operations[K]['requestBody']> extends { content: { 'multipart/form-data': infer B } }
    ? B
    : never;
type Item<A> = NonNullable<A> extends readonly (infer I)[] ? I : never;
type Simplify<T> = { [K in keyof T]: T[K] } & {};
type WithOptionalEnvironment<T> = Simplify<
  Omit<T, 'environment'> & {
    /** Filled in from the API key's mode when left out. */
    environment?: T extends { environment?: infer E } ? E : Environment;
  }
>;

/** TEST or LIVE. Set by the API key: `pk_test_` keys are TEST, `pk_live_` keys LIVE. */
export type Environment = 'TEST' | 'LIVE';

/** The area of an image to use, in pixels of the original: a square from (x, y), w wide. */
export interface Crop {
  x: number;
  y: number;
  w: number;
}

// Categories and interests

export type ListCategoriesResponse = Ok<'listCategories'>;
export type Category = Item<ListCategoriesResponse['categories']>;
export type ListInterestsResponse = Ok<'listInterests'>;
export type Interest = Item<ListInterestsResponse['interests']>;

// Offers

export type EstimateOfferPriceParams = WithOptionalEnvironment<JsonBody<'estimateOfferPrice'>>;
export type EstimateOfferPriceResponse = Ok<'estimateOfferPrice'>;

export type CreateOfferParams = Simplify<
  Omit<WithOptionalEnvironment<FormBody<'createOffer'>>, 'image'> & {
    /** JPG, PNG or GIF, up to 5 MB. */
    image: Uploadable;
  }
>;
export type CreateOfferResponse = Ok<'createOffer'>;

export type ListOffersParams = WithOptionalEnvironment<Query<'listOffers'>>;
export type ListOffersResponse = Ok<'listOffers'>;
export type Offer = Item<ListOffersResponse['data']>;

export type PauseOfferResponse = Ok<'pauseOffer'>;
export type ResumeOfferResponse = Ok<'resumeOffer'>;
export type GetOfferAnalyticsParams = Query<'getOfferAnalytics'>;
export type OfferAnalytics = Ok<'getOfferAnalytics'>;
export type DeleteOfferResponse = Ok<'deleteOffer'>;

// Event reference data

export type ListEventCategoriesResponse = Ok<'listEventCategories'>;
export type EventCategory = Item<ListEventCategoriesResponse['categories']>;
export type ListEventCurrenciesResponse = Ok<'listEventCurrencies'>;
export type EventConfig = Ok<'getEventConfig'>;

// Events

type CropFields = 'crop[x]' | 'crop[y]' | 'crop[w]';

export type PreviewEventParams = Simplify<
  Omit<WithOptionalEnvironment<FormBody<'previewEvent'>>, 'image' | CropFields> & {
    image?: Uploadable;
    crop?: Crop;
  }
>;
export type PreviewEventResponse = Ok<'previewEvent'>;

export type PublishEventParams = Simplify<
  Omit<WithOptionalEnvironment<FormBody<'publishEvent'>>, 'image' | CropFields> & {
    /** JPG, PNG or GIF. Or use `preview_token` or `source_event_id` instead. */
    image?: Uploadable;
    crop?: Crop;
  }
>;
export type PublishEventResponse = Ok<'publishEvent'>;

export type ListEventsParams = WithOptionalEnvironment<Query<'listEvents'>>;
export type ListEventsResponse = Ok<'listEvents'>;
export type Event = Item<ListEventsResponse['data']>;
export type GetEventResponse = Simplify<Event & Ok<'getEvent'>>;

/** Send only the fields to change. Dates are changed with `events.reschedule`. */
export interface EditEventParams {
  title?: string;
  description?: string;
  url?: string;
  /** Send an empty string to go back to your trading name. */
  advertised_name?: string;
  venue_name?: string;
  address?: string;
  city?: string;
  country_code?: string;
  /** Latitude, then longitude. */
  location?: [number, number] | number[];
  /** A price change sends `price_min`, `price_max` and `currency` together (all empty for no price). */
  price_min?: number | string;
  price_max?: number | string;
  currency?: string;
  /** A replacement picture. */
  image?: Uploadable;
  preview_token?: string;
  source_event_id?: number;
  /** On its own, re-frames the existing image; with `image`, the area of the new one. */
  crop?: Crop;
}
export type EditEventResponse = Ok<'editEvent'>;

export type DeleteEventResponse = Ok<'deleteEvent'>;
export type RescheduleEventParams = JsonBody<'rescheduleEvent'>;
export type RescheduleEventResponse = Ok<'rescheduleEvent'>;
export type CancelEventResponse = Ok<'cancelEvent'>;
export type GetEventAnalyticsParams = Query<'getEventAnalytics'>;
export type EventAnalytics = Ok<'getEventAnalytics'>;

// Webhook endpoints

export type ListWebhookEndpointsResponse = Ok<'listWebhookEndpoints'>;
export type WebhookEndpoint = Ok<'getWebhookEndpoint'>;
export type CreateWebhookEndpointParams = JsonBody<'createWebhookEndpoint'>;
/** The new endpoint, with its signing `secret` (shown only this once). */
export type CreateWebhookEndpointResponse = Ok<'createWebhookEndpoint'>;
export type UpdateWebhookEndpointParams = JsonBody<'updateWebhookEndpoint'>;
export type UpdateWebhookEndpointResponse = Ok<'updateWebhookEndpoint'>;
export type DeleteWebhookEndpointResponse = Ok<'deleteWebhookEndpoint'>;
export type RollWebhookSecretParams = JsonBody<'rollWebhookSecret'>;
/** The endpoint, with its new signing `secret` (shown only this once). */
export type RollWebhookSecretResponse = Ok<'rollWebhookSecret'>;
export type SendTestWebhookParams = JsonBody<'sendTestWebhook'>;
export type SendTestWebhookResponse = Ok<'sendTestWebhook'>;

// Webhook events (the delivery log)

export type ListWebhookEventsParams = Query<'listWebhookEvents'>;
export type ListWebhookEventsResponse = Ok<'listWebhookEvents'>;
export type WebhookEventSummary = Item<ListWebhookEventsResponse['data']>;
export type GetWebhookEventResponse = Ok<'getWebhookEvent'>;
export type ResendWebhookEventParams = JsonBody<'resendWebhookEvent'>;
export type ResendWebhookEventResponse = Ok<'resendWebhookEvent'>;

// Received webhook messages

/** Every webhook event type. */
export type WebhookEventType = keyof webhooks;

type RawWebhook<K extends WebhookEventType> = NonNullable<
  webhooks[K]['post']
>['requestBody']['content']['application/json'];

type WebhookObject<K extends WebhookEventType> = K extends `offer.${string}`
  ? Offer
  : K extends `event.${string}`
    ? Event
    : RawWebhook<K>['data']['object'];

/** A received webhook message of one type. */
export type WebhookEventOf<K extends WebhookEventType> = Simplify<
  Omit<RawWebhook<K>, 'data'> & {
    data: Simplify<Omit<RawWebhook<K>['data'], 'object'> & { object: WebhookObject<K> }>;
  }
>;

/** A received webhook message. Narrow it by `type`. */
export type WebhookEvent = { [K in WebhookEventType]: WebhookEventOf<K> }[WebhookEventType];

/** The same as `Event`, for code where the name would clash with the DOM's `Event`. */
export type AgilisEvent = Event;
