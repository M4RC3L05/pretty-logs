import { describe, it } from "@std/testing/bdd";
import { assertEquals } from "@std/assert";
import { safeJsonParse, safeUpercase } from "./utils.ts";

describe("safeJsonParse()", () => {
  it("should try to parse a json string and return undefined on fail", () => {
    assertEquals(safeJsonParse(""), undefined);
    assertEquals(safeJsonParse("{}"), {});
    assertEquals(safeJsonParse("1"), 1);
  });
});

describe("safeUpercase()", () => {
  it("should try to upercase value and return the value if it cannot", () => {
    assertEquals(safeUpercase(""), "");
    assertEquals(safeUpercase("foo"), "FOO");
    assertEquals(safeUpercase(1), 1);
    assertEquals(safeUpercase(null), null);
  });
});
