import { encode } from "../utils/encode.ts";
import { getInteger } from "../utils/typeutils.ts";
import { validateArgsAmount } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class INCRCommand implements Command {
  name = "incr";

  docs = {
    summary: "Increment the integer value of a key by a given amount",
    since: "1.0.0",
    group: "string",
    complexity: "O(1)",
    arguments: [{
      name: "key",
      type: "key",
      key_spec_index: 0,
    }, {
      name: "increment",
      type: "integer",
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    const validate = validateArgsAmount(1, this.name, args);
    if (validate.error) {
      return validate.error;
    }
    const key = args[0];
    const res = await db.get([key]);
    const value = res.value;
    const result = getInteger(value);
    if (result.result !== undefined) {
      const incr = result.result + 1;
      await db.set([key], encode(`${incr}`));
      return incr;
    } else {
      return result.error;
    }
  }
}

const INCR = new INCRCommand();

export { INCR };
