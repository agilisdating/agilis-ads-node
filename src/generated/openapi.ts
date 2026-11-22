// This file is generated from openapi/openapi.json by scripts/generate-types.mjs.
// Do not edit it by hand: run `npm run generate` instead.

export interface paths {
    "/categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Category List
         * @description Returns all active categories available to the organisation that owns the API key. It is typically called before creating an offer, because offer creation requires a valid category ID returned by this endpoint.
         */
        get: operations["listCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/interests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Interest List
         * @description Returns the interests available for offer targeting. Call it before creating an offer if you intend to use the optional `interests` array, which restricts the offer to users who have selected at least one of the interests supplied.
         */
        get: operations["listInterests"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offers/price-estimate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Offer Price Estimate
         * @description Calculates what an offer will cost before it is created: its size in Ad Units (duration in hours × the number of Agilis users it would reach) and what those units cost in money. Only active, non-banned accounts are counted. Pass the same `gender` and `interests` values you intend to create the offer with, otherwise the estimate will be higher than the amount actually charged.
         *
         *     `price_estimate` is a number of **Ad Units**, not money. `estimated_cost` is the **money** the offer will cost, and is the figure to compare with your balance.
         *
         *     There is no `currency` parameter: the estimate is always in your organisation's billing currency, named in the response's `currency` field.
         */
        post: operations["estimateOfferPrice"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * View Offers
         * @description Returns a **paginated** list of offers created by the authenticated advertiser for the requested environment, newest first. Offers whose image was rejected by content moderation are never created, so they are not returned, and deleted offers are excluded. Page through results with `limit` and `cursor`.
         */
        get: operations["listOffers"];
        put?: never;
        /**
         * Create Offer
         * @description Creates a new offer for the authenticated advertiser. The request is sent as `multipart/form-data` with the offer image supplied as a binary file stream. The image is checked by automated content moderation before the offer is created: if it fails, nothing is created and nothing is charged.
         *
         *     **Paying by Stripe link** (`payment_method=E`): the offer is created in **Awaiting Payment** and the response carries a `payment_url`. Stripe's `checkout.session.completed` webhook activates it: **Active** if its start has passed, **Scheduled** if not. An organisation registered in the UK pays VAT at 20% on top, as a separate line on the Stripe page. Stripe will not take a card payment below its minimum for the currency (for example £0.30, US$0.50 or €0.50): such an offer is refused with `E1`.
         *
         *     **Paying from balance** (`payment_method=B`): the offer's price is deducted at once, from the balance of the offer's own mode (TEST and LIVE balances are separate). Compare your balance with `estimated_cost` from the price estimate, never `price_estimate`.
         *
         *     There is no `currency` parameter: every offer is priced and charged in your organisation's billing currency, named in the response.
         */
        post: operations["createOffer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offers/{offer_id}/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Pause Offer
         * @description Pauses a running offer. The offer must belong to the account that owns the API key and be in the key's mode (TEST or LIVE). Any other offer returns HTTP 401 with `E1`. Time spent paused is Unused Time: it is credited to your balance if you later delete the offer.
         */
        post: operations["pauseOffer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offers/{offer_id}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resume Offer
         * @description Resumes a paused offer. The offer must belong to the account that owns the API key and be in the key's mode. Any other offer returns HTTP 401 with `E1`.
         */
        post: operations["resumeOffer"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offers/{offer_id}/analytics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * View Offer Analytics
         * @description Returns view and click metrics for a specific offer over the requested time interval. The offer must belong to the account that owns the API key and be in the key's mode.
         */
        get: operations["getOfferAnalytics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/offers/{offer_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /**
         * Delete Offer
         * @description Deletes an offer belonging to the authenticated account, in your API key's mode (an offer of the other mode is not found).
         *
         *     **Awaiting Payment:** the offer's Stripe payment page is closed first, so it can no longer be paid. If Stripe reports that the payment has just been completed, or the page cannot be closed, nothing is deleted (`E6`, `E7` below).
         *
         *     **Paid offers** (Active, Scheduled or Paused): the offer's Unused Time is credited to your balance in the offer's own mode. Unused Time is the part of the scheduled period in which the offer did not run: the time from the deletion to the scheduled end, plus any time it spent paused. An offer deleted before it starts is credited in full. The credit is net of VAT and goes to your balance, never back to a card.
         */
        delete: operations["deleteOffer"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/event-categories": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Event Categories
         * @description Returns the Agilis event categories, **for display**: for example to label an event in your own system with the category the API chose for it. It is not an input. The category of an event is determined from its title, description and venue name (see [Preview Event](https://www.agilis.dating/api-doc#previewEventSectionid)). Names are returned in the language of your `Accept-Language` header, falling back to English.
         */
        get: operations["listEventCategories"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/event-currencies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Event Currencies
         * @description The currency codes a ticket price may be quoted in: every currency with an exchange rate on file, which is what lets the app sort events by price across currencies. Use one of these for `currency` on publish and edit. This is the currency members see on the price pill; it has no effect on what you are charged.
         */
        get: operations["listEventCurrencies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/event-config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Event Config
         * @description What publishing costs your organisation, your balance, whether LIVE publishing is open, the accepted currencies and the image limits. Useful before a publish, or to show the fee in your own system. `listing_fee` is £10 converted at the day's European Central Bank reference rate into your organisation's billing currency (`currency`); `exchange_rate_per_gbp` is the rate used and `exchange_rate_date` its date (`1` and `null` for GBP). All three are `null` when your billing currency cannot be billed right now (see `E6` on Publish Event). `environment` is your API key's mode (`TEST` or `LIVE`), and `balance` and `organisation_balance` are the balances for that mode: **TEST and LIVE balances are separate**, so a TEST key never shows the LIVE balance.
         */
        get: operations["getEventConfig"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Preview Event
         * @description Shows you what `POST /events` would do, **without publishing or charging**: the category your wording will get, the fee and your balance, and — if you include an image — the processed picture with its 16:9 crop applied, plus a `preview_token` that `POST /events` accepts instead of the file, so the published image is byte-for-byte the one you saw. Same fields as `POST /events`; `image` and `payment_method` are optional and no `Idempotency-Key` is needed. A rejected image returns `E2` here, before any payment. **Rate-limited** per organisation (60 previews per hour): each preview costs an image check and a classification.
         */
        post: operations["previewEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * View Events
         * @description Returns events, newest first, with cursor pagination in the same envelope as `GET /offers`. **Who sees what:** an organisation admin's key sees every event in the organisation, whoever created it; a developer's key sees the whole organisation's events read-only; an advertiser's key sees its own. `attendees` is always a **band** (`<10`, `10-25`, `26-50`, `50+`), never an exact number: member privacy comes first, and an exact count on a small event would let attendance be inferred.
         */
        get: operations["listEvents"];
        put?: never;
        /**
         * Publish Event
         * @description Publishes one dated event. Sent as `multipart/form-data`. Publishing costs one flat price, deducted from your balance: **£10, converted into your organisation's billing currency at the day's European Central Bank reference rate**. The charge and the event are created together: if your balance is too low, nothing is created and nothing is charged. Listings are **non-refundable** once published, including if you later cancel. A recurring class is one event per date. **There is no `category_id`:** the category is determined from your title, description and venue name and returned in the response — preview it first if you want to see it before paying.
         */
        post: operations["publishEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{event_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * View Event
         * @description One event: the same fields as the list, plus what it cost (`listing_price`, `billing_currency`, `invoice_id`), whether you may change it (`can_manage`, `can_delete`), whether members have interacted with it, the stored image's size and crop (`image_master`), and its `history`: every action taken on it, by whom and when.
         */
        get: operations["getEvent"];
        put?: never;
        post?: never;
        /**
         * Delete Event
         * @description Removes an event that no member has interacted with yet, for example one published by mistake. Once any member has marked themselves as going, invited someone, or opened your booking page, the event can no longer be deleted: cancel it instead, so those members are told. Deleting does not return the listing fee.
         */
        delete: operations["deleteEvent"];
        options?: never;
        head?: never;
        /**
         * Edit Event
         * @description Changes a published event, **free of charge**. Send only the fields to change. Editable: title, description, booking page, ticket price, venue and image. **Not dates** — use Reschedule. A wording change re-determines the category, which the response returns; preview first if you want to see it. A new image goes through the same checks as on publish and is stored at new URLs (invitations already sent keep the picture they were sent with). Members see the change within a few minutes. When uploading a file, send the request as `POST` with the header `X-HTTP-Method-Override: PATCH`, because file uploads need a POST body. **You remain responsible for telling everyone who booked through your own booking system** about any change; Agilis may notify its members but does not guarantee it.
         */
        patch: operations["editEvent"];
        trace?: never;
    };
    "/events/{event_id}/reschedule": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Reschedule Event
         * @description Moves a published event to a new date, at no charge. Within a few minutes the app shows the new date, and anyone who had accepted an invitation to the event is asked to confirm again, because nobody has agreed to the new date yet. **You are responsible for informing everyone who booked through your own booking system** of the change and the reason for it; Agilis may notify its members but does not guarantee it, and is not responsible for communication about your event. Use this rather than cancelling and publishing again.
         */
        post: operations["rescheduleEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{event_id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel Event
         * @description Cancels a published event. **Irreversible, and the listing fee is not refunded.** Within a few minutes the app marks it cancelled and every open or accepted invitation to it is cancelled. **You are responsible for informing everyone who booked through your own booking system**; Agilis may notify its members but does not guarantee it. Please cancel rather than leaving a listing up for an event that is not running, so nobody turns up to a closed door. No request body.
         */
        post: operations["cancelEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/events/{event_id}/analytics": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * View Event Analytics
         * @description Returns engagement for one event over the requested interval. Figures are refreshed every few minutes; `as_of` says when, and is `null` until the first member interaction.
         */
        get: operations["getEventAnalytics"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook-endpoints": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Webhook Endpoints
         * @description Your organisation's webhook endpoints in your key's mode. The signing secret is never returned here: it is shown only when the endpoint is created and when its secret is rolled. Org Admin and Developer API keys only; an Advertiser's key is refused (HTTP 403, `E2`). Endpoints belong to the organisation and to your key's mode: a TEST key sees TEST endpoints only.
         */
        get: operations["listWebhookEndpoints"];
        put?: never;
        /**
         * Create Webhook Endpoint
         * @description Adds an endpoint that Agilis will send events to. **The response includes `secret`, shown only this once:** store it safely and use it to check the `Agilis-Signature` header of every event. Up to 16 endpoints per mode. Org Admin and Developer API keys only; an Advertiser's key is refused (HTTP 403, `E2`). Endpoints belong to the organisation and to your key's mode: a TEST key sees TEST endpoints only.
         */
        post: operations["createWebhookEndpoint"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook-endpoints/{endpoint_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Webhook Endpoint
         * @description One endpoint, without its secret. `failing_since` is when deliveries to it started failing (`null` while they succeed); `disabled_by` is `business` when you turned it off, `system` when Agilis turned it off after 3 days of failures, or `agilis` when Agilis support did.
         */
        get: operations["getWebhookEndpoint"];
        put?: never;
        post?: never;
        /**
         * Delete Webhook Endpoint
         * @description Deletes an endpoint. Nothing more is sent to it, including retries already scheduled. This cannot be undone.
         */
        delete: operations["deleteWebhookEndpoint"];
        options?: never;
        head?: never;
        /**
         * Update Webhook Endpoint
         * @description Changes an endpoint. Send only what changes. Turning an endpoint back on (`enabled`) clears its failing state; events that stopped being retried while it was off are not sent again unless you resend them. An endpoint that Agilis support turned off can only be turned back on by Agilis support.
         */
        patch: operations["updateWebhookEndpoint"];
        trace?: never;
    };
    "/webhook-endpoints/{endpoint_id}/roll-secret": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Roll Webhook Secret
         * @description Replaces an endpoint's signing secret. **The new secret is in the response, shown only this once.** Until `expires_in` passes, every event is signed with both the new and the old secret (two `v1` values in `Agilis-Signature`), so you can update your server without missing any.
         */
        post: operations["rollWebhookSecret"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook-endpoints/{endpoint_id}/test": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Send Test Webhook
         * @description Sends one sample event to the endpoint now, signed like any other, with `"test": true` in its body, and answers with the result. `data.object` is your organisation's latest Offer or Event in this mode, or `null` if there is none. A test event is never retried and never counts towards the endpoint failing.
         */
        post: operations["sendTestWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * List Webhook Events
         * @description Webhook events of the last 30 days in your key's mode, newest first, each with its deliveries to your endpoints. Use it to find events your server missed. Org Admin and Developer API keys only; an Advertiser's key is refused (HTTP 403, `E2`). Endpoints belong to the organisation and to your key's mode: a TEST key sees TEST endpoints only.
         */
        get: operations["listWebhookEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook-events/{webhook_event_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Get Webhook Event
         * @description One webhook event: what was sent, and each delivery's status, attempts and last result.
         */
        get: operations["getWebhookEvent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/webhook-events/{webhook_event_id}/resend": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Resend Webhook Event
         * @description Sends an event again now, exactly as first sent (same `id`, so your server can recognise a repeat), to one endpoint or to every endpoint it went to. Events can be resent for 15 days. Endpoints that are turned off are skipped.
         */
        post: operations["resendWebhookEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export interface webhooks {
    "offer.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.created
         * @description An Offer was created: paid from your balance at once, or awaiting a card payment.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.created` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerCreatedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.payment_succeeded": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.payment_succeeded
         * @description The card payment for an Offer created with payment_method E completed.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.payment_succeeded` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerPaymentSucceededWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.payment_failed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.payment_failed
         * @description The card payment for an Offer was declined or failed, or its payment link expired. The Offer stays Awaiting Payment.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.payment_failed` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerPaymentFailedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.started": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.started
         * @description An Offer became visible to members: at once, or at its scheduled start.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.started` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerStartedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.paused": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.paused
         * @description An Offer was paused, by your organisation or by Agilis.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.paused` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerPausedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.resumed": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.resumed
         * @description A paused Offer was resumed.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.resumed` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerResumedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.ended": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.ended
         * @description An Offer's time is up. Any unused time is credited to your balance.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.ended` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerEndedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.deleted": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.deleted
         * @description An Offer was deleted. Any unused time is credited to your balance.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.deleted` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerDeletedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.disabled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.disabled
         * @description Agilis took an Offer off members' feeds. Your Org Admins are told why by email.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.disabled` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerDisabledWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "offer.enabled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * offer.enabled
         * @description Agilis put a disabled Offer back on members' feeds.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `offer.enabled` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["offerEnabledWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "event.published": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * event.published
         * @description An Event was published.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `event.published` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["eventPublishedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "event.updated": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * event.updated
         * @description An Event's details, image or crop changed.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `event.updated` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["eventUpdatedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "event.rescheduled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * event.rescheduled
         * @description An Event moved to new dates.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `event.rescheduled` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["eventRescheduledWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "event.cancelled": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * event.cancelled
         * @description An Event was cancelled.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `event.cancelled` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["eventCancelledWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "event.deleted": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * event.deleted
         * @description An Event was deleted.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `event.deleted` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["eventDeletedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "event.ended": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * event.ended
         * @description An Event's end time passed.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `event.ended` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["eventEndedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "balance.topped_up": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * balance.topped_up
         * @description A top-up was credited to your balance.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `balance.topped_up` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["balanceToppedUpWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "balance.low": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * balance.low
         * @description Your organisation balance fell below the low balance alert amount an Org Admin set in Settings. Sent once until the balance is back at or above that amount.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `balance.low` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["balanceLowWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "invoice.created": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * invoice.created
         * @description An invoice was issued: for an Offer, an Event or a top-up.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `invoice.created` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["invoiceCreatedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "terms.version_issued": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * terms.version_issued
         * @description Agilis issued a new version of the Advertising Terms. An Org Admin must accept it before your organisation can create Offers or publish Events again, through the API too.
         *
         *     Sent as an HTTPS POST to each of your endpoints that listens for `terms.version_issued` (or `*`). Verify the `Agilis-Signature` header before trusting the body, and answer with any 2xx within 10 seconds. Ignore an `id` you have already handled: retries and resends repeat it.
         */
        post: operations["termsVersionIssuedWebhook"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export interface components {
    schemas: {
        ReturnCode: {
            /** @description S1/S2 on success, E1–E9 on error. Meaning depends on the endpoint. */
            return_code?: string | null;
            message?: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    listCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categories retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "categories": [
                     *         {
                     *           "category_id": 1,
                     *           "category_name": "Retail"
                     *         },
                     *         {
                     *           "category_id": 2,
                     *           "category_name": "Food & Beverage"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        categories?: {
                            /** @description Unique ID of the category. Example: `1` */
                            category_id?: number;
                            /** @description Name of the category. Example: `"Retail"` */
                            category_name?: string;
                        }[];
                    };
                };
            };
            /** @description Invalid API key or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listInterests: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Interests retrieved successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "interests": [
                     *         {
                     *           "interest_id": 3,
                     *           "interest_name": "Cooking"
                     *         },
                     *         {
                     *           "interest_id": 7,
                     *           "interest_name": "Fitness"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        interests?: {
                            /** @description Unique ID of the interest. Example: `3` */
                            interest_id?: number;
                            /** @description Name of the interest. Example: `"Cooking"` */
                            interest_name?: string;
                        }[];
                    };
                };
            };
            /** @description Invalid API key or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    estimateOfferPrice: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "start_datetime": "2027-07-10T08:00:00Z",
                 *       "end_datetime": "2027-07-12T20:30:00Z",
                 *       "location": [
                 *         51.5074,
                 *         -0.1278
                 *       ],
                 *       "radius": 10,
                 *       "gender": [
                 *         "Male",
                 *         "Female"
                 *       ],
                 *       "interests": [
                 *         3,
                 *         7
                 *       ]
                 *     }
                 */
                "application/json": {
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC. Now or later: a start more than 60 seconds before now (UTC) is refused with `E1`. Example: `"2027-07-10T08:00:00Z"`
                     */
                    start_datetime: string;
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC. Example: `"2027-07-12T20:30:00Z"`
                     */
                    end_datetime: string;
                    /** @description Latitude and longitude. Example: `[51.5074, -0.1278]` */
                    location: number[];
                    /** @description Miles, minimum 5, maximum 30. Example: `10` */
                    radius: number;
                    /** @description One or more of `Male`, `Female`, `Non-binary`, `All`. Omit, or include `All`, to reach every gender. Example: `["Male", "Female"]` */
                    gender?: ("Male" | "Female" | "Non-binary" | "All")[];
                    /** @description Interest ids from `GET /interests`. A user matches if they share any of them. Omit to apply no interest filter. Example: `[3, 7]` */
                    interests?: number[];
                    /**
                     * @description `TEST` or `LIVE`. Defaults to your API key's own mode. If sent, it must be your key's mode (HTTP 403 otherwise). The Ad Unit price is the same in both.
                     * @enum {string}
                     */
                    environment?: "TEST" | "LIVE" | "test" | "live";
                };
            };
        };
        responses: {
            /** @description S1: Estimate calculated successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "price_estimate": 110110,
                     *       "matching_users": 1820,
                     *       "ad_units": 110110,
                     *       "ad_unit_price": 0.001,
                     *       "estimated_cost": 110.11,
                     *       "currency": "GBP",
                     *       "exchange_rate_per_gbp": 1,
                     *       "exchange_rate_date": null
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        /** @description Size of the offer in **Ad Units**. Not money. */
                        price_estimate?: number;
                        /** @description Agilis users the offer would reach. `0` means it cannot be created as specified: widen the radius or broaden the targeting. */
                        matching_users?: number;
                        /** @description The same figure, under a clearer name. `price_estimate` is kept for existing integrations. */
                        ad_units?: number;
                        /** @description Price of one Ad Unit in `currency`, to 6 decimal places: £0.001 × the day's European Central Bank rate. */
                        ad_unit_price?: number;
                        /** @description **The money the offer will cost.** Compare this with your balance. */
                        estimated_cost?: number;
                        /** @description Your organisation's billing currency. */
                        currency?: string;
                        /** @description The rate used, per pound sterling. `1` for GBP. */
                        exchange_rate_per_gbp?: number;
                        /** @description The rate's date (`YYYY-MM-DD`); `null` for GBP. */
                        exchange_rate_date?: unknown;
                    };
                };
            };
            /**
             * @description E1: One or more inputs are missing or invalid, or `start_datetime` is in the past (more than 60 seconds before now).
             *
             *     E2: A date/time is not in valid ISO 8601 format.
             */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Authentication failure. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E1: `environment` is not your API key's mode. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    listOffers: {
        parameters: {
            query: {
                /** @description `test` or `live` (case-insensitive). Must be your API key's own mode. Example: `/offers?environment=test` */
                environment: "test" | "live" | "TEST" | "LIVE";
                /** @description Page size. Default `20`, maximum `100`. */
                limit?: number;
                /** @description Opaque token from the previous page's `next_cursor`. Omit for the first page. */
                cursor?: string;
                /** @description Lifecycle filter: `awaiting_payment`, `active`, `paused` or `ended` (case-insensitive). */
                offer_status?: "awaiting_payment" | "active" | "paused" | "ended";
                /** @description ISO 8601, UTC. Offers created at or after this time. */
                created_after?: string;
                /** @description ISO 8601, UTC. Offers created at or before this time. */
                created_before?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Page returned (empty `data` array if none match). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "data": [
                     *         {
                     *           "offer_id": 45,
                     *           "title": "20% off summer sale",
                     *           "category": "Retail",
                     *           "description": "Discount valid through July",
                     *           "terms_and_conditions": "Valid online only.",
                     *           "advertised_name": null,
                     *           "push_notification_title": "20% off this summer",
                     *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                     *           "button_preset": "claim_offer",
                     *           "button_text": null,
                     *           "url": "https://advertiseroffer.com",
                     *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                     *           "latitude": 51.5074,
                     *           "longitude": -0.1278,
                     *           "radius": 10,
                     *           "gender": [
                     *             "Male",
                     *             "Female"
                     *           ],
                     *           "interests": [
                     *             {
                     *               "interest_id": 3,
                     *               "interest_name": "Cooking"
                     *             },
                     *             {
                     *               "interest_id": 7,
                     *               "interest_name": "Fitness"
                     *             }
                     *           ],
                     *           "start_datetime": "2027-07-10T08:00:00Z",
                     *           "expiry_datetime": "2027-07-12T20:30:00Z",
                     *           "creation_datetime": "2027-06-01T10:00:00Z",
                     *           "offer_status": "Active",
                     *           "status": "enabled"
                     *         }
                     *       ],
                     *       "pagination": {
                     *         "limit": 20,
                     *         "count": 1,
                     *         "has_more": false,
                     *         "next_cursor": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        data?: {
                            /** @description The offer's id. */
                            offer_id?: number;
                            /** @description As created. */
                            title?: string;
                            /** @description As created. */
                            category?: string;
                            /** @description As created. */
                            description?: string;
                            /** @description As created. */
                            terms_and_conditions?: string;
                            /** @description The business name members see; `null` when your trading name is shown. */
                            advertised_name?: unknown;
                            /** @description The notification members who opted in get when the offer starts. `null` on offers created before these fields existed: those offers are never sent as a notification. */
                            push_notification_title?: string;
                            /** @description The notification members who opted in get when the offer starts. `null` on offers created before these fields existed: those offers are never sent as a notification. */
                            push_notification_message?: string;
                            /** @description The button's text: `claim_offer`, `visit_website`, `install_app`, `book_now`, `get_directions` or `custom`. `claim_offer` on offers created before the button text could be chosen. */
                            button_preset?: string;
                            /** @description Your own button text when `button_preset` is `custom`; otherwise `null`. */
                            button_text?: unknown;
                            /** @description As created. */
                            url?: string;
                            /** @description Signed URL of the image. It expires, so do not store it. */
                            image?: string;
                            /** @description Where the offer is shown. */
                            latitude?: number;
                            /** @description Where the offer is shown. */
                            longitude?: number;
                            /** @description Where the offer is shown. */
                            radius?: number;
                            /** @description For example `["Male","Female"]`; empty when the offer targets every gender. */
                            gender?: string[];
                            /** @description `{interest_id, interest_name}` objects; empty when no interest targeting was applied. */
                            interests?: {
                                interest_id?: number;
                                interest_name?: string;
                            }[];
                            /** @description ISO 8601, UTC. */
                            start_datetime?: string;
                            /** @description ISO 8601, UTC. */
                            expiry_datetime?: string;
                            /** @description ISO 8601, UTC. */
                            creation_datetime?: string;
                            /** @description Awaiting Payment, Active, Scheduled, Paused or Ended. */
                            offer_status?: string;
                            /** @description `enabled` or `disabled`: whether an Admin has disabled the offer. */
                            status?: string;
                        }[];
                        pagination?: {
                            limit?: number;
                            count?: number;
                            has_more?: boolean;
                            /** @description Can be null. */
                            next_cursor?: unknown;
                        };
                    };
                };
            };
            /** @description Invalid query parameter (`limit`, `cursor`, `offer_status` or date). */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid API key or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description `environment` is not your API key's mode. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    createOffer: {
        parameters: {
            query?: {
                /** @description Optional. `true` checks everything and answers with what the offer would cost and how it would be paid (`price`, `matching_members`, and `balance_after` or `card_amount`), marked `dry_run: true`. Nothing is created or charged, and no `Idempotency-Key` is needed. The image is checked for type and size; its content moderation runs only when the offer is created. */
                dry_run?: boolean;
            };
            header: {
                /** @description A unique value you generate per offer (for example a UUID v4). Replaying the same key safely retries the request without creating a duplicate offer or a second Stripe payment; the original response, including any `payment_url`, is returned verbatim. Missing: HTTP 400 / `E1`. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** @description A valid category ID from the Category List API. Example: `1` */
                    category_id: number;
                    /** @description Up to 40 characters. Example: `"20% off summer sale"` */
                    title: string;
                    /** @description Up to 500 characters. Example: `"Discount valid through July"` */
                    description: string;
                    /** @description Up to 500 characters. Example: `"Valid online only."` */
                    terms_and_conditions?: string;
                    /** @description The business name members see on the offer instead of your organisation's trading name — for example when an agency advertises for a client. Up to 100 characters; must not start with http://, https:// or www.; no HTML or line breaks. Omit or send empty to show your trading name. You must be authorised by the business you name. Invoices and analytics stay in your organisation's name. Example: `"Brighton Bakehouse"` */
                    advertised_name?: string;
                    /** @description The title of the notification sent to members who chose to get offer notifications, shown on their lock screen as you write it (it is not translated). 5 to 50 characters. Missing: `E10`; too short: `E11`; too long: `E12`; refused by content moderation: `E13`. Example: `"20% off this summer"` */
                    push_notification_title: string;
                    /** @description The notification's message, under the title. 5 to 150 characters; phones cut it at about 100, so keep it short. Same return codes as `push_notification_title`. Example: `"Show this at the till for 20% off everything until the end of July."` */
                    push_notification_message: string;
                    /**
                     * @description The words on the offer's button in the Agilis apps and web app: `claim_offer` (Claim Offer, the default when omitted or empty), `visit_website` (Visit our website), `install_app` (Install our app), `book_now` (Book now), `get_directions` (Get directions) or `custom` (your own words, in `button_text`). Ready-made texts are shown in each member's app language. Whatever the text, the button opens your `url`. Any other value: `E14`. Example: `"book_now"`
                     * @enum {string}
                     */
                    button_preset?: "claim_offer" | "visit_website" | "install_app" | "book_now" | "get_directions" | "custom";
                    /** @description Your own button text: required when `button_preset` is `custom`, ignored otherwise. Plain text on one line, 1 to 20 characters after trimming, shown exactly as you write it in every language (it is not translated). Missing, empty, with a line break or with HTML: `E15`; over 20 characters: `E16`. Example: `"Show this at the bar"` */
                    button_text?: string;
                    /**
                     * Format: uri
                     * @description Your offer page. Example: `"https://advertiseroffer.com"`
                     */
                    url: string;
                    /** @description JPG, PNG or GIF, maximum 5 MB, sent as a binary file stream. Recommended size: `1080x1080px` */
                    image: string;
                    /** @description Latitude and longitude as two values. Example: `[51.5074, -0.1278]` */
                    location: number[];
                    /** @description Radius in miles, minimum 5, maximum 30. Example: `10` */
                    radius: number;
                    /** @description Target specific genders. One or more of `Male`, `Female`, `Non-binary`, `All`. Omitting the field, or including `All`, reaches every gender. Narrowing this reduces the audience and therefore the price. Example: `["Male", "Female"]` */
                    gender?: ("Male" | "Female" | "Non-binary" | "All")[];
                    /** @description Target users by interest, using ids from `GET /interests`. A user matches if they share **any** of the interests supplied. Omitting the field applies no interest filter. Narrowing this reduces the audience and therefore the price. Example: `[3, 7]` */
                    interests?: number[];
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC. Now or later: a start more than 60 seconds before now (UTC) is refused with `E1`. Example: `"2027-07-10T08:00:00Z"`
                     */
                    start_datetime: string;
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC; at least 60 seconds after `start_datetime`. Example: `"2027-07-12T20:30:00Z"`
                     */
                    expiry_datetime: string;
                    /**
                     * @description `E` = Stripe payment link by email; `B` = deduct from organisation balance (the balance of the offer's mode: TEST and LIVE balances are separate). For `E`, an organisation registered in the UK is charged VAT at 20% on top, as a separate line on the Stripe payment page. The offer's price and balance stay net of VAT.
                     * @enum {string}
                     */
                    payment_method: "E" | "B";
                    /**
                     * @description `TEST` or `LIVE`, in capitals. Must be your API key's own mode: a `pk_live_` key creates LIVE offers only, a `pk_test_` key TEST offers only.
                     * @enum {string}
                     */
                    environment: "TEST" | "LIVE";
                };
            };
        };
        responses: {
            /**
             * @description S1: Offer created: payment link issued (`E`), or Active/Scheduled if paid from balance (`B`).
             *
             *     E2: The image failed automated content moderation: nothing created. Choose a different image.
             *
             *     E3: The organisation's balance is less than the offer's cost (`payment_method=B` only): top up and retry.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "offer_id": 45,
                     *       "status": "Awaiting Payment",
                     *       "payment_url": "https://checkout.stripe.com/c/pay/cs_live_...",
                     *       "currency": "GBP"
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        offer_id?: number;
                        status?: string;
                        payment_url?: string;
                        currency?: string;
                    };
                };
            };
            /**
             * @description E1: One or more inputs are missing or invalid: an invalid datetime, a duration under 60 seconds, a radius outside 5 to 30 miles, an oversized image or wrong file type, an unrecognised `gender` value, an unknown `interests` id, or an `advertised_name` over 100 characters, starting with http://, https:// or www., or containing HTML or a line break.
             *
             *     E1: `start_datetime` is more than 60 seconds before now (UTC): nothing created or charged. Message: "start_datetime cannot be in the past. Use the current time or later."
             *
             *     E1: A card payment (`payment_method=E`) below Stripe's minimum for your currency: nothing created; the message names the minimum.
             *
             *     E1: The `Idempotency-Key` header is missing. Message: "Idempotency-Key header is required."
             *
             *     E4: Offer quota limit exceeded: the user or organisation has reached its maximum number of offers.
             *
             *     E5: No Agilis users match the targeting supplied: nothing created. Widen the radius or broaden the `gender` or `interests` targeting.
             *
             *     E6: Your billing currency cannot be billed right now: nothing created or charged. The message is either `Your organisation's currency (XYZ) is not one Agilis bills in. An Org Admin can choose a supported billing currency in the Ad Portal. You have not been charged.` or `Prices in XYZ are temporarily unavailable because the exchange rate is out of date. Please try again later. You have not been charged.`, with your currency code in place of XYZ.
             *
             *     E10: `push_notification_title` or `push_notification_message` is missing or empty: nothing created or charged. The message names the field, for example "push_notification_title is required."
             *
             *     E11: `push_notification_title` or `push_notification_message` is shorter than 5 characters: nothing created or charged. The message names the field.
             *
             *     E12: `push_notification_title` is over 50 characters, or `push_notification_message` over 150: nothing created or charged. The message names the field and its limit.
             *
             *     E13: The notification text failed automated content moderation: nothing created or charged. The message names the field, for example "push_notification_message can't be used in a notification. Please change it."
             *
             *     E14: `button_preset` is not one of `claim_offer`, `visit_website`, `install_app`, `book_now`, `get_directions` or `custom`: nothing created or charged.
             *
             *     E15: `button_preset` is `custom` and `button_text` is missing, empty, or contains a line break or HTML: nothing created or charged. Message: "button_text is required when button_preset is custom, as plain text on one line."
             *
             *     E16: `button_text` is over 20 characters: nothing created or charged. Message: "button_text must be 20 characters or fewer."
             */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Authentication failure. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /**
             * @description E1: `environment` is not your API key's mode: nothing created or charged. Use a key created in that mode.
             *
             *     E9: Your organisation has not accepted the current Agilis Advertising Terms and Conditions: nothing created or charged. An Org Admin must accept them in the Ad Portal ([adportal.agilis.dating](https://adportal.agilis.dating)); then retry with the same `Idempotency-Key`.
             */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description The `Idempotency-Key` was reused while the first request is still being processed: retry shortly. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description The `Idempotency-Key` was reused with a different payload. */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    pauseOffer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Path parameter. Example: `45` */
                offer_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description S1: Offer paused successfully.
             *
             *     E2: Offer has already ended.
             *
             *     E3: Offer is already paused.
             *
             *     E5: Offer is awaiting payment.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "message": "Offer has been paused."
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                    };
                };
            };
            /** @description E1: Invalid API key, disabled account, or the offer does not belong to this account or is in the other mode. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    resumeOffer: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Path parameter. Example: `45` */
                offer_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description S2: Offer resumed successfully.
             *
             *     E2: Offer has already ended.
             *
             *     E4: Offer is already running.
             *
             *     E5: Offer is awaiting payment.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S2",
                     *       "message": "Offer has been resumed."
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                    };
                };
            };
            /** @description E1: Invalid API key, disabled account, or the offer does not belong to this account or is in the other mode. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    getOfferAnalytics: {
        parameters: {
            query: {
                /** @description One of `24h`, `7d`, `30d`, `60d`, `90d` or `all`. */
                interval: "24h" | "7d" | "30d" | "60d" | "90d" | "all";
            };
            header?: never;
            path: {
                /** @description Path parameter. Example: `45` */
                offer_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Analytics returned successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "offer_id": 45,
                     *       "interval": "30d",
                     *       "start_datetime": "2027-07-10T08:00:00Z",
                     *       "end_datetime": "2027-08-09T08:00:00Z",
                     *       "status": "Active",
                     *       "metrics": {
                     *         "views": 4789,
                     *         "clicks": 1032
                     *       }
                     *     }
                     */
                    "application/json": {
                        offer_id?: number;
                        interval?: string;
                        start_datetime?: string;
                        end_datetime?: string;
                        status?: string;
                        metrics?: {
                            views?: number;
                            clicks?: number;
                        };
                    };
                };
            };
            /** @description Invalid API key, disabled account, or the offer does not belong to this account or is in the other mode. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    deleteOffer: {
        parameters: {
            query?: {
                /** @description Optional. `true` answers with what deleting would do, including the Unused Time `refund` it would credit, marked `dry_run: true`. Nothing is deleted. */
                dry_run?: boolean;
            };
            header?: never;
            path: {
                /** @description Path parameter. Example: `45` */
                offer_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description S1: Offer deleted successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "message": "Offer has been deleted."
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                    };
                };
            };
            /** @description E1: Invalid input, or "Offer not found": the offer does not belong to this account or is in the other mode. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E6: The payment for this offer has just been completed, so it is no longer awaiting payment. Nothing has been deleted. Retrieve the offer again; if you still delete it, its Unused Time is credited to your balance. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E7: The payment page could not be closed. Nothing has been deleted. Try again in a few minutes. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listEventCategories: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Categories returned successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "categories": [
                     *         {
                     *           "category_id": 1,
                     *           "code": "live_music",
                     *           "category_name": "Live music"
                     *         },
                     *         {
                     *           "category_id": 2,
                     *           "code": "nightlife",
                     *           "category_name": "Clubs & nightlife"
                     *         },
                     *         {
                     *           "category_id": 3,
                     *           "code": "festivals",
                     *           "category_name": "Festivals"
                     *         },
                     *         {
                     *           "category_id": 4,
                     *           "code": "comedy",
                     *           "category_name": "Comedy"
                     *         },
                     *         {
                     *           "category_id": 5,
                     *           "code": "theatre_dance",
                     *           "category_name": "Theatre & dance"
                     *         },
                     *         {
                     *           "category_id": 6,
                     *           "code": "arts_exhibitions",
                     *           "category_name": "Arts & exhibitions"
                     *         },
                     *         {
                     *           "category_id": 7,
                     *           "code": "film",
                     *           "category_name": "Film"
                     *         },
                     *         {
                     *           "category_id": 8,
                     *           "code": "sports",
                     *           "category_name": "Sport"
                     *         },
                     *         {
                     *           "category_id": 9,
                     *           "code": "classes",
                     *           "category_name": "Classes & workshops"
                     *         },
                     *         {
                     *           "category_id": 10,
                     *           "code": "food_drink",
                     *           "category_name": "Food & drink"
                     *         },
                     *         {
                     *           "category_id": 11,
                     *           "code": "family",
                     *           "category_name": "Family & kids"
                     *         },
                     *         {
                     *           "category_id": 12,
                     *           "code": "other",
                     *           "category_name": "Other"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        categories?: {
                            category_id?: number;
                            code?: string;
                            category_name?: string;
                        }[];
                    };
                };
            };
            /** @description Missing or invalid API key, or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listEventCurrencies: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Currencies returned successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "currencies": [
                     *         "AED",
                     *         "AUD",
                     *         "CAD",
                     *         "CHF",
                     *         "DKK",
                     *         "EUR",
                     *         "GBP",
                     *         "MXN",
                     *         "NOK",
                     *         "NZD",
                     *         "PLN",
                     *         "SEK",
                     *         "USD"
                     *       ]
                     *     }
                     */
                    "application/json": {
                        currencies?: string[];
                    };
                };
            };
            /** @description Missing or invalid API key, or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    getEventConfig: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returned successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "listing_fee": 10,
                     *       "currency": "GBP",
                     *       "exchange_rate_per_gbp": 1,
                     *       "exchange_rate_date": null,
                     *       "environment": "LIVE",
                     *       "balance": 42.5,
                     *       "organisation_balance": 42.5,
                     *       "live_publishing_open": true,
                     *       "currencies": [
                     *         "AED",
                     *         "AUD",
                     *         "CAD",
                     *         "CHF",
                     *         "DKK",
                     *         "EUR",
                     *         "GBP",
                     *         "MXN",
                     *         "NOK",
                     *         "NZD",
                     *         "PLN",
                     *         "SEK",
                     *         "USD"
                     *       ],
                     *       "image": {
                     *         "max_mb": 10,
                     *         "min_width": 1280,
                     *         "min_height": 720
                     *       },
                     *       "max_years_ahead": 5
                     *     }
                     */
                    "application/json": {
                        listing_fee?: number;
                        currency?: string;
                        exchange_rate_per_gbp?: number;
                        /** @description Can be null. */
                        exchange_rate_date?: unknown;
                        environment?: string;
                        balance?: number;
                        organisation_balance?: number;
                        live_publishing_open?: boolean;
                        currencies?: string[];
                        image?: {
                            max_mb?: number;
                            min_width?: number;
                            min_height?: number;
                        };
                        max_years_ahead?: number;
                    };
                };
            };
            /** @description Missing or invalid API key, or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    previewEvent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** @description The full field set of `POST /events`, validated exactly as on publish. */
                    title?: string;
                    /** @description The full field set of `POST /events`, validated exactly as on publish. */
                    description?: string;
                    /** @description The full field set of `POST /events`, validated exactly as on publish. */
                    venue_name?: string;
                    /** @description JPG or PNG, detected from the file's content (not its name), up to **10 MB**, at least **1280 × 720** pixels. Members see events at 16:9: the image is scaled to fill a 16:9 frame with its centre kept and the overflow trimmed (a *centred cover crop*), never stretched or letterboxed. Pass `crop[x]`, `crop[y]`, `crop[w]` to choose the area yourself. If the area would be below 1280 × 720 the image is rejected rather than enlarged. Every image is decoded and re-encoded (so only a fresh copy is stored, with EXIF data including GPS removed), content-moderated, and scanned. Use `POST /events/preview` to see the result before paying. */
                    image?: string;
                    /** @description With `image`: the top-left corner and width, in pixels of the uploaded image, of the 16:9 area to use. The height is derived. Minimum width 1280. Omit for the centred cover crop. */
                    "crop[x]"?: number;
                    /** @description With `image`: the top-left corner and width, in pixels of the uploaded image, of the 16:9 area to use. The height is derived. Minimum width 1280. Omit for the centred cover crop. */
                    "crop[y]"?: number;
                    /** @description With `image`: the top-left corner and width, in pixels of the uploaded image, of the 16:9 area to use. The height is derived. Minimum width 1280. Omit for the centred cover crop. */
                    "crop[w]"?: number;
                    /**
                     * @description `TEST` or `LIVE`. Must be your API key's own mode (HTTP 403 otherwise). Decides whether `balance_after` subtracts the fee; `balance` is the balance for that mode.
                     * @enum {string}
                     */
                    environment: "TEST" | "LIVE";
                };
            };
        };
        responses: {
            /**
             * @description S1: Preview returned. `category` is what publishing this wording will get; `image.preview_token` is single-use, bound to your organisation and valid for 24 hours (`expires_at`); `image.preview_url` is a short-lived signed link to the processed picture. `listing_fee` is in your billing currency (`currency`). If your billing currency cannot be billed right now, the preview still returns `S1`, with `listing_fee` `null` and `balance_sufficient` `false`, and publishing would return `E6`.
             *
             *     E2: The image failed content moderation.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "category": {
                     *         "category_id": 9,
                     *         "category_name": "Classes & workshops"
                     *       },
                     *       "listing_fee": 10,
                     *       "currency": "GBP",
                     *       "balance": 42.5,
                     *       "balance_after": 42.5,
                     *       "balance_sufficient": true,
                     *       "live_publishing_open": true,
                     *       "price_gbp": 12,
                     *       "image": {
                     *         "preview_url": "https://cdn.agilis.dating/event-previews/92/…/event_large.jpg?Expires=…&Signature=…",
                     *         "width": 1920,
                     *         "height": 1080,
                     *         "master_width": 2400,
                     *         "master_height": 1800,
                     *         "crop": {
                     *           "x": 0,
                     *           "y": 225,
                     *           "w": 2400,
                     *           "h": 1350
                     *         },
                     *         "preview_token": "evp_8f3c1a9d2b4e7f0c1a3b5d7e9f2c4a6b8d0e1f3a5c7e",
                     *         "expires_at": "2027-09-23T10:30:00Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        category?: {
                            category_id?: number;
                            category_name?: string;
                        };
                        listing_fee?: number;
                        currency?: string;
                        balance?: number;
                        balance_after?: number;
                        balance_sufficient?: boolean;
                        live_publishing_open?: boolean;
                        price_gbp?: number;
                        image?: {
                            preview_url?: string;
                            width?: number;
                            height?: number;
                            master_width?: number;
                            master_height?: number;
                            crop?: {
                                x?: number;
                                y?: number;
                                w?: number;
                                h?: number;
                            };
                            preview_token?: string;
                            expires_at?: string;
                        };
                    };
                };
            };
            /** @description E1: Missing or invalid input, including an image that is too large, too small or not a JPEG/PNG. The `message` says which. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /**
             * @description E8: Too many previews this hour. Wait and retry.
             *
             *     Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After.
             */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    listEvents: {
        parameters: {
            query: {
                /** @description `test` or `live`. Case-insensitive. Must be your API key's own mode. */
                environment: "test" | "live" | "TEST" | "LIVE";
                /** @description Between 1 and 100. Default `20`. */
                limit?: number;
                /** @description The `next_cursor` from the previous page. */
                cursor?: string;
                /** @description One of `upcoming`, `scheduled`, `rescheduled`, `cancelled` or `ended`. */
                event_status?: "upcoming" | "scheduled" | "rescheduled" | "cancelled" | "ended";
                /** @description Organisation admins: only the events created by this user. */
                owner_user_id?: number;
                /** @description ISO 8601, UTC only. */
                created_after?: string;
                /** @description ISO 8601, UTC only. */
                created_before?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Events returned successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "data": [
                     *         {
                     *           "event_id": 3104,
                     *           "title": "Beginners Cuban Salsa: Friday Social",
                     *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                     *           "category": {
                     *             "category_id": 9,
                     *             "category_name": "Classes & workshops"
                     *           },
                     *           "venue_name": "Bar Salsa",
                     *           "address": "96 Charing Cross Road",
                     *           "city": "London",
                     *           "country_code": "GB",
                     *           "latitude": 51.5133,
                     *           "longitude": -0.13,
                     *           "starts_at": "2027-10-16T18:30:00Z",
                     *           "ends_at": "2027-10-16T23:00:00Z",
                     *           "url": "https://www.barsalsa.co.uk/classes/friday",
                     *           "advertised_name": null,
                     *           "price_min": 12,
                     *           "price_max": 12,
                     *           "currency": "GBP",
                     *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                     *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                     *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                     *           "event_status": "Scheduled",
                     *           "attendees": "10-25",
                     *           "owner": {
                     *             "user_id": 41,
                     *             "name": "Tom Reid"
                     *           },
                     *           "environment": "LIVE",
                     *           "reschedule_count": 0,
                     *           "cloned_from_event_id": null,
                     *           "creation_datetime": "2027-09-20T10:00:00Z",
                     *           "last_edited_at": null
                     *         }
                     *       ],
                     *       "pagination": {
                     *         "limit": 20,
                     *         "count": 1,
                     *         "has_more": false,
                     *         "next_cursor": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        data?: {
                            event_id?: number;
                            title?: string;
                            description?: string;
                            category?: {
                                category_id?: number;
                                category_name?: string;
                            };
                            venue_name?: string;
                            address?: string;
                            city?: string;
                            country_code?: string;
                            latitude?: number;
                            longitude?: number;
                            starts_at?: string;
                            ends_at?: string;
                            url?: string;
                            /** @description Can be null. */
                            advertised_name?: unknown;
                            price_min?: number;
                            price_max?: number;
                            currency?: string;
                            image?: string;
                            image_large?: string;
                            image_thumb?: string;
                            event_status?: string;
                            attendees?: string;
                            owner?: {
                                user_id?: number;
                                name?: string;
                            };
                            environment?: string;
                            reschedule_count?: number;
                            /** @description Can be null. */
                            cloned_from_event_id?: unknown;
                            creation_datetime?: string;
                            /** @description Can be null. */
                            last_edited_at?: unknown;
                        }[];
                        pagination?: {
                            limit?: number;
                            count?: number;
                            has_more?: boolean;
                            /** @description Can be null. */
                            next_cursor?: unknown;
                        };
                    };
                };
            };
            /** @description Missing or invalid `environment`, `limit`, `cursor` or filter. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Missing or invalid API key, or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description `environment` is not your API key's mode. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    publishEvent: {
        parameters: {
            query?: {
                /** @description Optional. `true` checks the fields, LIVE availability, the Terms, the fee and your balance, and answers with `listing_fee`, `amount_to_charge` and `balance_after`, marked `dry_run: true`. Nothing is created or charged, and no `Idempotency-Key` is needed. `POST /events/preview` shows the category and the image. */
                dry_run?: boolean;
            };
            header: {
                /** @description A unique value per event, for example a UUID. Retrying with the same key and the same fields returns the original response and never charges twice. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** @description Up to 120 characters. */
                    title: string;
                    /** @description Up to 5,000 characters. */
                    description: string;
                    /** @description Example: `Bar Salsa`. Read, with the title and description, to determine the category. */
                    venue_name: string;
                    /** @description Street address of the venue. */
                    address: string;
                    /** @description Example: `London` */
                    city: string;
                    /** @description ISO 3166-1 alpha-2. Example: `GB` (not UK). */
                    country_code: string;
                    /** @description Latitude first, then longitude, of the venue. Example: `51.5133`, `-0.1300`. **Coordinates are required and an address is not a substitute.** Every member sees how far the venue is from them, and that distance orders the list and drives the radius filter. `address` and `city` are shown to members but are never converted to coordinates on our side. */
                    location: number[];
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC only. Must be in the future and no more than 5 years ahead. Example: `2027-10-16T18:30:00Z`
                     */
                    starts_at: string;
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC only. Must be after `starts_at`.
                     */
                    ends_at: string;
                    /**
                     * Format: uri
                     * @description **Required.** The http(s) address of your own booking page. Members tap through to it to book; Agilis does not sell tickets. An event cannot be published without one.
                     */
                    url: string;
                    /** @description The business name members see as “Listed by …” instead of your trading name. Up to 100 characters; must not start with http://, https:// or www.; no HTML or line breaks. Omit or send empty to show your trading name. You must be authorised by the business you name. */
                    advertised_name?: string;
                    /** @description Ticket price, shown to members. Omit both to show no price (such events sort after priced ones when members sort by price). Send `0` for both to mark the event as free. Send the same value twice for a single price. */
                    price_min?: number;
                    /** @description Ticket price, shown to members. Omit both to show no price (such events sort after priced ones when members sort by price). Send `0` for both to mark the event as free. Send the same value twice for a single price. */
                    price_max?: number;
                    /** @description Currency of the ticket price, one of [`GET /event-currencies`](https://www.agilis.dating/api-doc#eventCurrenciesSectionid). Required whenever a price is supplied. It describes the ticket price only and has no effect on what you are charged. */
                    currency?: string;
                    /** @description JPG or PNG, detected from the file's content (not its name), up to **10 MB**, at least **1280 × 720** pixels. Members see events at 16:9: the image is scaled to fill a 16:9 frame with its centre kept and the overflow trimmed (a *centred cover crop*), never stretched or letterboxed. Pass `crop[x]`, `crop[y]`, `crop[w]` to choose the area yourself. If the area would be below 1280 × 720 the image is rejected rather than enlarged. Every image is decoded and re-encoded (so only a fresh copy is stored, with EXIF data including GPS removed), content-moderated, and scanned. Use `POST /events/preview` to see the result before paying. */
                    image?: string;
                    /** @description From `POST /events/preview`. Publishes exactly the image you previewed, with the crop you saw. Single-use. */
                    preview_token?: string;
                    /** @description Reuse the image of one of your organisation's existing events, for example last week's class. The image is copied to the new event (not shared). Send `crop[]` on a later `PATCH` to re-frame it. */
                    source_event_id?: number;
                    /** @description With `image` only: the 16:9 area to use. See Preview Event. */
                    "crop[x]"?: number;
                    /** @description With `image` only: the 16:9 area to use. See Preview Event. */
                    "crop[y]"?: number;
                    /** @description With `image` only: the 16:9 area to use. See Preview Event. */
                    "crop[w]"?: number;
                    /**
                     * @description `B` — pay from your balance. Payment by Stripe link is not available for events.
                     * @enum {string}
                     */
                    payment_method: "B";
                    /**
                     * @description `TEST` or `LIVE`. Must be your API key's own mode: a `pk_live_` key publishes LIVE events only, a `pk_test_` key TEST events only (HTTP 403 otherwise). A TEST event is validated, classified and moderated in full, including the balance check against your TEST balance, but is never charged, never invoiced and never shown to members.
                     * @enum {string}
                     */
                    environment: "TEST" | "LIVE";
                };
            };
        };
        responses: {
            /**
             * @description S1: Event published. `amount_charged` and `currency` show what was taken from your balance, in your billing currency (0 for TEST); `category` is the category determined for it. A LIVE event appears in the app within a few minutes.
             *
             *     E2: The image failed content moderation. Nothing was charged. Retry with the same Idempotency-Key and a different image.
             *
             *     E3: Insufficient balance. Nothing was created. Top up in the Ad Portal and retry with the same Idempotency-Key.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "event_id": 3104,
                     *       "status": "Scheduled",
                     *       "payment_url": null,
                     *       "amount_charged": 0,
                     *       "currency": "GBP",
                     *       "category": {
                     *         "category_id": 9,
                     *         "category_name": "Classes & workshops"
                     *       }
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        event_id?: number;
                        status?: string;
                        /** @description Can be null. */
                        payment_url?: unknown;
                        amount_charged?: number;
                        currency?: string;
                        category?: {
                            category_id?: number;
                            category_name?: string;
                        };
                    };
                };
            };
            /**
             * @description E1: Missing or invalid input: no `url`; no image source, or more than one; a `starts_at` in the past, `ends_at` before `starts_at`, or more than 5 years ahead; bad `country_code`; a price without a `currency`, or a currency not in `GET /event-currencies`; an image that is too large, too small, not a JPEG/PNG, or whose crop area is below 1280 × 720; an invalid, used or expired `preview_token`; a `source_event_id` that is not yours; an `advertised_name` over 100 characters, starting with http://, https:// or www., or containing HTML or a line break. The `message` says which.
             *
             *     E6: Your organisation's billing currency cannot be billed right now. Nothing was created or charged. The message is either `Your organisation's currency (XYZ) is not one Agilis bills in. An Org Admin can choose a supported billing currency in the Ad Portal. You have not been charged. The event has not been created.` or `Prices in XYZ are temporarily unavailable because the exchange rate is out of date. Please try again later. You have not been charged. The event has not been created.`, with your currency code in place of XYZ.
             */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /**
             * @description E7: LIVE publishing is temporarily unavailable. Nothing was created or charged. Retry later with the same Idempotency-Key.
             *
             *     E9: Your organisation has not accepted the current Agilis Advertising Terms and Conditions. Nothing was created or charged. An Org Admin must accept them in the Ad Portal ([adportal.agilis.dating](https://adportal.agilis.dating)); then retry with the same Idempotency-Key. Editing, rescheduling, cancelling and deleting existing events are not affected.
             *
             *     E1: `environment` is not your API key's mode. Nothing was created or charged.
             */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description A request with this Idempotency-Key is still being processed. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description This Idempotency-Key was already used with different fields. */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    getEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Path parameter. Example: `3104` */
                event_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Event returned. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "event_id": 3104,
                     *       "title": "Beginners Cuban Salsa: Friday Social",
                     *       "…": "every field of the list row, plus:",
                     *       "can_manage": true,
                     *       "can_delete": false,
                     *       "listing_price": 10,
                     *       "billing_currency": "GBP",
                     *       "invoice_id": "INV-2026-1047",
                     *       "app_synced_at": "2027-09-20T10:02:00Z",
                     *       "has_member_interaction": true,
                     *       "image_master": {
                     *         "width": 2400,
                     *         "height": 1800,
                     *         "crop": {
                     *           "x": 0,
                     *           "y": 225,
                     *           "w": 2400,
                     *           "h": 1350
                     *         },
                     *         "url": null
                     *       },
                     *       "history": [
                     *         {
                     *           "action": "published",
                     *           "channel": "api",
                     *           "acted_by_user_id": 41,
                     *           "acted_by": "Tom Reid",
                     *           "details": {
                     *             "environment": 1,
                     *             "category_id": 9,
                     *             "image_source": "preview"
                     *           },
                     *           "acknowledged": false,
                     *           "at": "2027-09-20T10:00:00Z"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        event_id?: number;
                        title?: string;
                        can_manage?: boolean;
                        can_delete?: boolean;
                        listing_price?: number;
                        billing_currency?: string;
                        invoice_id?: string;
                        app_synced_at?: string;
                        has_member_interaction?: boolean;
                        image_master?: {
                            width?: number;
                            height?: number;
                            crop?: {
                                x?: number;
                                y?: number;
                                w?: number;
                                h?: number;
                            };
                            /** @description Can be null. */
                            url?: unknown;
                        };
                        history?: {
                            action?: string;
                            channel?: string;
                            acted_by_user_id?: number;
                            acted_by?: string;
                            details?: {
                                environment?: number;
                                category_id?: number;
                                image_source?: string;
                            };
                            acknowledged?: boolean;
                            at?: string;
                        }[];
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E1: The event was not found on this account (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    deleteEvent: {
        parameters: {
            query?: {
                /** @description Optional. `true` checks that the event can be deleted and answers `dry_run: true` (or `E5` if members have interacted). Nothing changes. */
                dry_run?: boolean;
            };
            header?: never;
            path: {
                /** @description Path parameter. Example: `3104` */
                event_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description S1: Event deleted.
             *
             *     E5: Members have already interacted with this event. Use `POST /events/{event_id}/cancel`.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "message": "Event has been deleted."
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E1: The event was not found on this account (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    editEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Path parameter. Example: `3104` */
                event_id: number;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "multipart/form-data": {
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    title?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    description?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    url?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    advertised_name?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    venue_name?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    address?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    city?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    country_code?: string;
                    /** @description Same rules as on publish. Changing the venue tells members who are going that the venue changed. Send `advertised_name` empty to go back to your trading name. Changing only the name does not change the category and notifies nobody. */
                    location?: string;
                    /** @description A price change must send all three (all blank to show no price). */
                    price_min?: string;
                    /** @description A price change must send all three (all blank to show no price). */
                    price_max?: string;
                    /** @description A price change must send all three (all blank to show no price). */
                    currency?: string;
                    /** @description A replacement picture. Same rules as on publish; moderated. */
                    image?: string;
                    /** @description Alternatives to `image`, as on publish. */
                    preview_token?: string;
                    /** @description Alternatives to `image`, as on publish. */
                    source_event_id?: string;
                    /** @description On its own: re-frame the existing image from the stored original, with no re-upload. With `image`: the area of the new picture. */
                    "crop[x]"?: number;
                    /** @description On its own: re-frame the existing image from the stored original, with no re-upload. With `image`: the area of the new picture. */
                    "crop[y]"?: number;
                    /** @description On its own: re-frame the existing image from the stored original, with no re-upload. With `image`: the area of the new picture. */
                    "crop[w]"?: number;
                };
            };
        };
        responses: {
            /**
             * @description S1: Event updated. `changed_fields` lists what changed; `category` is the category after the change; `venue_changed` says whether members will be told of a venue change.
             *
             *     E2: A new image failed content moderation (nothing changed), or the event has ended or been cancelled and cannot be edited.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "message": "Event has been updated.",
                     *       "event_id": 3104,
                     *       "status": "Scheduled",
                     *       "category": {
                     *         "category_id": 4,
                     *         "category_name": "Comedy"
                     *       },
                     *       "changed_fields": [
                     *         "title",
                     *         "url"
                     *       ],
                     *       "image": "https://cdn.agilis.dating/92/events/a91e…/event_orig.jpg",
                     *       "image_large": "https://cdn.agilis.dating/92/events/a91e…/event_large.jpg",
                     *       "venue_changed": false
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                        event_id?: number;
                        status?: string;
                        category?: {
                            category_id?: number;
                            category_name?: string;
                        };
                        changed_fields?: string[];
                        image?: string;
                        image_large?: string;
                        venue_changed?: boolean;
                    };
                };
            };
            /** @description E1: Invalid input; dates sent (use Reschedule); or nothing to change. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E1: The event was not found on this account (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    rescheduleEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Path parameter. Example: `3104` */
                event_id: number;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "starts_at": "2027-10-23T18:30:00Z",
                 *       "ends_at": "2027-10-23T23:00:00Z"
                 *     }
                 */
                "application/json": {
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC only. In the future, no more than 5 years ahead.
                     */
                    starts_at: string;
                    /**
                     * Format: date-time
                     * @description ISO 8601, UTC only. After `starts_at`.
                     */
                    ends_at: string;
                };
            };
        };
        responses: {
            /**
             * @description S1: Event rescheduled.
             *
             *     E2: The event has already ended or been cancelled and cannot be amended.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "message": "Event has been rescheduled.",
                     *       "event_id": 3104,
                     *       "status": "Rescheduled",
                     *       "starts_at": "2027-10-23T18:30:00Z",
                     *       "ends_at": "2027-10-23T23:00:00Z"
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                        event_id?: number;
                        status?: string;
                        starts_at?: string;
                        ends_at?: string;
                    };
                };
            };
            /** @description E1: Invalid or unchanged dates. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E1: The event was not found on this account (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    cancelEvent: {
        parameters: {
            query?: {
                /** @description Optional. `true` checks that the event can be cancelled and answers `dry_run: true`. Nothing changes. */
                dry_run?: boolean;
            };
            header?: never;
            path: {
                /** @description Path parameter. Example: `3104` */
                event_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /**
             * @description S1: Event cancelled. The listing fee is not refunded.
             *
             *     E2: The event has already ended or been cancelled.
             */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "message": "Event has been cancelled. Listing fees are non-refundable.",
                     *       "event_id": 3104,
                     *       "status": "Cancelled"
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        message?: string;
                        event_id?: number;
                        status?: string;
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E1: The event was not found on this account (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    getEventAnalytics: {
        parameters: {
            query: {
                /** @description One of `24h`, `7d`, `30d`, `60d`, `90d` or `all`. */
                interval: "24h" | "7d" | "30d" | "60d" | "90d" | "all";
            };
            header?: never;
            path: {
                /** @description Path parameter. Example: `3104` */
                event_id: number;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Analytics returned successfully. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "event_id": 3104,
                     *       "interval": "30d",
                     *       "starts_at": "2027-10-16T18:30:00Z",
                     *       "ends_at": "2027-10-16T23:00:00Z",
                     *       "status": "Scheduled",
                     *       "metrics": {
                     *         "clicks": 188,
                     *         "attendees": "26-50",
                     *         "invites_sent": "26-50",
                     *         "invites_accepted": "10-25"
                     *       },
                     *       "as_of": "2027-09-20T14:05:00Z"
                     *     }
                     */
                    "application/json": {
                        event_id?: number;
                        interval?: string;
                        starts_at?: string;
                        ends_at?: string;
                        status?: string;
                        metrics?: {
                            clicks?: number;
                            attendees?: string;
                            invites_sent?: string;
                            invites_accepted?: string;
                        };
                        as_of?: string;
                    };
                };
            };
            /** @description Missing or invalid `interval`. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Missing or invalid API key, or disabled account. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description The event was not found on this account. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Internal server error. */
            500: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listWebhookEndpoints: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description S1: Endpoints returned (up to 16). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "data": [
                     *         {
                     *           "id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *           "url": "https://hooks.example.com/agilis",
                     *           "description": "Order system",
                     *           "enabled_events": [
                     *             "offer.started",
                     *             "offer.ended",
                     *             "event.published"
                     *           ],
                     *           "status": "enabled",
                     *           "livemode": false,
                     *           "created": "2027-09-20T10:00:00Z",
                     *           "last_success_at": "2027-09-21T08:15:02Z",
                     *           "failing_since": null,
                     *           "disabled_by": null,
                     *           "disabled_reason": null,
                     *           "previous_secret_expires_at": null
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        data?: {
                            id?: string;
                            url?: string;
                            description?: string;
                            enabled_events?: string[];
                            status?: string;
                            livemode?: boolean;
                            created?: string;
                            last_success_at?: string;
                            /** @description Can be null. */
                            failing_since?: unknown;
                            /** @description Can be null. */
                            disabled_by?: unknown;
                            /** @description Can be null. */
                            disabled_reason?: unknown;
                            /** @description Can be null. */
                            previous_secret_expires_at?: unknown;
                        }[];
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    createWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "url": "https://hooks.example.com/agilis",
                 *       "enabled_events": [
                 *         "offer.started",
                 *         "offer.ended",
                 *         "event.published"
                 *       ],
                 *       "description": "Order system"
                 *     }
                 */
                "application/json": {
                    /**
                     * Format: uri
                     * @description Where to send events: an `https://` address with a host name (not an IP address), on the standard port 443, that resolves to a public internet address. Up to 2,048 characters.
                     */
                    url: string;
                    /** @description The event types to send, or `["*"]` for all, including types added later. See [Webhooks](https://www.agilis.dating/api-doc#webhooksSection) for the list. */
                    enabled_events: ("*" | "offer.created" | "offer.payment_succeeded" | "offer.payment_failed" | "offer.started" | "offer.paused" | "offer.resumed" | "offer.ended" | "offer.deleted" | "offer.disabled" | "offer.enabled" | "event.published" | "event.updated" | "event.rescheduled" | "event.cancelled" | "event.deleted" | "event.ended" | "balance.topped_up" | "balance.low" | "invoice.created" | "terms.version_issued")[];
                    /** @description Optional. What the endpoint is for, up to 255 characters. */
                    description?: string;
                };
            };
        };
        responses: {
            /** @description S1: Endpoint created. It starts receiving events straight away. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *       "url": "https://hooks.example.com/agilis",
                     *       "description": "Order system",
                     *       "enabled_events": [
                     *         "offer.started",
                     *         "offer.ended",
                     *         "event.published"
                     *       ],
                     *       "status": "enabled",
                     *       "livemode": false,
                     *       "created": "2027-09-20T10:00:00Z",
                     *       "last_success_at": null,
                     *       "failing_since": null,
                     *       "disabled_by": null,
                     *       "disabled_reason": null,
                     *       "previous_secret_expires_at": null,
                     *       "secret": "whsec_4mJ0c…"
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        id?: string;
                        url?: string;
                        description?: string;
                        enabled_events?: string[];
                        status?: string;
                        livemode?: boolean;
                        created?: string;
                        /** @description Can be null. */
                        last_success_at?: unknown;
                        /** @description Can be null. */
                        failing_since?: unknown;
                        /** @description Can be null. */
                        disabled_by?: unknown;
                        /** @description Can be null. */
                        disabled_reason?: unknown;
                        /** @description Can be null. */
                        previous_secret_expires_at?: unknown;
                        /** @description The signing secret, beginning `whsec_`. Shown only in this response and when rolled. */
                        secret?: string;
                    };
                };
            };
            /** @description E1: Invalid `url`, `enabled_events` or `description`. The `message` says which. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E4: Your organisation already has 16 endpoints in this mode. Delete one first. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    getWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The endpoint id. Example: `we_01JD2X4Q7N8P9R0S1T2V3W4X5Y` */
                endpoint_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description S1: Endpoint returned. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *       "url": "https://hooks.example.com/agilis",
                     *       "description": "Order system",
                     *       "enabled_events": [
                     *         "offer.started",
                     *         "offer.ended",
                     *         "event.published"
                     *       ],
                     *       "status": "enabled",
                     *       "livemode": false,
                     *       "created": "2027-09-20T10:00:00Z",
                     *       "last_success_at": "2027-09-21T08:15:02Z",
                     *       "failing_since": null,
                     *       "disabled_by": null,
                     *       "disabled_reason": null,
                     *       "previous_secret_expires_at": null
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        id?: string;
                        url?: string;
                        description?: string;
                        enabled_events?: string[];
                        status?: string;
                        livemode?: boolean;
                        created?: string;
                        last_success_at?: string;
                        /** @description Can be null. */
                        failing_since?: unknown;
                        /** @description Can be null. */
                        disabled_by?: unknown;
                        /** @description Can be null. */
                        disabled_reason?: unknown;
                        /** @description Can be null. */
                        previous_secret_expires_at?: unknown;
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    deleteWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The endpoint id. Example: `we_01JD2X4Q7N8P9R0S1T2V3W4X5Y` */
                endpoint_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description S1: Endpoint deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *       "deleted": true
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        id?: string;
                        deleted?: boolean;
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    updateWebhookEndpoint: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The endpoint id. Example: `we_01JD2X4Q7N8P9R0S1T2V3W4X5Y` */
                endpoint_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "enabled_events": [
                 *         "*"
                 *       ]
                 *     }
                 */
                "application/json": {
                    /**
                     * Format: uri
                     * @description Where to send events: an `https://` address with a host name (not an IP address), on the standard port 443, that resolves to a public internet address. Up to 2,048 characters.
                     */
                    url?: string;
                    /** @description The event types to send, or `["*"]` for all, including types added later. See [Webhooks](https://www.agilis.dating/api-doc#webhooksSection) for the list. */
                    enabled_events?: ("*" | "offer.created" | "offer.payment_succeeded" | "offer.payment_failed" | "offer.started" | "offer.paused" | "offer.resumed" | "offer.ended" | "offer.deleted" | "offer.disabled" | "offer.enabled" | "event.published" | "event.updated" | "event.rescheduled" | "event.cancelled" | "event.deleted" | "event.ended" | "balance.topped_up" | "balance.low" | "invoice.created" | "terms.version_issued")[];
                    /** @description Up to 255 characters, or `null` to clear it. */
                    description?: string;
                    /**
                     * @description `disabled` stops sending events to it; `enabled` starts again.
                     * @enum {string}
                     */
                    status?: "enabled" | "disabled";
                };
            };
        };
        responses: {
            /** @description S1: Endpoint updated. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *       "url": "https://hooks.example.com/agilis",
                     *       "description": "Order system",
                     *       "enabled_events": [
                     *         "*"
                     *       ],
                     *       "status": "enabled",
                     *       "livemode": false,
                     *       "created": "2027-09-20T10:00:00Z",
                     *       "last_success_at": "2027-09-21T08:15:02Z",
                     *       "failing_since": null,
                     *       "disabled_by": null,
                     *       "disabled_reason": null,
                     *       "previous_secret_expires_at": null
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        id?: string;
                        url?: string;
                        description?: string;
                        enabled_events?: string[];
                        status?: string;
                        livemode?: boolean;
                        created?: string;
                        last_success_at?: string;
                        /** @description Can be null. */
                        failing_since?: unknown;
                        /** @description Can be null. */
                        disabled_by?: unknown;
                        /** @description Can be null. */
                        disabled_reason?: unknown;
                        /** @description Can be null. */
                        previous_secret_expires_at?: unknown;
                    };
                };
            };
            /** @description E1: Invalid input. The `message` says which. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: Agilis support turned this endpoint off. Contact help@agilis.dating. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    rollWebhookSecret: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The endpoint id. Example: `we_01JD2X4Q7N8P9R0S1T2V3W4X5Y` */
                endpoint_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "expires_in": "24h"
                 *     }
                 */
                "application/json": {
                    /**
                     * @description How long the old secret keeps signing. Default `24h`. `now` stops it at once, for a secret that may have leaked.
                     * @enum {string}
                     */
                    expires_in?: "now" | "1h" | "24h" | "7d";
                };
            };
        };
        responses: {
            /** @description S1: Secret replaced. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *       "url": "https://hooks.example.com/agilis",
                     *       "description": "Order system",
                     *       "enabled_events": [
                     *         "offer.started",
                     *         "offer.ended",
                     *         "event.published"
                     *       ],
                     *       "status": "enabled",
                     *       "livemode": false,
                     *       "created": "2027-09-20T10:00:00Z",
                     *       "last_success_at": "2027-09-21T08:15:02Z",
                     *       "failing_since": null,
                     *       "disabled_by": null,
                     *       "disabled_reason": null,
                     *       "previous_secret_expires_at": "2027-09-22T10:00:00Z",
                     *       "secret": "whsec_9pQ2r…"
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        id?: string;
                        url?: string;
                        description?: string;
                        enabled_events?: string[];
                        status?: string;
                        livemode?: boolean;
                        created?: string;
                        last_success_at?: string;
                        /** @description Can be null. */
                        failing_since?: unknown;
                        /** @description Can be null. */
                        disabled_by?: unknown;
                        /** @description Can be null. */
                        disabled_reason?: unknown;
                        previous_secret_expires_at?: string;
                        secret?: string;
                    };
                };
            };
            /** @description E1: Invalid `expires_in`. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    sendTestWebhook: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The endpoint id. Example: `we_01JD2X4Q7N8P9R0S1T2V3W4X5Y` */
                endpoint_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "type": "offer.started"
                 *     }
                 */
                "application/json": {
                    /**
                     * @description The event type to send. Default `offer.created`.
                     * @enum {string}
                     */
                    type?: "offer.created" | "offer.payment_succeeded" | "offer.payment_failed" | "offer.started" | "offer.paused" | "offer.resumed" | "offer.ended" | "offer.deleted" | "offer.disabled" | "offer.enabled" | "event.published" | "event.updated" | "event.rescheduled" | "event.cancelled" | "event.deleted" | "event.ended" | "balance.topped_up" | "balance.low" | "invoice.created" | "terms.version_issued";
                };
            };
        };
        responses: {
            /** @description S1: Sent. `delivery.status` is `succeeded` when your server answered 2xx within 10 seconds, otherwise `failed` with `last_http_status` or `last_error`. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "webhook_event_id": "whevt_01JD2Y8B3C4D5E6F7G8H9J0K1M",
                     *       "type": "offer.started",
                     *       "test": true,
                     *       "delivery": {
                     *         "endpoint_id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *         "status": "succeeded",
                     *         "attempts": 1,
                     *         "last_http_status": 200,
                     *         "last_error": null,
                     *         "next_attempt_at": null,
                     *         "delivered_at": "2027-09-21T08:15:02Z"
                     *       }
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        webhook_event_id?: string;
                        type?: string;
                        test?: boolean;
                        delivery?: {
                            endpoint_id?: string;
                            status?: string;
                            attempts?: number;
                            last_http_status?: number;
                            /** @description Can be null. */
                            last_error?: unknown;
                            /** @description Can be null. */
                            next_attempt_at?: unknown;
                            delivered_at?: string;
                        };
                    };
                };
            };
            /** @description E1: Invalid `type`. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The endpoint is turned off. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    listWebhookEvents: {
        parameters: {
            query?: {
                /** @description Only events of this type. */
                type?: "offer.created" | "offer.payment_succeeded" | "offer.payment_failed" | "offer.started" | "offer.paused" | "offer.resumed" | "offer.ended" | "offer.deleted" | "offer.disabled" | "offer.enabled" | "event.published" | "event.updated" | "event.rescheduled" | "event.cancelled" | "event.deleted" | "event.ended" | "balance.topped_up" | "balance.low" | "invoice.created" | "terms.version_issued";
                /** @description `false`: only events not yet delivered to every endpoint. `true`: only events delivered everywhere. */
                delivery_success?: boolean;
                /** @description Page size, 1 to 100. Default 20. */
                limit?: number;
                /** @description The `next_cursor` of the previous page. */
                cursor?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description S1: Events returned. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "data": [
                     *         {
                     *           "id": "whevt_01JD2Y8B3C4D5E6F7G8H9J0K1M",
                     *           "type": "offer.started",
                     *           "created": 1821341702,
                     *           "livemode": false,
                     *           "test": false,
                     *           "data": {
                     *             "object": {
                     *               "offer_id": 45,
                     *               "title": "20% off summer sale",
                     *               "offer_status": "Active",
                     *               "…": "…"
                     *             }
                     *           },
                     *           "request": {
                     *             "source": "system",
                     *             "idempotency_key": null
                     *           },
                     *           "deliveries": [
                     *             {
                     *               "endpoint_id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *               "status": "pending",
                     *               "attempts": 2,
                     *               "last_http_status": 503,
                     *               "last_error": null,
                     *               "next_attempt_at": "2027-09-21T08:45:00Z",
                     *               "delivered_at": null
                     *             }
                     *           ]
                     *         }
                     *       ],
                     *       "pagination": {
                     *         "limit": 20,
                     *         "count": 1,
                     *         "has_more": false,
                     *         "next_cursor": null
                     *       }
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        data?: {
                            id?: string;
                            type?: string;
                            created?: number;
                            livemode?: boolean;
                            test?: boolean;
                            data?: {
                                object?: {
                                    offer_id?: number;
                                    title?: string;
                                    offer_status?: string;
                                };
                            };
                            request?: {
                                source?: string;
                                /** @description Can be null. */
                                idempotency_key?: unknown;
                            };
                            deliveries?: {
                                endpoint_id?: string;
                                status?: string;
                                attempts?: number;
                                last_http_status?: number;
                                /** @description Can be null. */
                                last_error?: unknown;
                                next_attempt_at?: string;
                                /** @description Can be null. */
                                delivered_at?: unknown;
                            }[];
                        }[];
                        pagination?: {
                            limit?: number;
                            count?: number;
                            has_more?: boolean;
                            /** @description Can be null. */
                            next_cursor?: unknown;
                        };
                    };
                };
            };
            /** @description E1: Invalid filter, `limit` or `cursor`. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    getWebhookEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The webhook event id. Example: `whevt_01JD2Y8B3C4D5E6F7G8H9J0K1M` */
                webhook_event_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description S1: Event returned. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "id": "whevt_01JD2Y8B3C4D5E6F7G8H9J0K1M",
                     *       "type": "offer.started",
                     *       "created": 1821341702,
                     *       "livemode": false,
                     *       "test": false,
                     *       "data": {
                     *         "object": {
                     *           "offer_id": 45,
                     *           "…": "…"
                     *         }
                     *       },
                     *       "request": {
                     *         "source": "system",
                     *         "idempotency_key": null
                     *       },
                     *       "deliveries": [
                     *         {
                     *           "endpoint_id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *           "status": "succeeded",
                     *           "attempts": 1,
                     *           "last_http_status": 200,
                     *           "last_error": null,
                     *           "next_attempt_at": null,
                     *           "delivered_at": "2027-09-21T08:15:02Z"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        id?: string;
                        type?: string;
                        created?: number;
                        livemode?: boolean;
                        test?: boolean;
                        data?: {
                            object?: {
                                offer_id?: number;
                            };
                        };
                        request?: {
                            source?: string;
                            /** @description Can be null. */
                            idempotency_key?: unknown;
                        };
                        deliveries?: {
                            endpoint_id?: string;
                            status?: string;
                            attempts?: number;
                            last_http_status?: number;
                            /** @description Can be null. */
                            last_error?: unknown;
                            /** @description Can be null. */
                            next_attempt_at?: unknown;
                            delivered_at?: string;
                        }[];
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    resendWebhookEvent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description The webhook event id. Example: `whevt_01JD2Y8B3C4D5E6F7G8H9J0K1M` */
                webhook_event_id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                /**
                 * @example {
                 *       "endpoint_id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y"
                 *     }
                 */
                "application/json": {
                    /** @description Send to this endpoint only, including one the event did not go to at first. Omit to send to every endpoint it went to. */
                    endpoint_id?: string;
                };
            };
        };
        responses: {
            /** @description S1: Sent. `deliveries` has each result. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    /**
                     * @example {
                     *       "return_code": "S1",
                     *       "webhook_event_id": "whevt_01JD2Y8B3C4D5E6F7G8H9J0K1M",
                     *       "deliveries": [
                     *         {
                     *           "endpoint_id": "we_01JD2X4Q7N8P9R0S1T2V3W4X5Y",
                     *           "status": "succeeded",
                     *           "attempts": 3,
                     *           "last_http_status": 200,
                     *           "last_error": null,
                     *           "next_attempt_at": null,
                     *           "delivered_at": "2027-09-21T08:15:02Z"
                     *         }
                     *       ]
                     *     }
                     */
                    "application/json": {
                        return_code?: string;
                        webhook_event_id?: string;
                        deliveries?: {
                            endpoint_id?: string;
                            status?: string;
                            attempts?: number;
                            last_http_status?: number;
                            /** @description Can be null. */
                            last_error?: unknown;
                            /** @description Can be null. */
                            next_attempt_at?: unknown;
                            delivered_at?: string;
                        }[];
                    };
                };
            };
            /** @description Invalid or missing API key, or a disabled account. Every bad key gets the same 401. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The key is not an Org Admin's or a Developer's. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E3: Not found in this organisation and mode (HTTP 404). */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description E2: The event is more than 15 days old, is still being sent for the first time, or went to no endpoint (give `endpoint_id`). */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
            /** @description Rate limit exceeded (60 requests a minute per API key, or repeated invalid keys): wait for the number of seconds in Retry-After. */
            429: {
                headers: {
                    /** @description Seconds to wait. Sent when the per-key limit or the invalid-key limit is reached. */
                    "Retry-After"?: number;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReturnCode"];
                };
            };
        };
    };
    offerCreatedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.created",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "payment_method": "B",
                 *         "amount_charged": 12.5,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": "6f1c2a9e-0b7d-4c55-9a51-3d2f8e7b1c04"
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.created";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /**
                         * @description B: paid from your balance. E: awaiting payment by Stripe link.
                         * @enum {string}
                         */
                        payment_method?: "B" | "E";
                        /** @description What was deducted from your balance (payment_method B only). */
                        amount_charged?: number;
                        /** @description What the payment link asks for, before any VAT (payment_method E only). */
                        amount_due?: number;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerPaymentSucceededWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.payment_succeeded",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "amount_paid": 12.5,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.payment_succeeded";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /** @description The amount paid. */
                        amount_paid?: number | null;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerPaymentFailedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.payment_failed",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "reason": "declined",
                 *         "amount_due": 12.5,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.payment_failed";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /**
                         * @description declined: the card was declined (the payer can try again); failed: the payment failed; expired: the payment link expired.
                         * @enum {string}
                         */
                        reason?: "declined" | "failed" | "expired";
                        /** @description The amount that was due. */
                        amount_due?: number | null;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerStartedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.started",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "system",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.started";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerPausedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.paused",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "paused_by": "business"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.paused";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /**
                         * @description Who paused it: your organisation, or Agilis.
                         * @enum {string}
                         */
                        paused_by?: "business" | "agilis";
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerResumedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.resumed",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "resumed_by": "business"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.resumed";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /**
                         * @description Who resumed it: your organisation, or Agilis.
                         * @enum {string}
                         */
                        resumed_by?: "business" | "agilis";
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerEndedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.ended",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "unused_time_credited": 0,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "system",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.ended";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /** @description Credited to your balance for time the Offer did not run (0 if none). */
                        unused_time_credited?: number;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerDeletedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.deleted",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         },
                 *         "unused_time_credited": 1.25,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.deleted";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                        /** @description Credited to your balance for time the Offer did not run (0 if none). */
                        unused_time_credited?: number;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerDisabledWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.disabled",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "agilis",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.disabled";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    offerEnabledWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "offer.enabled",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "offer_id": 45,
                 *           "title": "20% off summer sale",
                 *           "category": "Retail",
                 *           "description": "Discount valid through July",
                 *           "terms_and_conditions": "Valid online only.",
                 *           "advertised_name": null,
                 *           "push_notification_title": "20% off this summer",
                 *           "push_notification_message": "Show this at the till for 20% off everything until the end of July.",
                 *           "button_preset": "claim_offer",
                 *           "button_text": null,
                 *           "url": "https://advertiseroffer.com",
                 *           "image": "https://ads.agilis.dating/92/offers/45/offer_orig.png",
                 *           "latitude": 51.5074,
                 *           "longitude": -0.1278,
                 *           "radius": 10,
                 *           "gender": [
                 *             "Male",
                 *             "Female"
                 *           ],
                 *           "interests": [
                 *             {
                 *               "interest_id": 3,
                 *               "interest_name": "Cooking"
                 *             },
                 *             {
                 *               "interest_id": 7,
                 *               "interest_name": "Fitness"
                 *             }
                 *           ],
                 *           "start_datetime": "2027-07-10T08:00:00Z",
                 *           "expiry_datetime": "2027-07-12T20:30:00Z",
                 *           "creation_datetime": "2027-06-01T10:00:00Z",
                 *           "offer_status": "Active",
                 *           "status": "enabled"
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "agilis",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "offer.enabled";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Offer, in the same shape as an item of GET /offers. */
                        object: Record<string, never>;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    eventPublishedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "event.published",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "event_id": 3104,
                 *           "title": "Beginners Cuban Salsa: Friday Social",
                 *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                 *           "category": {
                 *             "category_id": 9,
                 *             "category_name": "Classes & workshops"
                 *           },
                 *           "venue_name": "Bar Salsa",
                 *           "address": "96 Charing Cross Road",
                 *           "city": "London",
                 *           "country_code": "GB",
                 *           "latitude": 51.5133,
                 *           "longitude": -0.13,
                 *           "starts_at": "2027-10-16T18:30:00Z",
                 *           "ends_at": "2027-10-16T23:00:00Z",
                 *           "url": "https://www.barsalsa.co.uk/classes/friday",
                 *           "advertised_name": null,
                 *           "price_min": 12,
                 *           "price_max": 12,
                 *           "currency": "GBP",
                 *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                 *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                 *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                 *           "event_status": "Scheduled",
                 *           "attendees": "10-25",
                 *           "owner": {
                 *             "user_id": 41,
                 *             "name": "Tom Reid"
                 *           },
                 *           "environment": "LIVE",
                 *           "reschedule_count": 0,
                 *           "cloned_from_event_id": null,
                 *           "creation_datetime": "2027-09-20T10:00:00Z",
                 *           "last_edited_at": null
                 *         },
                 *         "amount_charged": 10,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": "6f1c2a9e-0b7d-4c55-9a51-3d2f8e7b1c04"
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "event.published";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Event, in the same shape as an item of GET /events. */
                        object: Record<string, never>;
                        /** @description The listing fee taken from your balance (0 for a TEST event). */
                        amount_charged?: number;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    eventUpdatedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "event.updated",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "event_id": 3104,
                 *           "title": "Beginners Cuban Salsa: Friday Social",
                 *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                 *           "category": {
                 *             "category_id": 9,
                 *             "category_name": "Classes & workshops"
                 *           },
                 *           "venue_name": "Bar Salsa",
                 *           "address": "96 Charing Cross Road",
                 *           "city": "London",
                 *           "country_code": "GB",
                 *           "latitude": 51.5133,
                 *           "longitude": -0.13,
                 *           "starts_at": "2027-10-16T18:30:00Z",
                 *           "ends_at": "2027-10-16T23:00:00Z",
                 *           "url": "https://www.barsalsa.co.uk/classes/friday",
                 *           "advertised_name": null,
                 *           "price_min": 12,
                 *           "price_max": 12,
                 *           "currency": "GBP",
                 *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                 *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                 *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                 *           "event_status": "Scheduled",
                 *           "attendees": "10-25",
                 *           "owner": {
                 *             "user_id": 41,
                 *             "name": "Tom Reid"
                 *           },
                 *           "environment": "LIVE",
                 *           "reschedule_count": 0,
                 *           "cloned_from_event_id": null,
                 *           "creation_datetime": "2027-09-20T10:00:00Z",
                 *           "last_edited_at": null
                 *         },
                 *         "changed_fields": [
                 *           "title",
                 *           "image"
                 *         ]
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "event.updated";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Event, in the same shape as an item of GET /events. */
                        object: Record<string, never>;
                        /** @description The fields that changed. */
                        changed_fields?: string[];
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    eventRescheduledWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "event.rescheduled",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "event_id": 3104,
                 *           "title": "Beginners Cuban Salsa: Friday Social",
                 *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                 *           "category": {
                 *             "category_id": 9,
                 *             "category_name": "Classes & workshops"
                 *           },
                 *           "venue_name": "Bar Salsa",
                 *           "address": "96 Charing Cross Road",
                 *           "city": "London",
                 *           "country_code": "GB",
                 *           "latitude": 51.5133,
                 *           "longitude": -0.13,
                 *           "starts_at": "2027-10-16T18:30:00Z",
                 *           "ends_at": "2027-10-16T23:00:00Z",
                 *           "url": "https://www.barsalsa.co.uk/classes/friday",
                 *           "advertised_name": null,
                 *           "price_min": 12,
                 *           "price_max": 12,
                 *           "currency": "GBP",
                 *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                 *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                 *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                 *           "event_status": "Scheduled",
                 *           "attendees": "10-25",
                 *           "owner": {
                 *             "user_id": 41,
                 *             "name": "Tom Reid"
                 *           },
                 *           "environment": "LIVE",
                 *           "reschedule_count": 0,
                 *           "cloned_from_event_id": null,
                 *           "creation_datetime": "2027-09-20T10:00:00Z",
                 *           "last_edited_at": null
                 *         },
                 *         "reschedule_count": 1
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "event.rescheduled";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Event, in the same shape as an item of GET /events. */
                        object: Record<string, never>;
                        /** @description How many times it has been rescheduled. */
                        reschedule_count?: number;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    eventCancelledWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "event.cancelled",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "event_id": 3104,
                 *           "title": "Beginners Cuban Salsa: Friday Social",
                 *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                 *           "category": {
                 *             "category_id": 9,
                 *             "category_name": "Classes & workshops"
                 *           },
                 *           "venue_name": "Bar Salsa",
                 *           "address": "96 Charing Cross Road",
                 *           "city": "London",
                 *           "country_code": "GB",
                 *           "latitude": 51.5133,
                 *           "longitude": -0.13,
                 *           "starts_at": "2027-10-16T18:30:00Z",
                 *           "ends_at": "2027-10-16T23:00:00Z",
                 *           "url": "https://www.barsalsa.co.uk/classes/friday",
                 *           "advertised_name": null,
                 *           "price_min": 12,
                 *           "price_max": 12,
                 *           "currency": "GBP",
                 *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                 *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                 *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                 *           "event_status": "Scheduled",
                 *           "attendees": "10-25",
                 *           "owner": {
                 *             "user_id": 41,
                 *             "name": "Tom Reid"
                 *           },
                 *           "environment": "LIVE",
                 *           "reschedule_count": 0,
                 *           "cloned_from_event_id": null,
                 *           "creation_datetime": "2027-09-20T10:00:00Z",
                 *           "last_edited_at": null
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "event.cancelled";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Event, in the same shape as an item of GET /events. */
                        object: Record<string, never>;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    eventDeletedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "event.deleted",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "event_id": 3104,
                 *           "title": "Beginners Cuban Salsa: Friday Social",
                 *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                 *           "category": {
                 *             "category_id": 9,
                 *             "category_name": "Classes & workshops"
                 *           },
                 *           "venue_name": "Bar Salsa",
                 *           "address": "96 Charing Cross Road",
                 *           "city": "London",
                 *           "country_code": "GB",
                 *           "latitude": 51.5133,
                 *           "longitude": -0.13,
                 *           "starts_at": "2027-10-16T18:30:00Z",
                 *           "ends_at": "2027-10-16T23:00:00Z",
                 *           "url": "https://www.barsalsa.co.uk/classes/friday",
                 *           "advertised_name": null,
                 *           "price_min": 12,
                 *           "price_max": 12,
                 *           "currency": "GBP",
                 *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                 *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                 *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                 *           "event_status": "Scheduled",
                 *           "attendees": "10-25",
                 *           "owner": {
                 *             "user_id": 41,
                 *             "name": "Tom Reid"
                 *           },
                 *           "environment": "LIVE",
                 *           "reschedule_count": 0,
                 *           "cloned_from_event_id": null,
                 *           "creation_datetime": "2027-09-20T10:00:00Z",
                 *           "last_edited_at": null
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "event.deleted";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Event, in the same shape as an item of GET /events. */
                        object: Record<string, never>;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    eventEndedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "event.ended",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "event_id": 3104,
                 *           "title": "Beginners Cuban Salsa: Friday Social",
                 *           "description": "Drop-in class for absolute beginners, followed by a social until late. No partner needed.",
                 *           "category": {
                 *             "category_id": 9,
                 *             "category_name": "Classes & workshops"
                 *           },
                 *           "venue_name": "Bar Salsa",
                 *           "address": "96 Charing Cross Road",
                 *           "city": "London",
                 *           "country_code": "GB",
                 *           "latitude": 51.5133,
                 *           "longitude": -0.13,
                 *           "starts_at": "2027-10-16T18:30:00Z",
                 *           "ends_at": "2027-10-16T23:00:00Z",
                 *           "url": "https://www.barsalsa.co.uk/classes/friday",
                 *           "advertised_name": null,
                 *           "price_min": 12,
                 *           "price_max": 12,
                 *           "currency": "GBP",
                 *           "image": "https://cdn.agilis.dating/92/events/5f0c…/event_orig.jpg",
                 *           "image_large": "https://cdn.agilis.dating/92/events/5f0c…/event_large.jpg",
                 *           "image_thumb": "https://cdn.agilis.dating/92/events/5f0c…/event_thumb.jpg",
                 *           "event_status": "Scheduled",
                 *           "attendees": "10-25",
                 *           "owner": {
                 *             "user_id": 41,
                 *             "name": "Tom Reid"
                 *           },
                 *           "environment": "LIVE",
                 *           "reschedule_count": 0,
                 *           "cloned_from_event_id": null,
                 *           "creation_datetime": "2027-09-20T10:00:00Z",
                 *           "last_edited_at": null
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "system",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "event.ended";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The Event, in the same shape as an item of GET /events. */
                        object: Record<string, never>;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    balanceToppedUpWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "balance.topped_up",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": null,
                 *         "amount_added": 110,
                 *         "of_which_promo_credit": 10,
                 *         "currency": "GBP",
                 *         "balance": 152.1
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "balance.topped_up";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        object: null;
                        /** @description Added to your balance, promotional credit included. */
                        amount_added?: number;
                        /** @description The part of amount_added that is promotional credit. */
                        of_which_promo_credit?: number;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                        /** @description Your organisation balance after the top-up. */
                        balance?: number;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    balanceLowWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "balance.low",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": null,
                 *         "balance": 42.1,
                 *         "alert_amount": 50,
                 *         "currency": "GBP"
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "balance.low";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        object: null;
                        /** @description Your organisation balance now. */
                        balance?: number;
                        /** @description The alert amount set in Settings. */
                        alert_amount?: number;
                        /** @description ISO 4217 code of the amounts, your billing currency. Example: GBP */
                        currency?: string;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    invoiceCreatedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "invoice.created",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": {
                 *           "invoice_number": "INV-2027-1047",
                 *           "invoice_date": "2027-07-10T08:00:12Z",
                 *           "for": "offer",
                 *           "offer_id": 45,
                 *           "event_id": null,
                 *           "amount": 12.5,
                 *           "currency": "GBP",
                 *           "ad_portal_url": "https://adportal.agilis.dating/invoice"
                 *         }
                 *       },
                 *       "request": {
                 *         "source": "api",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "invoice.created";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        /** @description The invoice. Download it from the Ad Portal's Invoices page. */
                        object: {
                            invoice_number?: string;
                            /** Format: date-time */
                            invoice_date?: string | null;
                            /** @enum {string} */
                            for?: "offer" | "event" | "top_up";
                            offer_id?: number | null;
                            event_id?: number | null;
                            /** @description Excluding VAT. */
                            amount?: number | null;
                            currency?: string | null;
                            /** Format: uri */
                            ad_portal_url?: string;
                        };
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    termsVersionIssuedWebhook: {
        parameters: {
            query?: never;
            header: {
                /**
                 * @description `t=<Unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>" with your endpoint secret>`. While a rolled secret is still valid there is one `v1` per secret: accept the message if any matches. Reject a `t` more than 5 minutes from now.
                 * @example t=1795075200,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd
                 */
                "Agilis-Signature": string;
                /**
                 * @description The webhook event id, the same as `id` in the body.
                 * @example whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R
                 */
                "Agilis-Webhook-Id": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                /**
                 * @example {
                 *       "id": "whevt_01JD0S6Q4M8K1Z0X7C2V9B3N5R",
                 *       "object": "webhook_event",
                 *       "type": "terms.version_issued",
                 *       "created": 1795075200,
                 *       "livemode": true,
                 *       "version": 1,
                 *       "data": {
                 *         "object": null,
                 *         "version": "2027-01",
                 *         "issued_at": "2027-01-04T09:00:00Z",
                 *         "url": "https://www.agilis.dating/business/terms",
                 *         "accept_url": "https://adportal.agilis.dating/terms",
                 *         "acceptance_needed_to_create": true
                 *       },
                 *       "request": {
                 *         "source": "agilis",
                 *         "idempotency_key": null
                 *       }
                 *     }
                 */
                "application/json": {
                    /** @description Unique id of this webhook event (whevt_…). The same on every retry and resend: use it to ignore duplicates. */
                    id: string;
                    /** @constant */
                    object: "webhook_event";
                    /** @constant */
                    type: "terms.version_issued";
                    /** @description When the change happened, in Unix seconds. Events can arrive out of order: use this to order them. */
                    created: number;
                    /** @description true for a LIVE endpoint, false for TEST. */
                    livemode: boolean;
                    /**
                     * @description Payload version.
                     * @constant
                     */
                    version: 1;
                    /** @description Present and true only on a message sent with Send test event. */
                    test?: boolean;
                    data: {
                        object: null;
                        /** @description The version label. */
                        version?: string;
                        /**
                         * Format: date-time
                         * @description When it was issued (UTC).
                         */
                        issued_at?: string;
                        /**
                         * Format: uri
                         * @description Where to read them.
                         */
                        url?: string;
                        /**
                         * Format: uri
                         * @description Where an Org Admin accepts them.
                         */
                        accept_url?: string;
                        /** @description Always true: creating Offers and Events waits for acceptance. */
                        acceptance_needed_to_create?: boolean;
                    };
                    request: {
                        /**
                         * @description What caused the change: your API key, the MCP server, the Ad Portal, Agilis, or the system (a scheduled start or end).
                         * @enum {string}
                         */
                        source?: "api" | "mcp" | "ad_portal" | "agilis" | "system";
                        /** @description The Idempotency-Key of the request that caused it, if any. */
                        idempotency_key?: string | null;
                    };
                };
            };
        };
        responses: {
            /** @description Any 2xx status within 10 seconds means received. The response body is ignored. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Anything else, a redirect or no answer within 10 seconds is a failed attempt, retried later. */
            default: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
}
