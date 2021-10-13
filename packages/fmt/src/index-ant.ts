import type { Line, Transform } from "./type";

const regex =
  /^\s*@@index\((?<prefix>fields\s*:\s+)?\[(?<fields>.+)\]\s*(?<attributes>.+?)?\s*\)\s*$/u;

export const isIndex = (line: string): boolean => regex.test(line);

export class Index implements Line {
  public fields: string[];
  public attributes: { [key: string]: string };

  constructor(line: string) {
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect: "@@index". Actual: "${line}"`);
    }
    this.fields = groups.fields.trim().split(/,\s+/u);
    this.attributes = {};
    if (groups.attributes) {
      const attributes = groups.attributes.trim().split(/,\s+/u);
      attributes.forEach(attr => this.parseAttributes(attr));
    }
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

    let result = "@@index([";
    result += this.fields.map(f => field(f)).join(", ");
    result += "]";

    const attrs = Object.entries(this.attributes);
    if (attrs.length > 0) {
      result += ", ";
    }

    result += attrs.map(([key, value]) => `${key}: ${value}`).join(", ");
    result += ")";
    return result;
  }
}
