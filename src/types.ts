export type SupportedRuntime = "bun" | "deno" | "node";

export type PrettyLogsRuntime = {
  isPiping: boolean;
  stdin: ReadableStream;
  stdout: WritableStream;
  waitFirstSigint: () => void;
  inspect: (data: unknown) => string;
};
