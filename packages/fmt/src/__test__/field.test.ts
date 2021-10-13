import { Field } from "../field";

const data1 =
  "text Text @relation(fields: [name_id], references: [id], onDelete: Cascade, onUpdate: NoAction)";

const data2 =
  'id            String     @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid';

const createField = (data: string): Field => {
  const input = data.trim();
  const field = new Field(input);
  return field;
};

describe("data-source", () => {
  test("valid-input", () => {
    const field = createField(data1);
    expect(field.name).toBe("text");
    expect(field.type).toBe("Text");
  });

  test("valid-input-with-relation", () => {
    const field = createField(data2);
    expect(field.name).toBe("id");
    expect(field.type).toBe("String");
  });

  test("invalid-input", () => {
    expect(() => createField("@db.Uuid")).toThrow();
  });

  test("toString", () => {
    const field = createField(data1);
    const field2 = createField(
      field.toString({
        model: i => i.toUpperCase(),
        field: i => i.toUpperCase()
      })
    );
    expect(field2.name).toBe("TEXT");
    expect(field2.type).toBe("TEXT");
  });
});
