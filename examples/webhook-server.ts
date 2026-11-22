// A minimal webhook receiver. Run with:
//   AGILIS_WEBHOOK_SECRET=whsec_... npx tsx examples/webhook-server.ts
import { createServer } from 'node:http';
import { SignatureVerificationError, webhooks } from '@agilisdating/ads';

const secret = process.env.AGILIS_WEBHOOK_SECRET ?? '';

createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/agilis/webhooks') {
    res.writeHead(404).end();
    return;
  }
  const chunks: Buffer[] = [];
  req.on('data', (chunk: Buffer) => chunks.push(chunk));
  req.on('end', () => {
    try {
      // Verify the raw body, before parsing it.
      const event = webhooks.constructEvent(
        Buffer.concat(chunks),
        req.headers['agilis-signature'],
        secret,
      );

      // Answer quickly, then do the work.
      res.writeHead(200).end();

      switch (event.type) {
        case 'offer.started':
          console.log(`Offer ${event.data.object.offer_id} started`);
          break;
        case 'event.published':
          console.log(`Event ${event.data.object.event_id} published`);
          break;
        case 'balance.low':
          console.log(`Balance low: ${event.data.balance} ${event.data.currency}`);
          break;
        default:
          console.log(`Received ${event.type}`);
      }
    } catch (error) {
      if (error instanceof SignatureVerificationError) {
        res.writeHead(400).end();
        return;
      }
      res.writeHead(500).end();
    }
  });
}).listen(3000, () => console.log('Listening on http://localhost:3000/agilis/webhooks'));
