import { DataSource } from "../data-source";

const data = `
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
`;

const invalidData = `
model item {
  id           String       @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  code         String       @unique
}
`;

const createDataSource = (data: string): DataSource => {
  const input = data.trim();
  const lines = input.split("\n");
  const firstLine = lines.shift();
  expect(firstLine).toBeDefined();
  const ds = new DataSource(firstLine as string);
  lines.forEach(line => ds.append(line));
  return ds;
};

describe("data-source", () => {
  test("valid-input", () => {
    const ds = createDataSource(data);
    expect(ds.provider).toBe('"postgresql"');
    expect(ds.url).toBe('env("DATABASE_URL")');
  });

  test("invalid-input", () => {
    expect(() => createDataSource(invalidData)).toThrow();
  });

  test("toString", () => {
    const ds = createDataSource(data);
    const ds2 = createDataSource(ds.toString());
    expect(ds2.provider).toBe('"postgresql"');
    expect(ds2.url).toBe('env("DATABASE_URL")');
  });
});
