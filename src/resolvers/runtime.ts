import type { SupportedRuntime } from "../types.ts";
import process from "node:process";
import { fstatSync } from "node:fs";
import { inspect } from "node:util";
import { Readable, Writable } from "node:stream";

export const resolveRuntime = (
  runtime: SupportedRuntime,
): {
  isPiping: boolean;
  stdin: ReadableStream;
  stdout: WritableStream;
  waitFirstSigint: () => void;
  inspect: (data: unknown) => string;
} => {
  if (runtime === "bun") {
    return {
      waitFirstSigint: () => process.once("SIGINT", () => {}),
      inspect: (data) =>
        // deno-lint-ignore ban-ts-comment
        // @ts-ignore
        Bun.inspect(data, { colors: true, depth: 100, sorted: true }),
      isPiping: !process.stdin.isTTY &&
        !fstatSync(process.stdin.fd).isFile(),
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      stdin: Bun.stdin.stream() as ReadableStream,
      stdout: new WritableStream({
        write: async (chunk) => {
          // deno-lint-ignore ban-ts-comment
          // @ts-ignore
          await Bun.write(Bun.stdout, chunk);
        },
      }),
    };
  }

  if (runtime === "node") {
    return {
      waitFirstSigint: () => process.once("SIGINT", () => {}),
      inspect: (data) => inspect(data, false, 1000, true),
      isPiping: !process.stdin.isTTY &&
        !fstatSync(process.stdin.fd).isFile(),
      stdin: Readable.toWeb(process.stdin) as ReadableStream,
      stdout: Writable.toWeb(process.stdout),
    };
  }

  if (runtime === "deno") {
    return {
      waitFirstSigint: () => {
        Deno.addSignalListener("SIGINT", function noop() {
          Deno.removeSignalListener("SIGINT", noop);
        });
      },
      inspect: (data) =>
        Deno.inspect(data, {
          colors: true,
          compact: false,
          strAbbreviateSize: Number.POSITIVE_INFINITY,
          depth: 1000,
          sorted: true,
          trailingComma: true,
        }),
      isPiping: !Deno.stdin.isTerminal() &&
        !fstatSync(process.stdin.fd).isFile(),
      stdin: Deno.stdin.readable,
      stdout: Deno.stdout.writable,
    };
  }

  throw new Error(`Runtime "${runtime}" not supported.`);
};
