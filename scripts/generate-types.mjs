// Generates src/generated/openapi.ts from openapi/openapi.json.
// Run with: npm run generate
import { readFile, writeFile } from 'node:fs/promises';
import openapiTS, { astToString } from 'openapi-typescript';

const root = new URL('..', import.meta.url);
const spec = JSON.parse(await readFile(new URL('openapi/openapi.json', root), 'utf8'));

// Placeholder property names (such as an ellipsis meaning "and the other fields")
// are not real fields, so they are left out of the generated types.
const validName = /^[A-Za-z_][A-Za-z0-9_]*(\[[A-Za-z0-9_]*\])?$/;
function clean(node) {
  if (Array.isArray(node)) {
    node.forEach(clean);
    return;
  }
  if (node && typeof node === 'object') {
    if (node.properties && typeof node.properties === 'object') {
      for (const key of Object.keys(node.properties)) {
        if (!validName.test(key)) delete node.properties[key];
      }
    }
    Object.values(node).forEach(clean);
  }
}
clean(spec);

const ast = await openapiTS(spec, { alphabetize: false, exportType: false });
const header =
  '// This file is generated from openapi/openapi.json by scripts/generate-types.mjs.\n' +
  '// Do not edit it by hand: run `npm run generate` instead.\n\n';
await writeFile(new URL('src/generated/openapi.ts', root), header + astToString(ast));
console.log('Wrote src/generated/openapi.ts');
