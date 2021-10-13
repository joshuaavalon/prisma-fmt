import { Model } from "../model";

const data = `
model Post {
  id      Int     @id @default(autoincrement())
  title   String
  content String?

  @@index([title])
}
`;

const invalidData = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const createModel = (data: string): Model => {
  const input = data.trim();
  const lines = input.split("\n");
  const firstLine = lines.shift();
  expect(firstLine).toBeDefined();
  const model = new Model(firstLine as string);
  lines.forEach(line => model.append(line));
  return model;
};

describe("model", () => {
  test("valid-input", () => {
    const model = createModel(data);
    expect(model.name).toBe("Post");
    expect(model.lines.length).toBe(4);
  });

  test("invalid-input", () => {
    expect(() => createModel(invalidData)).toThrow();
  });

  test("toString", () => {
    const model = createModel(data);
    const model2 = createModel(
      model.toString({
        model: i => i.toUpperCase(),
        field: i => i.toUpperCase()
      })
    );
    expect(model2.name).toBe("POST");
    expect(model2.lines.length).toBe(5);
  });
});
