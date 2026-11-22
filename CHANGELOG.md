# Changelog

## 0.1.1

- First version published from GitHub Actions, with npm provenance. No changes to the library.

## 0.1.0

- `events.preview` takes every field of `events.publish` (all optional), so a preview can be checked exactly as the publish would be.

- `events.edit` is always sent as a multipart `POST` with `X-HTTP-Method-Override: PATCH`, with or without an image.

- First release: a client for every operation of the Agilis Advertising API (Offers, Events, webhook endpoints and webhook events), typed parameters and responses, multipart image uploads, auto-paging, idempotency keys, dry runs, retries, typed errors and `webhooks.constructEvent`.
