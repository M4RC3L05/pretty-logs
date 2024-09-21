import { pretty } from "./mod.ts";
import { resolveRuntime } from "./resolvers/runtime.ts";
import { runtime } from "./utils.ts";

if (import.meta.main) {
  const runningOn = runtime();

  if (!runningOn) {
    throw new Error(
      "COuld not determine the current runtime.\nSupported runtimes: bun, deno, node.",
    );
  }

  await pretty(resolveRuntime(runningOn));
}
