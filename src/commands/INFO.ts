import { encode } from "../utils/encode.ts";
import { Command } from "./command.interface.ts";

class INFOCommand implements Command {
  name = "info";

  docs = {
    summary: "Get information and statistics about the server",
    since: "1.0.0",
    group: "string",
    complexity: "O(1)",
    arguments: [{
      name: "section",
      type: "string",
      flags: [
        "optional",
        "multiple"
      ]
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    const { deno, typescript, v8 } = Deno.version
    return encode(`# Server\r\ndeno_version:${deno}\r\ntypescript_version:${typescript}\r\nv8_version:${v8}\r\n`)
  }
}

const INFO = new INFOCommand();

export { INFO };
