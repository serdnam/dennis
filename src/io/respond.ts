import { encode } from "../utils/encode.ts";

const ARRAY = encode("*");
const SIMPLESTRING = encode("+");
const BULKSTRING = encode("$");
const INTEGER = encode(":");
const NEWLINE = encode("\r\n");
const NULL = encode("$-1\r\n");

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
  conn.write(encode(String(resp.length)));
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
  conn.write(encode(resp));
  conn.write(NEWLINE);
}

function sendBulkString(resp: Uint8Array, conn: Deno.Conn) {
  conn.write(BULKSTRING);
  conn.write(encode(String(resp.length)));
  conn.write(NEWLINE);
  conn.write(resp);
  conn.write(NEWLINE);
}

function sendInteger(resp: number, conn: Deno.Conn) {
  conn.write(INTEGER);
  conn.write(encode(String(resp)));
  conn.write(NEWLINE);
}

function sendNull(conn: Deno.Conn) {
  conn.write(NULL);
}
