import { validateArgsAmount } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class MGETCommand implements Command {
  name = "mget";

  docs = {
    summary: "Get the values of all the given keys",
    since: "1.0.0",
    group: "string",
    complexity: "O(N) where N is the number of keys to retrieve.",
    arguments: [{
      name: "key",
      type: "key",
      key_spec_index: 0,
      flags: [
        "multiple"
      ]
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    const validate = validateArgsAmount(1, this.name, args);
    if (validate.error) {
      return validate.error;
    }
    const res: (Uint8Array | null)[] = []
    for (const arg of args) {
        const value = (await db.get([arg])).value
        res.push(value as Uint8Array | null)
    }
    return res;
  }
}

const MGET = new MGETCommand();

export { MGET };
