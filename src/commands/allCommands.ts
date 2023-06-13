import { COMMAND } from "./COMMAND.ts";
import { GET } from "./GET.ts";
import { SET } from "./SET.ts";
import { Command } from "./command.interface.ts";

export const commands = new Map<string, Command>([
  ["command", COMMAND],
  ["get", GET],
  ["set", SET],
]);
