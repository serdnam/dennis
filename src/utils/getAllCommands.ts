import { commands } from "../commands/allCommands.ts";
import { Command } from "../commands/command.interface.ts";

export function getAllCommands(): Map<string, Command> {
  return commands;
}
