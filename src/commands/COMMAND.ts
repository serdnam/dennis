// deno-lint-ignore-file ban-unused-ignore
import { decode } from "../utils/decode.ts";
import { decodeUint8ArrayArray } from "../utils/decodeUint8ArrayArray.ts";
import { encode } from "../utils/encode.ts";
import { getAllCommands } from "../utils/getAllCommands.ts";

import { ArgumentDoc, Command, CommandDoc } from "./command.interface.ts";

function mapArguments(args: ReadonlyArray<Readonly<ArgumentDoc>>): any {
  return args.map((arg) => {
    return [
      encode("name"),
      encode(arg.name),
      encode("type"),
      encode(arg.type),
      ...(arg.key_spec_index !== undefined
        ? [encode("key_spec_index"), arg.key_spec_index]
        : []),
      ...(arg.flags ? [encode("flags"), arg.flags] : []),
      ...(arg.arguments
        ? [
          encode("arguments"),
          mapArguments(arg.arguments),
        ]
        : []),
    ];
  });
}

function mapSubcommands(subcommands: NonNullable<CommandDoc["subcommands"]>) {
  return subcommands.flatMap(([name, subc]) => {
    return [encode(name), [
      encode("summary"),
      encode(subc.summary),
      encode("since"),
      encode(subc.since),
      encode("group"),
      encode(subc.group),
      encode("complexity"),
      encode(subc.complexity),
      encode("arguments"),
      mapArguments(subc.arguments),
    ]];
  });
}
class COMMANDClass implements Command {
  name = "command";

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
  async execute(args: Uint8Array[], _db: Deno.Kv): Promise<any> {
    const subcommand = decode(args[0]);
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
          return [encode(name), [
            encode("summary"),
            encode(doc.summary),
            encode("since"),
            encode(doc.since),
            encode("group"),
            encode(doc.group),
            encode("complexity"),
            encode(doc.complexity),
            ...(doc.arguments
              ? [
                encode("arguments"),
                mapArguments(doc.arguments),
              ]
              : []),
            ...(doc.subcommands
              ? [
                encode("subcommands"),
                mapSubcommands(doc.subcommands),
              ]
              : []),
          ]];
        });
      } default: {
        return {
          type: 'error',
          message: `ERR unknown subcommand '${subcommand}'. Try COMMAND HELP.`
        }
      }
    }
  }
}

const COMMAND = new COMMANDClass();

export { COMMAND };
