import { COMMAND } from "./COMMAND.ts";
import { DECR } from "./DECR.ts";
import { DECRBY } from "./DECRBY.ts";
import { GET } from "./GET.ts";
import { INCR } from "./INCR.ts";
import { INCRBY } from "./INCRBY.ts";
import { INFO } from "./INFO.ts";
import { MGET } from "./MGET.ts";
import { MSET } from "./MSET.ts";
import { PING } from "./PING.ts";
import { SET } from "./SET.ts";
import { Command } from "./command.interface.ts";

export const commands = new Map<string, Command>([
  [COMMAND.name, COMMAND],
  [GET.name, GET],
  [SET.name, SET],
  [INCR.name, INCR],
  [INCRBY.name, INCRBY],
  [DECR.name, DECR],
  [DECRBY.name, DECRBY],
  [INFO.name, INFO],
  [PING.name, PING],
  [MGET.name, MGET],
  [MSET.name, MSET]
]);
