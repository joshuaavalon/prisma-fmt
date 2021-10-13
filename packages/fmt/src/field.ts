import { isRelation, Relation } from "./relation";

import type { Line, Transform } from "./type";

const regex =
  /^\s*(?<name>[^@]\S*?)\s+(?<type>\S+?)(?<annotations>\s+.+?)?\s*$/u;

export const isField = (line: string): boolean => regex.test(line);

export class Field implements Line {
  public name: string;
  public type: string;
  public annotations: string[];

  constructor(line: string) {
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect: field. Actual: '${line}'`);
    }
    this.name = groups.name;
    this.type = groups.type;
    if (groups.annotations) {
      const annotations = groups.annotations.trim().split(/@\s+/u);
      this.annotations = annotations.map(ant => ant.trim());
    } else {
      this.annotations = [];
    }
  }

  isPrimitiveType(): boolean {
    const prismaPrimitives = [
      "String",
      "Boolean",
      "Int",
      "Float",
      "DateTime",
      "BigInt",
      "Decimal"
    ];
    const type = this.type.endsWith("?") ? this.type.slice(0, -1) : this.type;
    return prismaPrimitives.includes(type);
  }

  toString(transform: Transform): string {
    const { model, field } = transform;
    const newName = field(this.name);
    const newType = model(this.type);

    let result = `${newName} ${newType} `;
    let hasMap = false;
    result += this.annotations
      .map(ant => {
        const newAnt = isRelation(ant)
          ? new Relation(ant).toString(transform)
          : ant;
        if (!hasMap) {
          hasMap = newAnt.trim().startsWith("@map(");
        }
        return newAnt;
      })
      .join(" ");
    if (this.name !== newName && !hasMap && this.isPrimitiveType()) {
      result += ` @map("${this.name}")`;
    }
    return result;
  }
}
