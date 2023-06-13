const textEncoder = new TextEncoder();

export function encode(input: string | undefined) {
  return textEncoder.encode(input);
}
