import { decodeUint8ArrayArray } from "../utils/decodeUint8ArrayArray.ts";
import { getAllCommands } from "../utils/getAllCommands.ts";

import { Command, CommandDoc } from "./command.interface.ts";

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

function mapSubcommands(subcommands: CommandDoc["subcommands"]) {
  return subcommands?.flatMap(([name, subc]) => {
    return [textEncoder.encode(name), [
      textEncoder.encode("summary"),
      textEncoder.encode(subc.summary),
      textEncoder.encode("since"),
      textEncoder.encode(subc.since),
      textEncoder.encode("group"),
      textEncoder.encode(subc.group),
      textEncoder.encode("complexity"),
      textEncoder.encode(subc.complexity),
      textEncoder.encode("arguments"),
      subc.arguments.map((arg) => {
        return [
          textEncoder.encode("name"),
          textEncoder.encode(arg.name),
          textEncoder.encode("type"),
          textEncoder.encode(arg.type),
          ...(arg.flags ? [textEncoder.encode("flags"), arg.flags] : []),
        ];
      }),
    ]];
  });
}
class COMMANDClass implements Command {
  docs = {
    summary: "Get array of Redis command details",
    since: "2.8.13",
    group: "server",
    history: [],
    complexity: "O(N) where N is the total number of Redis commands",
    subcommands: [
      ["command|docs", {
        summary: "Get array of specific Redis command documentation",
        since: "7.0.0",
        group: "server",
        complexity: "O(N) where N is the number of commands to look up",
        arguments: [{
          name: "command-name",
          type: "string",
          flags: [
            "optional",
            "multiple",
          ],
        }],
      }],
    ],
  } as const;

  // deno-lint-ignore require-await
  async execute(args: Uint8Array[], db: any) {
    const subcommand = textDecoder.decode(args[0]);
    switch (subcommand) {
      case "DOCS": {
        const commandList = decodeUint8ArrayArray(args.slice(1)).map((c) =>
          c.toLowerCase()
        );
        const filter = commandList.length > 0;
        const commandDocs = [];
        for (const [k, v] of getAllCommands().entries()) {
          if (filter && !commandList.includes(k)) continue;
          commandDocs.push([k, v] as const);
        }

        return commandDocs.flatMap(([name, command]) => {
          const doc = command.docs;
          return [textEncoder.encode(name), [
            textEncoder.encode("summary"),
            textEncoder.encode(doc.summary),
            textEncoder.encode("since"),
            textEncoder.encode(doc.since),
            textEncoder.encode("group"),
            textEncoder.encode(doc.group),
            textEncoder.encode("complexity"),
            textEncoder.encode(doc.complexity),
            ...(doc.subcommands
              ? [
                textEncoder.encode("subcommands"),
                mapSubcommands(doc.subcommands),
              ]
              : []),
          ]];
        });
      }
    }
  }
}

const COMMAND = new COMMANDClass();

export { COMMAND };
