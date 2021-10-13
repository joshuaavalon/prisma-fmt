import { Index } from "../index-ant";

const data1 = "@@index([title, author])";

const data2 = "@@index(fields: [title, author], map: test2)";

const createId = (data: string): Index => {
  const input = data.trim();
  const index = new Index(input);
  return index;
};

describe("data-source", () => {
  test("valid-input", () => {
    const index = createId(data1);
    expect(index.fields.length).toBe(2);
    expect(index.fields).toEqual(expect.arrayContaining(["title", "author"]));
  });

  test("valid-input-with-prefix", () => {
    const index = createId(data2);
    expect(index.fields.length).toBe(2);
    expect(index.fields).toEqual(expect.arrayContaining(["title", "author"]));
    expect(index.attributes.map).toBe("test2");
  });

  test("invalid-input", () => {
    expect(() => createId("@db.Uuid")).toThrow();
  });

  test("toString", () => {
    const index = createId(data2);
    const index2 = createId(
      index.toString({
        model: i => i.toUpperCase(),
        field: i => i.toUpperCase()
      })
    );
    expect(index2.fields).toEqual(expect.arrayContaining(["TITLE", "AUTHOR"]));
    expect(index2.attributes.map).toBe("test2");
  });
});
