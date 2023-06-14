import { encode } from "../utils/encode.ts";
import { getInteger } from "../utils/typeutils.ts";
import { validateArgsAmount } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class DECRBYCommand implements Command {
  name = "decrby";

  docs = {
    summary: "Decrement the integer value of a key by the given number",
    since: "1.0.0",
    group: "string",
    complexity: "O(1)",
    arguments: [{
      name: "key",
      type: "key",
      key_spec_index: 0,
    }, {
      name: "decrement",
      type: "integer"
    }],
  } as const;

  async execute(args: Uint8Array[], db: Deno.Kv) {
    const validate = validateArgsAmount(2, this.name, args);
    if (validate.error) {
      return validate.error;
    }
    const key = args[0];
    const subtrahendInput = args[1];
    const subtrahendValidate = getInteger(subtrahendInput);
    if (subtrahendValidate.error) {
      return subtrahendValidate.error;
    }
    const subtrahend = subtrahendValidate.result;
    while (true) {
      const keyRes = await db.get([key]);
      const value = keyRes.value;
      const valueResult = getInteger(value);
      if (valueResult.result !== undefined) {
        const decr = valueResult.result - subtrahend;
        const res = await db.atomic()
          .check(keyRes)
          .set([key], encode(`${decr}`))
          .commit()
        if (!res.ok) {
          continue
        }
        return decr;
      } else {
        return valueResult.error;
      }
    }
    
  }
}

const DECRBY = new DECRBYCommand();

export { DECRBY };
