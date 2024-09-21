import { describe, it } from "@std/testing/bdd";
import { assertInstanceOf } from "@std/assert/instance-of";
import { assertEquals } from "@std/assert";
import { PrettyLogTransformStream } from "./pretty-log.ts";

describe("PrettyLogTransformStream", () => {
  describe("contructor()", () => {
    it("should allow to construct", () => {
      assertInstanceOf(
        new PrettyLogTransformStream({ inspect: () => "" }),
        PrettyLogTransformStream,
      );
    });
  });

  describe("transform()", () => {
    it("should enqueue the original chunk if it is not json parsable object", async () => {
      const transformStream = new PrettyLogTransformStream({
        inspect: () => "",
      });

      const chunks = [];

      for await (
        const chunk of new ReadableStream({
          start: (controller) => {
            controller.enqueue("foo");
            controller.enqueue("1");
            controller.enqueue("null");
            controller.close();
          },
        }).pipeThrough(transformStream)
      ) {
        chunks.push(chunk);
      }

      assertEquals(chunks, ["foo", "\n", "1", "\n", "null", "\n"]);
    });

    it("should pretty print json log", async () => {
      const transformStream = new PrettyLogTransformStream({
        inspect: (data) => Deno.inspect(data),
      });

      const chunks = [];

      for await (
        const chunk of new ReadableStream({
          start: (controller) => {
            controller.enqueue(
              '{"datetime":"2024-09-21T18:35:29.481Z","level":"INFO","name":"api","message":"Process boot started"}',
            );
            controller.enqueue(
              '{"datetime":"2024-09-21T11:21:54.526Z","level":"INFO","name":"handler","message":"Upstream addr","data":{"upstreamAddr":{"hostname":"10.43.200.201","port":53,"transport":"udp"}}}',
            );
            controller.close();
          },
        }).pipeThrough(transformStream)
      ) {
        chunks.push(chunk);
      }

      assertEquals(chunks, [
        "\x1b[90m[2024-09-21T18:35:29.481Z]\x1b[39m \x1b[32m(api)\x1b[39m \x1b[36mINFO\x1b[39m \x1b[0mProcess boot started\x1b[0m \x1b[0m\x1b[0m",
        "\n",
        "\x1b[90m[2024-09-21T11:21:54.526Z]\x1b[39m \x1b[32m(handler)\x1b[39m \x1b[36mINFO\x1b[39m \x1b[0mUpstream addr\x1b[0m \x1b[0m\n" +
        "{\n" +
        "  data: {\n" +
        '    upstreamAddr: { hostname: "10.43.200.201", port: 53, transport: "udp" }\n' +
        "  }\n" +
        "}\x1b[0m",
        "\n",
      ]);
    });
  });
});
