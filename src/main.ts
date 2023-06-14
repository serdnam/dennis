/// <reference lib="deno.unstable" />
import { handle } from "./handle.ts";

const db = await Deno.openKv();

console.log('STARTED')

for await (const conn of Deno.listen({ port: 6379 })) {
  console.log('connection')
  handle(conn.readable, conn.writable, db);
}
