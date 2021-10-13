import type { Block } from "./type";

const regex = /^\s*enum\s+(?<name>\S+?)\s+\{\s*$/u;

export const isEnum = (line: string): boolean => regex.test(line);

export class Enum implements Block {
  public name: string;
  public lines: string[];

  constructor(line: string) {
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect: "enum name {". Actual: '${line}'`);
    }
    this.name = groups.name;
    this.lines = [];
  }

  append(line: string): void {
    const trimmedLine = line.trim();
    if (trimmedLine.length <= 0) {
      return;
    }
    if (trimmedLine === "}") {
      return;
    }
    this.lines.push(trimmedLine);
  }

  toString(): string {
    let result = `enum ${this.name} {\n`;
    result += this.lines.join("\n");
    result += "}";
    return result;
  }
}
