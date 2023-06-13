import { Command } from "./command.interface.ts";

class GETCommand implements Command {
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

  async execute(args: Uint8Array[], db: any) {
    const key = args[0];
    return (await db.get([key])).value;
  }
}

const GET = new GETCommand();

export { GET };
