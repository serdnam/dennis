import { runCommand } from "./commands/runCommand.ts";
import { respond } from "./io/respond.ts";

const CARRIAGE_RETURN = 13; // '\r'
const ARRAY_INDICATOR = 42; // '*'
const BULK_STRING_INDICATOR = 36; // '$'
const ZERO = 48; // '0'

function concatUint8Arrays(array1: Uint8Array, array2: Uint8Array) {
  const result = new Uint8Array(array1.length + array2.length);
  result.set(array1, 0);
  result.set(array2, array1.length);
  return result;
}

export async function handle(conn: Deno.Conn, db: any) {
  let status = "waiting";
  let buffer: Uint8Array = new Uint8Array(0);

  let arrayLength = 0;
  let currentArrayIndex = 0;

  let bulkStringLength = 0;
  let currentBulkStringIndex = 0;

  let parts: Uint8Array[] = [];

  function parseArrayLength(chunk: Uint8Array) {
    let i = 0;
    while (chunk[i] !== CARRIAGE_RETURN && chunk[i] !== undefined) {
      arrayLength += (arrayLength * 10) + (chunk[i] - ZERO);
      i++;
    }
    if (chunk[i] === CARRIAGE_RETURN) {
      i += 2;
      buffer = chunk.slice(i);
      return true;
    }
    return false;
  }

  function parseBulkStringLength(chunk: Uint8Array) {
    let i = 0;
    while (chunk[i] !== CARRIAGE_RETURN && chunk[i] !== undefined) {
      bulkStringLength += (bulkStringLength * 10) + (chunk[i] - ZERO);
      i++;
    }
    if (chunk[i] === CARRIAGE_RETURN) {
      i += 2;
      buffer = chunk.slice(i);
      return true;
    }
    return false;
  }

  for await (
    const chunk of conn.readable
  ) {
    buffer = concatUint8Arrays(buffer, chunk);

    let keepParsing = true;
    let reply = false;
    while (keepParsing || reply) {
      keepParsing = false;
      switch (status) {
        case "waiting": {
          if (buffer[0] !== ARRAY_INDICATOR) {
            throw new Error("Unexpected non array request");
          }
          status = "parsing_arraylength";
          buffer = buffer.slice(1);
        } /* falls through */
        case "parsing_arraylength": {
          const finished = parseArrayLength(buffer);
          if (finished) {
            status = "parsing";
          }
          if (buffer.length > 0) {
            keepParsing = true;
          }
          break;
        }
        case "parsing": {
          if (currentArrayIndex === arrayLength) {
            reply = true;
            status = "reply";
            break;
          }
          if (buffer[0] === BULK_STRING_INDICATOR) {
            status = "parsing_bulkstringlength";
            buffer = buffer.slice(1);
            const finished = parseBulkStringLength(buffer);
            if (finished) {
              parts.push(new Uint8Array(bulkStringLength));
              status = "parsing_bulkstring";
            }
          } else {
            throw new Error('Error parsing request')
          }
          if (buffer.length > 0) {
            keepParsing = true;
          }
          break;
        }
        case "parsing_bulkstringlength": {
          const finished = parseBulkStringLength(buffer);
          if (finished) {
            parts.push(new Uint8Array(bulkStringLength));
            status = "parsing_bulkstring";
          }
          if (buffer.length > 0) {
            keepParsing = true;
          }
          break;
        }
        case "parsing_bulkstring": {
          const bulkString = parts[currentArrayIndex];
          if (buffer.length < (bulkStringLength - currentBulkStringIndex)) {
            bulkString.set(buffer, currentBulkStringIndex);
            currentBulkStringIndex += buffer.length;
          } else {
            const remainingString = buffer.slice(
              0,
              bulkStringLength - currentBulkStringIndex,
            );
            bulkString.set(remainingString, currentBulkStringIndex);
            buffer = buffer.slice(
              bulkStringLength - currentBulkStringIndex + 2,
            );
            currentBulkStringIndex = 0;
            bulkStringLength = 0;
            if (currentArrayIndex < arrayLength) {
              currentArrayIndex++;
              status = "parsing";
              keepParsing = true;
              break;
            }
          }
          if (buffer.length > 0) {
            keepParsing = true;
          }
          break;
        }
        case "reply": {
          // Execute the command
          const result = await runCommand(parts, db);
          respond(result, conn);
          // Reset for the next command
          status = "waiting";
          parts = [];
          arrayLength = 0;
          currentArrayIndex = 0;
          reply = false;
          break;
        }
      }
    }
  }
}
