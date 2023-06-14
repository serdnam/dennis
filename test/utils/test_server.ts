/// <reference lib="deno.unstable" />
import { handle } from "../../src/handle.ts";
import { getAvailablePortSync } from "x/port/mod.ts";

export function testServer(kv: Deno.Kv): [number, () => void] {
  const port = getAvailablePortSync();
  if (!port) {
    throw new Error("No available port");
  }
  const listener = Deno.listen({ hostname: "127.0.0.1", port: port });
  (async function () {
    for await (const conn of listener) {
      handle(conn.readable, conn.writable, kv);
    }
  })();
  return [port, () => listener.close()];
}
