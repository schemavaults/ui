import { describe, expect, test } from "bun:test";

import { parseDotenv, serializeDotenv, toEnvVarName } from "./parse-dotenv";

describe("parseDotenv", () => {
  test("parses simple KEY=value lines", () => {
    expect(parseDotenv("A=1\nB=two")).toEqual([
      { key: "A", value: "1" },
      { key: "B", value: "two" },
    ]);
  });

  test("skips blank lines, comments and lines without =", () => {
    expect(parseDotenv("# header\n\nA=1\nGARBAGE\n=nokey")).toEqual([
      { key: "A", value: "1" },
    ]);
  });

  test("drops export prefix and unwraps quotes", () => {
    expect(
      parseDotenv(`export A="hello world"\nB='x # y'\nC="line\\nbreak"`),
    ).toEqual([
      { key: "A", value: "hello world" },
      { key: "B", value: "x # y" },
      { key: "C", value: "line\nbreak" },
    ]);
  });

  test("strips trailing comments from unquoted values only", () => {
    expect(parseDotenv("A=1 # note\nB=a#b")).toEqual([
      { key: "A", value: "1" },
      { key: "B", value: "a#b" },
    ]);
  });

  test("keeps = inside values and handles CRLF", () => {
    expect(parseDotenv("URL=postgres://u:p@h/db?x=1\r\nB=2")).toEqual([
      { key: "URL", value: "postgres://u:p@h/db?x=1" },
      { key: "B", value: "2" },
    ]);
  });
});

describe("serializeDotenv", () => {
  test("drops empty keys and quotes values that need it", () => {
    expect(
      serializeDotenv([
        { key: "A", value: "1" },
        { key: "", value: "ignored" },
        { key: "B", value: 'say "hi"' },
        { key: "C", value: "" },
      ]),
    ).toBe('A=1\nB="say \\"hi\\""\nC=');
  });

  test("round-trips through parseDotenv", () => {
    const entries = [
      { key: "A", value: "with space" },
      { key: "B", value: "multi\nline" },
      { key: "C", value: "back\\slash" },
      { key: "D", value: "x=y" },
    ];
    expect(parseDotenv(serializeDotenv(entries))).toEqual(entries);
  });
});

describe("toEnvVarName", () => {
  test("upper-snake-cases free text", () => {
    expect(toEnvVarName("api key")).toBe("API_KEY");
    expect(toEnvVarName("db-url")).toBe("DB_URL");
    expect(toEnvVarName("1st")).toBe("_1ST");
  });
});
