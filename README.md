# Agilis Ads for Node.js

The official Node.js and TypeScript library for the [Agilis Advertising API](https://www.agilis.dating/api-doc). Create and manage Offers and Events, read their results, and receive webhooks.

- Typed parameters and responses for every operation.
- ESM and CommonJS, with type declarations.
- No runtime dependencies: it uses Node's built-in `fetch`, `FormData` and `Blob`.
- Node.js 20 or later.

## Install

```sh
npm install @agilisdating/ads
```

## Quick start (Test mode)

Create a Test key in the Ad Portal (**Manage API Keys**, in Test mode). Test-mode Offers and Events are never shown to members and nothing is charged.

```ts
import { Agilis } from '@agilisdating/ads';

const client = new Agilis({ apiKey: process.env.AGILIS_API_KEY });

const { categories } = await client.categories.list();

const estimate = await client.offers.estimatePrice({
  start_datetime: '2027-07-10T08:00:00Z',
  end_datetime: '2027-07-12T20:30:00Z',
  location: [51.5074, -0.1278],
  radius: 10,
});

const offer = await client.offers.create({
  category_id: categories?.[0]?.category_id ?? 1,
  title: '20% off summer sale',
  description: 'Discount valid through July',
  push_notification_title: '20% off this summer',
  push_notification_message: 'Show this at the till for 20% off everything until July.',
  url: 'https://example.com/offer',
  image: './offer.png',
  location: [51.5074, -0.1278],
  radius: 10,
  start_datetime: '2027-07-10T08:00:00Z',
  expiry_datetime: '2027-07-12T20:30:00Z',
  payment_method: 'B',
});
console.log(offer.offer_id, offer.status);
```

CommonJS works too:

```js
const { Agilis } = require('@agilisdating/ads');
```

More in [`examples/`](examples): a short Test-mode script and a webhook receiver.

## The client

```ts
const client = new Agilis({
  apiKey: 'pk_test_...', // default: the AGILIS_API_KEY environment variable
  baseURL: 'https://ads.agilis.dating', // the default
  timeout: 60_000, // per attempt, in milliseconds (default 60 seconds)
  maxRetries: 2, // the default
  fetch: globalThis.fetch, // any fetch-compatible function
});
```

**Mode.** The key decides it: a `pk_test_` key is Test mode and a `pk_live_` key is Live mode. `client.mode` is `'test'` or `'live'` (and `client.isLive` is a shortcut), so your code can refuse to run against Live:

```ts
if (client.mode === 'live') throw new Error('This script only runs in Test mode.');
```

Operations that take `environment` fill it in from the key when you leave it out.

**Your key.** The key is sent in the `x-api-key` header only. It is never logged, never part of a URL and never included in an error message. Keep it in an environment variable or a secrets manager, not in code.

**Per-request options.** Every method takes an options object last: `timeout`, `maxRetries`, `signal` (an `AbortSignal`) and `headers`. Methods that can be checked without making the change also take `dryRun`, and the two that create something take `idempotencyKey`.

## Resources and methods

Path parameters are arguments; everything else is one parameters object, with the API's own field names. See the [API reference](https://www.agilis.dating/api-doc) for each field.

| Method                                                      | HTTP                                                |
| ----------------------------------------------------------- | --------------------------------------------------- |
| `client.categories.list()`                                  | `GET /categories`                                   |
| `client.interests.list()`                                   | `GET /interests`                                    |
| `client.offers.estimatePrice(params)`                       | `POST /offers/price-estimate`                       |
| `client.offers.create(params, { idempotencyKey, dryRun })`  | `POST /offers`                                      |
| `client.offers.list(params)`                                | `GET /offers`                                       |
| `client.offers.listAutoPaging(params)`                      | every page of `GET /offers`                         |
| `client.offers.pause(offerId)`                              | `POST /offers/{offer_id}/pause`                     |
| `client.offers.resume(offerId)`                             | `POST /offers/{offer_id}/resume`                    |
| `client.offers.analytics(offerId, { interval })`            | `GET /offers/{offer_id}/analytics`                  |
| `client.offers.delete(offerId, { dryRun })`                 | `DELETE /offers/{offer_id}`                         |
| `client.eventCategories.list()`                             | `GET /event-categories`                             |
| `client.eventCurrencies.list()`                             | `GET /event-currencies`                             |
| `client.eventConfig.get()`                                  | `GET /event-config`                                 |
| `client.events.preview(params)`                             | `POST /events/preview`                              |
| `client.events.publish(params, { idempotencyKey, dryRun })` | `POST /events`                                      |
| `client.events.list(params)`                                | `GET /events`                                       |
| `client.events.listAutoPaging(params)`                      | every page of `GET /events`                         |
| `client.events.get(eventId)`                                | `GET /events/{event_id}`                            |
| `client.events.edit(eventId, params)`                       | `PATCH /events/{event_id}`                          |
| `client.events.delete(eventId, { dryRun })`                 | `DELETE /events/{event_id}`                         |
| `client.events.reschedule(eventId, params)`                 | `POST /events/{event_id}/reschedule`                |
| `client.events.cancel(eventId, { dryRun })`                 | `POST /events/{event_id}/cancel`                    |
| `client.events.analytics(eventId, { interval })`            | `GET /events/{event_id}/analytics`                  |
| `client.webhookEndpoints.list()`                            | `GET /webhook-endpoints`                            |
| `client.webhookEndpoints.create(params)`                    | `POST /webhook-endpoints`                           |
| `client.webhookEndpoints.get(endpointId)`                   | `GET /webhook-endpoints/{endpoint_id}`              |
| `client.webhookEndpoints.update(endpointId, params)`        | `PATCH /webhook-endpoints/{endpoint_id}`            |
| `client.webhookEndpoints.delete(endpointId)`                | `DELETE /webhook-endpoints/{endpoint_id}`           |
| `client.webhookEndpoints.rollSecret(endpointId, params)`    | `POST /webhook-endpoints/{endpoint_id}/roll-secret` |
| `client.webhookEndpoints.sendTest(endpointId, params)`      | `POST /webhook-endpoints/{endpoint_id}/test`        |
| `client.webhookEvents.list(params)`                         | `GET /webhook-events`                               |
| `client.webhookEvents.listAutoPaging(params)`               | every page of `GET /webhook-events`                 |
| `client.webhookEvents.get(webhookEventId)`                  | `GET /webhook-events/{webhook_event_id}`            |
| `client.webhookEvents.resend(webhookEventId, params)`       | `POST /webhook-events/{webhook_event_id}/resend`    |
| `webhooks.constructEvent(rawBody, header, secret)`          | verifies a received webhook (no request)            |

### Images and other multipart fields

`offers.create`, `events.preview`, `events.publish` and `events.edit` send `multipart/form-data`. The `image` can be:

- a file path: `image: './offer.png'`;
- a `File`;
- bytes or a stream with a file name: `image: { data: buffer, filename: 'offer.png' }`, where `data` is a `Buffer`, `Uint8Array`, `ArrayBuffer`, `Blob`, a web `ReadableStream` or a Node.js stream.

The content type comes from the file name's extension (or pass `contentType`). Arrays are sent as repeated `location[]`, `gender[]` and `interests[]` parts, and `crop: { x, y, w }` is sent as `crop[x]`, `crop[y]` and `crop[w]`. `events.edit` is always sent as a multipart `POST` with `X-HTTP-Method-Override: PATCH`, with or without an image, as the API asks.

### Responses

Each method returns the parsed JSON, typed. Fields this version of the library does not know about are kept, so a new API field never breaks your code. The HTTP status and the response headers are on `lastResponse`:

```ts
const page = await client.offers.list({ limit: 20 });
page.lastResponse.status; // 200
page.lastResponse.headers.get('X-RateLimit-Remaining');
```

The types are exported too, for example `Offer`, `Event`, `CreateOfferParams`, `WebhookEndpoint` and `WebhookEvent`. (`AgilisEvent` is the same as `Event`, for code where the name clashes with the DOM's `Event`.)

## Pagination

`offers.list`, `events.list` and `webhookEvents.list` return one page with `data` and `pagination` (`has_more`, `next_cursor`). The `listAutoPaging` methods follow `next_cursor` for you:

```ts
for await (const offer of client.offers.listAutoPaging({ offer_status: 'active' })) {
  console.log(offer.offer_id, offer.title);
}
```

## Idempotency, dry runs and retries

**Idempotency.** `offers.create` and `events.publish` always send an `Idempotency-Key`: yours if you pass `idempotencyKey`, or a random UUID made once per call. Every retry of that call reuses it, so a retried request never creates a second Offer or Event. Pass your own key to make a call safe to repeat across restarts.

**Dry runs.** `offers.create`, `events.publish`, `offers.delete`, `events.delete` and `events.cancel` take `{ dryRun: true }`: the API checks the request and answers as it would, but nothing is created, changed or charged.

```ts
await client.events.publish(params, { dryRun: true });
```

**Retries.** Up to `maxRetries` times (default 2), the client retries:

- connection errors and timeouts;
- HTTP 429;
- HTTP 500, 502, 503 and 504, for `GET` and `DELETE` requests and for the requests that carry an `Idempotency-Key`.

Other `POST` and `PATCH` requests are not retried on a 5xx, because the change may already have happened. The wait is the `Retry-After` header when the API sends one, and otherwise 0.5 seconds × 2^attempt with ±25% jitter, at most 8 seconds.

## Errors

Every error is an `AgilisError`, with `status` (the HTTP status), `returnCode` (such as `E3`), `message`, `body` (the parsed response) and `headers`.

| Error                        | When                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| `AuthenticationError`        | 401                                                             |
| `PermissionError`            | 403                                                             |
| `NotFoundError`              | 404                                                             |
| `ConflictError`              | 409                                                             |
| `InvalidRequestError`        | 400 or 422, or HTTP 200 with a `return_code` starting with `E`  |
| `RateLimitError`             | 429, with `retryAfter` in seconds                               |
| `ApiError`                   | 5xx and any other status                                        |
| `ConnectionError`            | no response: a network failure, a timeout or an aborted request |
| `SignatureVerificationError` | `webhooks.constructEvent` refused a message                     |

Some refusals arrive as HTTP 200 with an `E` code, for example `E3` when the balance is too low for an Offer. They throw `InvalidRequestError` too, with `status` 200. `S1` and `S2` are both success.

```ts
import { AgilisError, InvalidRequestError } from '@agilisdating/ads';

try {
  await client.offers.create(params);
} catch (error) {
  if (error instanceof InvalidRequestError && error.returnCode === 'E3') {
    console.log('Top up the balance first.');
  } else if (error instanceof AgilisError) {
    console.log(error.status, error.returnCode, error.message);
  } else {
    throw error;
  }
}
```

## Webhooks

Create an endpoint with `client.webhookEndpoints.create(...)` (or in the Ad Portal) and store the `secret` it returns: it is shown only once. Every message carries an `Agilis-Signature` header. `webhooks.constructEvent(rawBody, signatureHeader, secret, tolerance = 300)` checks it in constant time, accepts any matching `v1` (there are two while a rolled secret is still valid), refuses a timestamp more than `tolerance` seconds from now, and returns the parsed event, typed by `type`. It throws `SignatureVerificationError` otherwise, with `reason` set to `header`, `timestamp`, `signature` or `payload`.

Pass the body **exactly as received**, before any JSON parsing. With Express:

```ts
import express from 'express';
import { webhooks, SignatureVerificationError } from '@agilisdating/ads';

const app = express();

app.post('/agilis/webhooks', express.raw({ type: 'application/json' }), (req, res) => {
  let event;
  try {
    event = webhooks.constructEvent(
      req.body,
      req.header('Agilis-Signature'),
      process.env.AGILIS_WEBHOOK_SECRET!,
    );
  } catch (error) {
    if (error instanceof SignatureVerificationError) return res.sendStatus(400);
    throw error;
  }

  res.sendStatus(200); // answer within 10 seconds, then do the work

  switch (event.type) {
    case 'offer.started':
      console.log('Offer started:', event.data.object.offer_id);
      break;
    case 'event.cancelled':
      console.log('Event cancelled:', event.data.object.event_id);
      break;
  }
});
```

`webhooks` needs no API key; it is also available as `client.webhooks`. Events can arrive more than once and out of order: use `id` to ignore repeats and `created` to order them. A version of this library may not know event types added to the API later, so keep a `default` branch.

## Links

- API reference: https://www.agilis.dating/api-doc
- OpenAPI document: https://www.agilis.dating/openapi.json
- AsyncAPI document (webhooks): https://www.agilis.dating/asyncapi.json
- The API's own repository: https://github.com/agilisdating/agilis-ads-api

## Security

See [SECURITY.md](SECURITY.md) to report a problem or if a key has been exposed.

## Licence

MIT. See [LICENSE](LICENSE).
