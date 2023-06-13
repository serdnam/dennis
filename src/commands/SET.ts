import { OK } from "../utils/responses.ts";
import { Command } from "./command.interface.ts";

class SETCommand implements Command {
  docs = {
    summary: "Set the string value of a key",
    since: "1.0.0",
    group: "string",
    complexity: "O(1)",
    arguments: [{
      name: "key",
      type: "key",
      key_spec_index: 0,
    }, {
      name: "value",
      type: "string",
    }],
  } as const;

  async execute(args: Uint8Array[], db: any) {
    const key = args[0];
    const value = args[1];
    await db.set([key], value);
    return OK;
  }
}

const SET = new SETCommand();

export { SET };
