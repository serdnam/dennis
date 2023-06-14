import { COMMAND } from "./COMMAND.ts";
import { GET } from "./GET.ts";
import { INCR } from "./INCR.ts";
import { INCRBY } from "./INCRBY.ts";
import { SET } from "./SET.ts";
import { Command } from "./command.interface.ts";

export const commands = new Map<string, Command>([
  [COMMAND.name, COMMAND],
  [GET.name, GET],
  [SET.name, SET],
  [INCR.name, INCR],
  [INCRBY.name, INCRBY],
]);
