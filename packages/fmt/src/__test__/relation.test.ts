import { Relation } from "../relation";

const data1 =
  "@relation(fields: [name_id], references: [id], onDelete: Cascade, onUpdate: NoAction)";

const data2 =
  '@relation("name", fields: [name_id], references: [id], onDelete: Cascade, onUpdate: NoAction)';

const createRelation = (data: string): Relation => {
  const input = data.trim();
  const relation = new Relation(input);
  return relation;
};

describe("data-source", () => {
  test("valid-input-without-name", () => {
    const relation = createRelation(data1);
    expect(relation.name).toBeUndefined();
    expect(relation.attributes.fields).toBe("[name_id]");
    expect(relation.attributes.references).toBe("[id]");
  });

  test("valid-input-with-name", () => {
    const relation = createRelation(data2);
    expect(relation.name).toBe("name");
    expect(relation.attributes.fields).toBe("[name_id]");
    expect(relation.attributes.references).toBe("[id]");
  });

  test("invalid-input", () => {
    expect(() => createRelation("@db.Uuid")).toThrow();
  });

  test("toString", () => {
    const relation = createRelation(data2);
    const relation2 = createRelation(
      relation.toString({
        model: i => i.toUpperCase(),
        field: i => i.toUpperCase()
      })
    );
    expect(relation2.name).toBe("name");
    expect(relation2.attributes.fields).toBe("[NAME_ID]");
    expect(relation2.attributes.references).toBe("[ID]");
    expect(relation2.attributes.onDelete).toBe("Cascade");
    expect(relation2.attributes.onUpdate).toBe("NoAction");
  });
});
