const textEncoder = new TextEncoder();

const ARRAY = textEncoder.encode("*");
const SIMPLESTRING = textEncoder.encode("+");
const BULKSTRING = textEncoder.encode("$");
const INTEGER = textEncoder.encode(":");
const NEWLINE = textEncoder.encode("\r\n");
const NULL = textEncoder.encode("$-1\r\n");

export function respond(resp: any, conn: Deno.Conn) {
  if (Array.isArray(resp)) {
    sendArray(resp, conn);
  }
  if (resp === null) {
    sendNull(conn);
  }
  if (typeof resp === "string") {
    sendString(resp, conn);
  }
  if (resp instanceof Uint8Array) {
    sendBulkString(resp, conn);
  }
}

function sendArray(resp: Array<any>, conn: Deno.Conn) {
  conn.write(ARRAY);
  conn.write(textEncoder.encode(String(resp.length)));
  conn.write(NEWLINE);
  resp.forEach((v) => {
    if (Array.isArray(v)) {
      sendArray(v, conn);
    } else if (typeof v === "string") {
      sendString(v, conn);
    } else if (v instanceof Uint8Array) {
      sendBulkString(v, conn);
    } else if (typeof v === "number") {
      sendInteger(v, conn);
    }
  });
}

function sendString(resp: string, conn: Deno.Conn) {
  conn.write(SIMPLESTRING);
  conn.write(textEncoder.encode(resp));
  conn.write(NEWLINE);
}

function sendBulkString(resp: Uint8Array, conn: Deno.Conn) {
  conn.write(BULKSTRING);
  conn.write(textEncoder.encode(String(resp.length)));
  conn.write(NEWLINE);
  conn.write(resp);
  conn.write(NEWLINE);
}

function sendInteger(resp: number, conn: Deno.Conn) {
  conn.write(INTEGER);
  conn.write(textEncoder.encode(String(resp)));
  conn.write(NEWLINE);
}

function sendNull(conn: Deno.Conn) {
  conn.write(NULL);
}
