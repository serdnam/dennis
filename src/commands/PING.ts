import { encode } from "../utils/encode.ts";
import { Command } from "./command.interface.ts";

const PONG = 'PONG'

class PINGCommand implements Command {
  name = "ping";

  docs = {
    summary: "Ping the server",
    since: "1.0.0",
    group: "connection",
    complexity: "O(1)",
    arguments: [{
      name: "message",
      type: "string",
      flags: [
        "optional"
      ]
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    if (args[0]) {
        return args[0]
    }
    return PONG
  }
}

const PING = new PINGCommand();

export { PING };
