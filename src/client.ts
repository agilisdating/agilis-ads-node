import { Core, type Fetch } from './core.js';
import { AgilisError } from './errors.js';
import {
  Categories,
  EventCategories,
  EventConfigResource,
  EventCurrencies,
  Events,
  Interests,
  Offers,
  WebhookEndpoints,
  WebhookEvents,
} from './resources.js';
import { Webhooks, webhooks } from './webhooks.js';

/** Options for the client. */
export interface ClientOptions {
  /** Your API key. Read from the `AGILIS_API_KEY` environment variable when left out. */
  apiKey?: string;
  /** Default `https://ads.agilis.dating`. */
  baseURL?: string;
  /** Timeout for each attempt, in milliseconds. Default 60000 (60 seconds). */
  timeout?: number;
  /** Retries after a failed attempt, when retrying is safe. Default 2. */
  maxRetries?: number;
  /** The `fetch` function to use. Default: the global `fetch`. */
  fetch?: Fetch;
}

export const DEFAULT_BASE_URL = 'https://ads.agilis.dating';
export const DEFAULT_TIMEOUT = 60_000;
export const DEFAULT_MAX_RETRIES = 2;

/** The mode of an API key: `test` for `pk_test_` keys, `live` for `pk_live_` keys. */
export type Mode = 'test' | 'live';

/** The Agilis Advertising API client. */
export class Agilis {
  /** `test` or `live`, from the API key. */
  readonly mode: Mode;

  readonly categories: Categories;
  readonly interests: Interests;
  readonly offers: Offers;
  readonly eventCategories: EventCategories;
  readonly eventCurrencies: EventCurrencies;
  readonly eventConfig: EventConfigResource;
  readonly events: Events;
  readonly webhookEndpoints: WebhookEndpoints;
  readonly webhookEvents: WebhookEvents;
  /** Webhook signature verification. */
  readonly webhooks: Webhooks = webhooks;

  /** Webhook signature verification, usable without a client. */
  static readonly webhooks: Webhooks = webhooks;

  constructor(options: ClientOptions = {}) {
    const apiKey =
      options.apiKey ?? (typeof process !== 'undefined' ? process.env.AGILIS_API_KEY : undefined);
    if (!apiKey) {
      throw new AgilisError(
        'No API key: pass apiKey or set the AGILIS_API_KEY environment variable.',
      );
    }
    if (apiKey.startsWith('pk_test_')) this.mode = 'test';
    else if (apiKey.startsWith('pk_live_')) this.mode = 'live';
    else throw new AgilisError('The API key must start with pk_test_ or pk_live_.');

    const fetchImpl = options.fetch ?? (globalThis.fetch as Fetch | undefined);
    if (!fetchImpl) throw new AgilisError('No fetch function is available: pass one as fetch.');

    const core = new Core({
      apiKey,
      baseURL: options.baseURL ?? DEFAULT_BASE_URL,
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      maxRetries: options.maxRetries ?? DEFAULT_MAX_RETRIES,
      fetch: fetchImpl,
    });

    this.categories = new Categories(core, this.mode);
    this.interests = new Interests(core, this.mode);
    this.offers = new Offers(core, this.mode);
    this.eventCategories = new EventCategories(core, this.mode);
    this.eventCurrencies = new EventCurrencies(core, this.mode);
    this.eventConfig = new EventConfigResource(core, this.mode);
    this.events = new Events(core, this.mode);
    this.webhookEndpoints = new WebhookEndpoints(core, this.mode);
    this.webhookEvents = new WebhookEvents(core, this.mode);
  }

  /** True for a `pk_live_` key. */
  get isLive(): boolean {
    return this.mode === 'live';
  }
}
