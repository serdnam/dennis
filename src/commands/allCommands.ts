import { COMMAND } from "./COMMAND.ts";
import { Command } from "./command.interface.ts";

export const commands = new Map<string, Command>([
  ["command", COMMAND],
]);
