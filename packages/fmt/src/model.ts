import { Field, isField } from "./field";
import { Index, isIndex } from "./index-ant";
import { isUnique, Unique } from "./unique";
import { Id, isId } from "./id";
import { Annotation, isAnnotation } from "./annotation";
import type { Block, Line, Transform } from "./type";

const regex = /^\s*model\s+(?<name>\S+?)\s+\{\s*$/u;

export const isModel = (line: string): boolean => regex.test(line);

export class Model implements Block {
  public name: string;
  public lines: Line[];

  constructor(line: string) {
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Expect: "model name {". Actual: '${line}'`);
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
    if (isField(trimmedLine)) {
      this.lines.push(new Field(trimmedLine));
      return;
    }
    if (isIndex(trimmedLine)) {
      this.lines.push(new Index(trimmedLine));
      return;
    }
    if (isId(trimmedLine)) {
      this.lines.push(new Id(trimmedLine));
      return;
    }
    if (isUnique(trimmedLine)) {
      this.lines.push(new Unique(trimmedLine));
      return;
    }
    if (isAnnotation(trimmedLine)) {
      this.lines.push(new Annotation(trimmedLine));
      return;
    }
    throw new Error(`Unknown line: '${line}'`);
  }

  toString(transform: Transform): string {
    const { model } = transform;

    const newName = model(this.name);
    let result = `model ${newName} {\n`;
    let hasMap = false;
    this.lines.forEach(line => {
      const newLine = line.toString(transform);
      if (!hasMap) {
        hasMap = newLine.trim().startsWith("@@map(");
      }
      result += `${newLine}\n`;
    });
    if (this.name !== newName && !hasMap) {
      result += `@@map("${this.name}")\n`;
    }
    result += "}";
    return result;
  }
}
