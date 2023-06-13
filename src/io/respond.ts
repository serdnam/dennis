import { encode } from "../utils/encode.ts";

const ARRAY = encode("*");
const SIMPLESTRING = encode("+");
const BULKSTRING = encode("$");
const INTEGER = encode(":");
const NEWLINE = encode("\r\n");
const NULL = encode("$-1\r\n");

function createWriter(
  writer: WritableStreamDefaultWriter<Uint8Array>,
): [Deno.Writer, () => Promise<void>] {
  return [{
    write: (chunk: Uint8Array) => {
      return writer.ready.then(() => writer.write(chunk)).then(() =>
        chunk.length
      );
    },
  }, async () =>{ await writer.ready; writer.releaseLock()}];
}

export async function respond(
  resp: any,
  writeable: WritableStream<Uint8Array>,
) {
  const [writer, done] = createWriter(writeable.getWriter());
  if (Array.isArray(resp)) {
    await sendArray(resp, writer);
  }
  if (resp === null) {
    await sendNull(writer);
  }
  if (typeof resp === "string") {
    await sendString(resp, writer);
  }
  if (resp instanceof Uint8Array) {
    await sendBulkString(resp, writer);
  }
  await done();
}

async function sendArray(resp: Array<any>, writer: Deno.Writer) {
  await writer.write(ARRAY);
  await writer.write(encode(String(resp.length)));
  await writer.write(NEWLINE);
  for (const v of resp) {
    if (Array.isArray(v)) {
      await sendArray(v, writer);
    } else if (typeof v === "string") {
      await sendString(v, writer);
    } else if (v instanceof Uint8Array) {
      await sendBulkString(v, writer);
    } else if (typeof v === "number") {
      await sendInteger(v, writer);
    }
  }
}

async function sendString(resp: string, writer: Deno.Writer) {
  await writer.write(SIMPLESTRING);
  await writer.write(encode(resp));
  await writer.write(NEWLINE);
}

async function sendBulkString(resp: Uint8Array, writer: Deno.Writer) {
  await writer.write(BULKSTRING);
  await writer.write(encode(String(resp.length)));
  await writer.write(NEWLINE);
  await writer.write(resp);
  await writer.write(NEWLINE);
}

async function sendInteger(resp: number, writer: Deno.Writer) {
  await writer.write(INTEGER);
  await writer.write(encode(String(resp)));
  await writer.write(NEWLINE);
}

async function sendNull(writer: Deno.Writer) {
  await writer.write(NULL);
}
