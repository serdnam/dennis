import { encode } from "../utils/encode.ts";
import { getInteger } from "../utils/typeutils.ts";
import { validateArgsAmount } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class DECRCommand implements Command {
  name = "decr";

  docs = {
    summary: "Decrement the integer value of a key by one",
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
    while (true) {
      const keyRes = await db.get([key]);
      const value = keyRes.value;
      const result = getInteger(value);
      if (result.result !== undefined) {
        const decr = result.result - 1;
        const res = await db.atomic()
          .check(keyRes)
          .set([key], encode(`${decr}`))
          .commit()
        if (!res.ok) {
          continue
        }
        return decr;
      } else {
        return result.error;
      }
    }
    
  }
}

const DECR = new DECRCommand();

export { DECR };
