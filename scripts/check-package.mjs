// Checks the built package loads from both ESM and CommonJS with the same public API.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const esm = await import('@agilisdating/ads');
const cjs = require('@agilisdating/ads');

for (const [name, mod] of [
  ['ESM', esm],
  ['CJS', cjs],
]) {
  assert.equal(typeof mod.Agilis, 'function', `${name}: Agilis`);
  assert.equal(typeof mod.webhooks.constructEvent, 'function', `${name}: webhooks`);
  assert.equal(typeof mod.AgilisError, 'function', `${name}: AgilisError`);
  const client = new mod.Agilis({ apiKey: 'pk_test_check' });
  assert.equal(client.mode, 'test', `${name}: mode`);
  assert.equal(typeof client.offers.listAutoPaging, 'function', `${name}: offers`);
}
assert.deepEqual(Object.keys(esm).sort(), Object.keys(cjs).sort(), 'ESM and CJS exports match');
console.log(`Package OK: ${Object.keys(esm).length} exports from ESM and CJS.`);
