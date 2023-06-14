/// <reference lib="deno.unstable" />
import { handle } from "../../src/handle.ts";
import { getAvailablePort } from "x/port/mod.ts";

export async function testServer(kv: Deno.Kv): Promise<[number, () => void]> {
  const port = await getAvailablePort();
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
