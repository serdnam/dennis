const textEncoder = new TextEncoder();

export async function respond(resp: any, conn: Deno.Conn) {
  if (Array.isArray(resp)) {
  }
}

function sendArray(resp: Array<any>, conn: Deno.Conn) {
}
