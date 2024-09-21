import type { SupportedRuntime } from "../src/types.ts";

export const runtime = (): SupportedRuntime | null => {
  if ("Bun" in globalThis) return "bun";
  if ("Deno" in globalThis) return "deno";
  if ("process" in globalThis) return "node";
  return null;
};

export const safeJsonParse = (data: string) => {
  try {
    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

export const safeUpercase = (data?: unknown) => {
  if (typeof data === "string") return data.toUpperCase();
  return data;
};
