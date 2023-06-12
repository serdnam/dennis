import { DelimiterStream, _ } from "./deps.ts";

const NEWLINE = new Uint8Array([13, 10])

const textdecoder = new TextDecoder()

export async function handle(conn: Deno.Conn) {
    let status = 'parsing'
    let length = 0; 
    for await (const chunk of conn.readable.pipeThrough(new DelimiterStream(NEWLINE))) {
        console.log(textdecoder.decode(chunk), chunk.length)
    }
    conn.close()
}