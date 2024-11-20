import { indentCode } from "./utils.js";

it("it should indent code", () => {
  expect(
    indentCode(
      [
        "some line",
        "some other line",
        "  some indented line",
        "  some other indented line",
      ].join("\n"),
      "  ",
    ),
  ).toBe(
    [
      "  some line",
      "  some other line",
      "    some indented line",
      "    some other indented line",
    ].join("\n"),
  );
});
