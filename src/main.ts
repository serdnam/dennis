import { handle } from "./handle.ts";

const db = await (Deno as any).openKv();

for await (const conn of Deno.listen({ port: 6379 })) {
  handle(conn.readable, conn.writable, db);
}
