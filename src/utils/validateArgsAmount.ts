import { CommandError } from "../commands/command.interface.ts";
import { Either } from "./typeutils.ts";

export function validateArgsAmount(
  n: number,
  commandName: string,
  arr: unknown[],
): Either<CommandError, "OK"> {
  if (arr.length < n) {
    return {
      error: {
        type: "error",
        message: `ERR wrong number of arguments for ${commandName} command`,
      },
    };
  }
  return { result: "OK" };
}

export function validateEvenArgs(
    commandName: string,
    arr: unknown[],
  ): Either<CommandError, "OK"> {
    if (arr.length % 2 !== 0) {
      return {
        error: {
          type: "error",
          message: `ERR wrong number of arguments for ${commandName} command`,
        },
      };
    }
    return { result: "OK" };
  }