import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function pngSize(name: string): { width: number; height: number } {
  const bytes = readFileSync(new URL(`./fixtures/${name}`, import.meta.url));
  expect(bytes.subarray(1, 4).toString('latin1')).toBe('PNG');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}

describe('integration test images', () => {
  it('the Event image is at least 1280 x 720', () => {
    const { width, height } = pngSize('sample-event.png');
    expect(width).toBeGreaterThanOrEqual(1280);
    expect(height).toBeGreaterThanOrEqual(720);
  });

  it('the Offer image is the recommended 1080 x 1080', () => {
    expect(pngSize('sample-offer.png')).toEqual({ width: 1080, height: 1080 });
  });
});
