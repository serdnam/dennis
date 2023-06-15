import { OK } from "../utils/responses.ts";
import { validateArgsAmount, validateEvenArgs } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class MSETCommand implements Command {
  name = "mset";

  docs = {
    summary: "Set multiple keys to multiple values",
    since: "1.0.1",
    group: "string",
    complexity: "O(N) where N is the number of keys to set.",
    arguments: [{
      name: "key_value",
      type: "block",
      flags: ["multiple"],
      arguments: [{
        name: "key",
        type: "key",
        key_spec_index: 0,
      }, {
        name: "value",
        type: "string",
      }]
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    const validateAmount = validateArgsAmount(2, this.name, args);
    const validateEven = validateEvenArgs(this.name, args)
    if (validateAmount.error) {
      return validateAmount.error
    } 
    if (validateEven.error) {
        return validateEven.error
    }
    for (let i = 0; i < args.length; i += 2) {
        const key = args[i];
        const value = args[i + 1];
        await db.set([key], value);
    }
    return OK;
  }
}

const MSET = new MSETCommand();

export { MSET };
