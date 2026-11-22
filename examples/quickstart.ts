// A short tour in Test mode. Run with:
//   AGILIS_API_KEY=pk_test_... npx tsx examples/quickstart.ts
import { fileURLToPath } from 'node:url';
import { Agilis, AgilisError } from '@agilisdating/ads';

const client = new Agilis(); // reads AGILIS_API_KEY

if (client.mode !== 'test') {
  throw new Error('This example only runs with a Test key (pk_test_...).');
}

const { categories = [] } = await client.categories.list();
console.log(`${categories.length} Offer categories`);

const estimate = await client.offers.estimatePrice({
  start_datetime: '2027-07-10T08:00:00Z',
  end_datetime: '2027-07-12T20:30:00Z',
  location: [51.5074, -0.1278],
  radius: 10,
});
console.log(`Estimated price: ${estimate.estimated_cost} ${estimate.currency}`);

// Check an Offer without creating it.
try {
  const check = await client.offers.create(
    {
      category_id: categories[0]?.category_id ?? 1,
      title: '20% off summer sale',
      description: 'Discount valid through July',
      push_notification_title: '20% off this summer',
      push_notification_message: 'Show this at the till for 20% off everything until July.',
      url: 'https://example.com/offer',
      image: fileURLToPath(new URL('./sample-offer.png', import.meta.url)),
      location: [51.5074, -0.1278],
      radius: 10,
      start_datetime: '2027-07-10T08:00:00Z',
      expiry_datetime: '2027-07-12T20:30:00Z',
      payment_method: 'B',
    },
    { dryRun: true },
  );
  console.log('Dry run:', check.return_code);
} catch (error) {
  if (error instanceof AgilisError) {
    console.log(`Refused: ${error.returnCode} ${error.message}`);
  } else {
    throw error;
  }
}

// Every Offer, page by page.
for await (const offer of client.offers.listAutoPaging({ limit: 50 })) {
  console.log(offer.offer_id, offer.title, offer.offer_status);
}
