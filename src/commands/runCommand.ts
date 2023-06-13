import { decode } from "../utils/decode.ts";
import { commands } from "./allCommands.ts";

export async function runCommand(args: Uint8Array[], db: Deno.Kv) {
  const commandName = decode(args[0]).toLowerCase();
  const command = commands.get(commandName);
  if (!command) {
    throw new Error(`Unknown command: ${commandName}`);
  }
  const result = await command.execute(args.slice(1), db);
  return result;
}
