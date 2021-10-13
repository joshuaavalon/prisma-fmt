import { Id } from "../id";

const data1 = "@@id([title, author])";

const data2 = "@@id(fields: [title, author], name: test, map: test2)";

const createId = (data: string): Id => {
  const input = data.trim();
  const id = new Id(input);
  return id;
};

describe("data-source", () => {
  test("valid-input", () => {
    const id = createId(data1);
    expect(id.fields.length).toBe(2);
    expect(id.fields).toEqual(expect.arrayContaining(["title", "author"]));
  });

  test("valid-input-with-prefix", () => {
    const id = createId(data2);
    expect(id.fields.length).toBe(2);
    expect(id.fields).toEqual(expect.arrayContaining(["title", "author"]));
    expect(id.attributes.name).toBe("test");
    expect(id.attributes.map).toBe("test2");
  });

  test("invalid-input", () => {
    expect(() => createId("@db.Uuid")).toThrow();
  });

  test("toString", () => {
    const id = createId(data2);
    const id2 = createId(
      id.toString({
        model: i => i.toUpperCase(),
        field: i => i.toUpperCase()
      })
    );
    expect(id2.fields).toEqual(expect.arrayContaining(["TITLE", "AUTHOR"]));
    expect(id2.attributes.name).toBe("test");
    expect(id2.attributes.map).toBe("test2");
  });
});
