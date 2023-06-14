import { validateArgsAmount } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class GETCommand implements Command {
  name = "get";

  docs = {
    summary: "Get the value of a key",
    since: "1.0.0",
    group: "string",
    complexity: "O(1)",
    arguments: [{
      name: "key",
      type: "key",
      key_spec_index: 0,
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    const validate = validateArgsAmount(1, this.name, args);
    if (validate.error) {
      return validate.error;
    }
    const key = args[0];
    const result = (await db.get([key])).value 
    if (result === undefined) return null

    return result as Uint8Array;
  }
}

const GET = new GETCommand();

export { GET };
