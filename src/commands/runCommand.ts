import { commands } from "./allCommands.ts";

const textDecoder = new TextDecoder();

export async function runCommand(args: Uint8Array[], db: any) {
  const commandName = textDecoder.decode(args[0]).toLowerCase();
  const command = commands.get(commandName);
  if (!command) {
    throw new Error(`Unknown command: ${commandName}`);
  }
  const result = await command.execute(args.slice(1), db);
  return result;
}
