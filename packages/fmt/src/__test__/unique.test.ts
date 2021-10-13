import { Unique } from "../unique";

const data1 = "@@unique([title, author])";

const data2 = "@@unique(fields: [title, author], name: test, map: test2)";

const createId = (data: string): Unique => {
  const input = data.trim();
  const unique = new Unique(input);
  return unique;
};

describe("data-source", () => {
  test("valid-input", () => {
    const unique = createId(data1);
    expect(unique.fields.length).toBe(2);
    expect(unique.fields).toEqual(expect.arrayContaining(["title", "author"]));
  });

  test("valid-input-with-prefix", () => {
    const unique = createId(data2);
    expect(unique.fields.length).toBe(2);
    expect(unique.fields).toEqual(expect.arrayContaining(["title", "author"]));
    expect(unique.attributes.name).toBe("test");
    expect(unique.attributes.map).toBe("test2");
  });

  test("invalid-input", () => {
    expect(() => createId("@db.Uuid")).toThrow();
  });

  test("toString", () => {
    const unique = createId(data2);
    const unique2 = createId(
      unique.toString({
        model: i => i.toUpperCase(),
        field: i => i.toUpperCase()
      })
    );
    expect(unique2.fields).toEqual(expect.arrayContaining(["TITLE", "AUTHOR"]));
    expect(unique2.attributes.name).toBe("test");
    expect(unique2.attributes.map).toBe("test2");
  });
});
