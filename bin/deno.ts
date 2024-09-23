#!/usr/bin/env deno

import { pretty } from "./../src/mod.ts";
import { resolveRuntime } from "./../src/resolvers/runtime.ts";
import { runtime } from "./../src/utils.ts";

if (import.meta.main) {
  const runningOn = runtime();

  if (!runningOn) {
    throw new Error(
      "Could not determine the current runtime.\nSupported runtimes: bun, deno, node.",
    );
  }

  await pretty(resolveRuntime(runningOn));
}
