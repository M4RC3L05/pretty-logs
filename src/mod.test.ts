import { describe, it } from "@std/testing/bdd";
import { assertSpyCalls, spy } from "@std/testing/mock";
import { pretty } from "./mod.ts";

describe("pretty()", () => {
  it("should execute `waitFirstSigint` if necessary", async () => {
    {
      const waitFirstSigintSpy = spy();
      const rs = new ReadableStream({
        start: (c) => {
          c.close();
        },
      });
      const ws = new WritableStream({ write: () => {} });

      const p = pretty({
        inspect: () => "",
        isPiping: false,
        waitFirstSigint: waitFirstSigintSpy,
        stdin: rs,
        stdout: ws,
      });

      assertSpyCalls(waitFirstSigintSpy, 0);

      await p;
    }

    {
      const waitFirstSigintSpy = spy();
      const rs = new ReadableStream({
        start: (c) => {
          c.close();
        },
      });
      const ws = new WritableStream({ write: () => {} });

      const p = pretty({
        inspect: () => "",
        isPiping: true,
        waitFirstSigint: waitFirstSigintSpy,
        stdin: rs,
        stdout: ws,
      });

      assertSpyCalls(waitFirstSigintSpy, 1);

      await p;
    }
  });
});
