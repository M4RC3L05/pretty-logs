import { afterEach, describe, it } from "@std/testing/bdd";
import { restore, stub } from "@std/testing/mock";
import { assertEquals, assertInstanceOf, fail } from "@std/assert";
import process from "node:process";
import fs from "node:fs";
import { resolveRuntime } from "./runtime.ts";
import type { SupportedRuntime } from "../types.ts";

describe("resolveRuntime()", () => {
  afterEach(() => {
    restore();
  });

  it("should throw an error if runtime is supported", () => {
    try {
      // deno-lint-ignore no-explicit-any
      resolveRuntime("foo" as any);

      fail("Should have thrown an error");
    } catch (error) {
      assertInstanceOf(error, Error);
      assertEquals(error.message, 'Runtime "foo" not supported.');
    }
  });

  for (const runtime of ["bun", "deno", "node"] as SupportedRuntime[]) {
    it(`should resolve the runtime for ${runtime}`, () => {
      if (["bun", "node"].includes(runtime)) {
        stub(process.stdin, "on");
        stub(process.stdout, "on");
      }

      // deno-lint-ignore no-explicit-any
      stub(fs, "fstatSync", () => ({ isFile: () => true }) as any);

      const resolvedRuntime = resolveRuntime(runtime);

      assertEquals(Object.keys(resolvedRuntime).length, 5);
      assertEquals(typeof resolvedRuntime.inspect, "function");
      assertEquals(typeof resolvedRuntime.isPiping, "boolean");
      assertInstanceOf(resolvedRuntime.stdin, ReadableStream);
      assertInstanceOf(resolvedRuntime.stdout, WritableStream);
      assertEquals(typeof resolvedRuntime.waitFirstSigint, "function");
    });
  }
});
