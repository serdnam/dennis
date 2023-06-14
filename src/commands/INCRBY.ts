import { encode } from "../utils/encode.ts";
import { getInteger } from "../utils/typeutils.ts";
import { validateArgsAmount } from "../utils/validateArgsAmount.ts";
import { Command } from "./command.interface.ts";

class INCRBYCommand implements Command {
  name = "incrby";

  docs = {
    summary: "Increment the integer value of a key by one",
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
    const validate = validateArgsAmount(2, this.name, args);
    if (validate.error) {
      return validate.error;
    }
    const key = args[0];
    const summandInput = args[1];
    const summandValidate = getInteger(summandInput);
    if (summandValidate.error) {
      return summandValidate.error;
    }
    const summand = summandValidate.result;
    const res = await db.get([key]);
    const value = res.value;
    const valueResult = getInteger(value);
    if (valueResult.result !== undefined) {
      const incr = valueResult.result + summand;
      await db.set([key], encode(`${incr}`));
      return incr;
    } else {
      return valueResult.error;
    }
  }
}

const INCRBY = new INCRBYCommand();

export { INCRBY };
