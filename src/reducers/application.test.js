import reducer from "./application";

describe("Reducer", () => {
  it("throws an error with an unsupported type", () => {
    expect(() => {reducer("", {type: "Non-existed", value: 1})}).toThrow(/tried to reduce with unsupported action type: non-existed/i);
  });
});