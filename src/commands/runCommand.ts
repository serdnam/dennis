import { decode } from "../utils/decode.ts";
import { decodeUint8ArrayArray } from "../utils/decodeUint8ArrayArray.ts";
import { commands } from "./allCommands.ts";

export async function runCommand(args: Uint8Array[], db: Deno.Kv) {
  const commandName = decode(args[0]).toLowerCase();
  console.log(commandName)
  const command = commands.get(commandName);
  if (!command) {
    return {
      type: 'error',
      message: `ERR unknown command '${commandName}', with args beginning with: ${decodeUint8ArrayArray(args.slice(1)).map(arg => `'${arg}'`).join(' ')}`
    }
  }
  const result = await command.execute(args.slice(1), db);
  return result;
}
