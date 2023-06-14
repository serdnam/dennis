import { CommandError } from "../commands/command.interface.ts";
import { decode } from "./decode.ts";

function isObject(
  maybeObject: unknown,
): maybeObject is Record<PropertyKey, unknown> {
  return typeof maybeObject === "object" && maybeObject !== null;
}

export function isError(resp: unknown): resp is CommandError {
  return isObject(resp) && resp.type === "error";
}

export function getInteger(value: unknown): Either<CommandError, number> {
  if (value === null) {
    return { result: 0 };
  }
  if (value instanceof Uint8Array) {
    const num = parseInt(decode(value), 10);
    if (!isNaN(num)) {
      return { result: num };
    }
  }
  if (typeof value === "string") {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      return { result: num };
    }
  }
  return {
    error: {
      type: "error",
      message: "ERR value is not an integer or out of range",
    },
  };
}

type Left<T> = {
  error: T;
  result?: never;
};

type Right<U> = {
  error?: never;
  result: U;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;
