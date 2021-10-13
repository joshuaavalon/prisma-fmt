import type { Line } from "./type";

const regex = /^\s*@@\S+\s*$/u;

export const isAnnotation = (line: string): boolean => regex.test(line);

export class Annotation implements Line {
  public line: string;

  constructor(line: string) {
    this.line = line;
  }

  toString(): string {
    return this.line;
  }
}
