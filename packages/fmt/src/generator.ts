import type { Block } from "./type";

export const isGenerator = (line: string): boolean => {
  const regex = /^\s*generator\s+client\s+\{\s*$/u;
  return regex.test(line);
};

export class Generator implements Block {
  public provider?: string;
  public output?: string;
  public engineType?: string;
  public binaryTargets?: string;

  constructor(line: string) {
    if (!isGenerator(line)) {
      throw new Error(`Expect: "generator client {". Actual: "${line}"`);
    }
  }

  append(line: string): void {
    const trimmedLine = line.trim();
    if (trimmedLine.length <= 0) {
      return;
    }
    if (trimmedLine.startsWith("provider")) {
      this.parseProvider(trimmedLine);
      return;
    }
    if (trimmedLine.startsWith("output")) {
      this.parseOutput(trimmedLine);
      return;
    }
    if (trimmedLine.startsWith("engineType")) {
      this.parseEngineType(trimmedLine);
      return;
    }
    if (trimmedLine.startsWith("binaryTargets")) {
      this.parseBinaryTargets(trimmedLine);
      return;
    }
    if (trimmedLine === "}") {
      return;
    }
    throw new Error(`Unknown line: "${line}"`);
  }

  private parseProvider(line: string): void {
    const regex = /^\s*provider\s+=\s+(?<provider>.+?)\s*$/u;
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Unknown line: "${line}"`);
    }
    this.provider = groups.provider;
  }

  private parseOutput(line: string): void {
    const regex = /^\s*output\s+=\s+(?<output>.+)\s*$/u;
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Unknown line: "${line}"`);
    }
    this.output = groups.output;
  }

  private parseEngineType(line: string): void {
    const regex = /^\s*engineType\s+=\s+(?<engineType>.+)\s*$/u;
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Unknown line: "${line}"`);
    }
    this.engineType = groups.engineType;
  }

  private parseBinaryTargets(line: string): void {
    const regex = /^\s*binaryTargets\s+=\s+(?<binaryTargets>.+)\s*$/u;
    const match = regex.exec(line);
    const groups = match?.groups;
    if (!groups) {
      throw new Error(`Unknown line: "${line}"`);
    }
    this.binaryTargets = groups.binaryTargets;
  }

  toString(): string {
    let result = "generator client {\n";
    if (this.provider) {
      result += `  provider = ${this.provider}\n`;
    }
    if (this.output) {
      result += `  output = ${this.output}\n`;
    }
    if (this.engineType) {
      result += `  engineType = ${this.engineType}\n`;
    }
    if (this.binaryTargets) {
      result += `  binaryTargets = ${this.binaryTargets}\n`;
    }
    result += "}";
    return result;
  }
}
