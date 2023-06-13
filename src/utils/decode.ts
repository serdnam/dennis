const textDecoder = new TextDecoder();

export function decode(input: Parameters<TextDecoder["decode"]>[0]) {
  return textDecoder.decode(input);
}
