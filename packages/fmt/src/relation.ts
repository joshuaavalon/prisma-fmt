import type { Line, Transform } from "./type";

const regex =
  /^\s*@relation\((?<prefix>name\s*:\s+)?(?<name>"\S+?",?\s*)?(?<attributes>.+?)?\s*\)\s*$/u;

export const isRelation = (line: string): boolean => regex.test(line);

export class Relation implements Line {
  public name?: string;
  public attributes: { [key: string]: string };

  constructor(line: string) {
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect: "@relation". Actual: "${line}"`);
    }
    if (groups.name) {
      this.parseName(groups.name);
    }
    this.attributes = {};
    if (groups.attributes) {
      const attributes = groups.attributes.trim().split(/,\s+/u);
      attributes.forEach(attr => this.parseAttributes(attr));
    }
  }

  private parseName(line: string): void {
    const regex = /^"(?<name>\S+)",?\s*$/u;
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect name. Actual: '${line}'`);
    }
    this.name = groups.name;
  }

  private parseAttributes(line: string): void {
    if (line.length <= 0) {
      return;
    }
    const regex = /^\s*(?<key>\w+):\s+(?<value>\S+)\s*$/u;
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect attribute. Actual: '${line}'`);
    }
    const { key, value } = groups;
    this.attributes[key] = value;
  }

  toString(transform: Transform): string {
    const { field } = transform;

    let result = "@relation(";
    if (this.name) {
      result += `"${this.name}"`;
    }
    const attrs = Object.entries(this.attributes);

    if (this.name && attrs.length > 0) {
      result += ", ";
    }

    result += attrs
      .map(([key, value]) => {
        if (key !== "fields" && key !== "references") {
          return `${key}: ${value}`;
        }

        const regex = /^\[(?<value>\S+)\]$/u;
        const match = regex.exec(value);
        const groups = match?.groups;
        if (!groups) {
          throw new Error(`Expect array. Actual: "${value}"`);
        }
        const fields = groups.value.split(/,\s*/u);
        const newValue = fields.map(f => field(f)).join(", ");
        return `${key}: [${newValue}]`;
      })
      .join(", ");
    result += ")";
    return result;
  }
}
