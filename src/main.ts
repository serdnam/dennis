import { handle } from "./handle.ts";

for await (const conn of Deno.listen({ port: 6379 })) {
  handle(conn)
}