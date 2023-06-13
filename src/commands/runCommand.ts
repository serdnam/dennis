import { commands } from "./allCommands.ts";

export async function runCommand(args: string[], db: any) {
  const command = commands.get(args[0]);
  if (!command) {
    throw new Error(`Unknown command: ${args[0]}`);
  }
  const result = await command.execute(args.slice(1), db);
  return result;
}
