import { deflateSync } from "node:zlib";
import { crc32 } from "node:zlib";

/** Unmistakably synthetic geometric PNG — never user-like photography. */
export function makeSolidPng(r: number, g: number, b: number, width = 32, height = 32): Uint8Array {
  const raw = Buffer.alloc((width * 4 + 1) * height);
  for (let y = 0; y < height; y++) {
    const row = y * (width * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < width; x++) {
      const i = row + 1 + x * 4;
      const onDiag = x === y || x + y === width - 1;
      raw[i] = onDiag ? 255 : r;
      raw[i + 1] = onDiag ? 255 : g;
      raw[i + 2] = onDiag ? 255 : b;
      raw[i + 3] = 255;
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const idat = deflateSync(raw);
  const chunks = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", idat),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  return new Uint8Array(chunks);
}

function pngChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, "ascii");
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])) >>> 0, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

export const TEST_ONLY_DOCUMENT = `TEST_ONLY ZX9-QUOKKA-BATCH
This document is invented nonsense for construction-stage verification.
It is not a resume, letter, receipt, or business record.
SENTINEL: purple-lantern-77
Classification should remain uncertain rather than invent a user purpose.
`;

export const TEST_ONLY_WORDS =
  "TEST_ONLY processing aloud: I am thinking about whether the quokka lantern belongs in review. This is not a job and not a commitment.";
