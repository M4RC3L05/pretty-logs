import type { SupportedRuntime } from "../types.ts";
import process from "node:process";
import { fstatSync } from "node:fs";
import { inspect } from "node:util";

export const resolveRuntime = (
  runtime: SupportedRuntime,
): {
  isPiping: boolean;
  stdin: ReadableStream;
  stdout: WritableStream;
  waitFirstSigint: () => void;
  inspect: (data: unknown) => string;
} => {
  if (["bun", "node"].includes(runtime)) {
    return {
      waitFirstSigint: () => process.once("SIGINT", () => {}),
      inspect: (data) => inspect(data, false, 1000, true),
      isPiping: !process.stdin.isTTY &&
        !fstatSync(process.stdin.fd).isFile(),
      stdin: new ReadableStream({
        start: (controller) => {
          process.stdin.on("data", (chunk) => controller.enqueue(chunk));
          process.stdin.on("end", () => controller.close());
          process.stdin.on("error", (error) => controller.error(error));
        },
      }),
      stdout: new WritableStream({
        write: (chunk) => {
          process.stdout.write(chunk);
        },
      }),
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
