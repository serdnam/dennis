import { commands } from "./allCommands.ts";
import { Command } from "./command.interface.ts";

class COMMANDClass implements Command {
  docs: any[] = [
    "command",
    [
      "summary",
      "Get array of Redis command details",
      "since",
      "2.8.13",
      "group",
      "server",
      "complexity",
      "O(N) where N is the total number of Redis commands",
      "subcommands",
      [
        "commands|docs",
        [
          "summary",
          "Get array of specific Redis command documentation",
          "since",
          "7.0.0",
          "group",
          "server",
          "complexity",
          "O(N) where N is the number of commands to look up",
          "arguments",
          [
            "name",
            "command-name",
            "type",
            "string",
            "flags",
            [
              "optional",
              "multiple",
            ],
          ],
        ],
      ],
    ],
  ];

  // deno-lint-ignore require-await
  async execute(args: string[], db: any) {
    switch (args[0]) {
      case "DOCS": {
        const commandList = args.slice(1);
        if (commandList.length > 0) {
          // todo
          return;
        }
        return this.docs;
      }
    }
  }
}

const COMMAND = new COMMANDClass();

export { COMMAND };
