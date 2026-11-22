import { readFile } from 'node:fs/promises';
import { basename, extname } from 'node:path';

/** The bytes of a file: a Blob, a byte array, or a stream (web or Node.js). */
export type FileData =
  | Blob
  | Uint8Array
  | ArrayBuffer
  | ReadableStream<Uint8Array>
  | NodeJS.ReadableStream
  | AsyncIterable<Uint8Array | string>;

/** A file given as bytes or a stream, with its name. */
export interface FileInput {
  data: FileData;
  /** The file name. Its extension sets the content type unless `contentType` is given. */
  filename: string;
  contentType?: string;
}

/**
 * An image to upload: a file path, a `File`, or `{ data, filename }` where `data` is a
 * Blob, a byte array or a stream.
 */
export type Uploadable = string | File | FileInput;

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.heic': 'image/heic',
  '.heif': 'image/heif',
};

/** The content type for a file name, from its extension. */
export function contentTypeFor(filename: string): string {
  return CONTENT_TYPES[extname(filename).toLowerCase()] ?? 'application/octet-stream';
}

export interface ResolvedFile {
  blob: Blob;
  filename: string;
}

async function collect(stream: AsyncIterable<Uint8Array | string>): Promise<Uint8Array> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of stream) {
    chunks.push(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

function isAsyncIterable(value: unknown): value is AsyncIterable<Uint8Array | string> {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof (value as Record<symbol, unknown>)[Symbol.asyncIterator] === 'function'
  );
}

function toBlobPart(bytes: Uint8Array | ArrayBuffer): BlobPart {
  return bytes instanceof Uint8Array ? new Uint8Array(bytes) : bytes;
}

/** Reads an upload into memory once, so that a retried request can send it again. */
export async function resolveUpload(input: Uploadable): Promise<ResolvedFile> {
  if (typeof input === 'string') {
    const filename = basename(input);
    const bytes = await readFile(input);
    return { blob: new Blob([toBlobPart(bytes)], { type: contentTypeFor(filename) }), filename };
  }
  if (typeof File !== 'undefined' && input instanceof File) {
    const type = input.type || contentTypeFor(input.name);
    return { blob: new Blob([input], { type }), filename: input.name };
  }
  const { data, filename } = input as FileInput;
  if (!filename) throw new TypeError('An uploaded file needs a filename.');
  const type = (input as FileInput).contentType ?? contentTypeFor(filename);

  if (data instanceof Blob) return { blob: new Blob([data], { type }), filename };
  if (data instanceof Uint8Array || data instanceof ArrayBuffer) {
    return { blob: new Blob([toBlobPart(data)], { type }), filename };
  }
  if (isAsyncIterable(data)) {
    return { blob: new Blob([toBlobPart(await collect(data))], { type }), filename };
  }
  throw new TypeError('Unsupported file data: use a path, a Blob, a byte array or a stream.');
}
