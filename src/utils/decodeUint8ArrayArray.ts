const textDecoder = new TextDecoder();

export function decodeUint8ArrayArray(arr: Uint8Array[]): string[] {
  return arr.map((uintarr) => textDecoder.decode(uintarr));
}
