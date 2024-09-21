import { TextLineStream } from "@std/streams";
import type { PrettyLogsRuntime } from "./types.ts";
import { PrettyLogTransformStream } from "./stream-transformers/pretty-log.ts";

export const pretty = async (
  { inspect, isPiping, stdin, stdout, waitFirstSigint }: PrettyLogsRuntime,
): Promise<void> => {
  // Make sure to wait for stdin to close to close the script when piping
  if (isPiping) {
    waitFirstSigint();
  }

  return await stdin
    .pipeThrough(new TextDecoderStream())
    .pipeThrough(new TextLineStream())
    .pipeThrough(
      new PrettyLogTransformStream({ inspect }),
    )
    .pipeThrough(new TextEncoderStream())
    .pipeTo(stdout);
};

export * from "./types.ts";
export * from "./resolvers/runtime.ts";
export { runtime } from "./utils.ts";
