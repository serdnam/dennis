import { decode } from "./decode.ts";

export function decodeUint8ArrayArray(arr: Uint8Array[]): string[] {
  return arr.map((uintarr) => decode(uintarr));
}
