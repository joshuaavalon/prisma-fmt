import { DataSource, isDataSource } from "./data-source";
import { Generator, isGenerator } from "./generator";
import { Enum, isEnum } from "./enum";
import { isModel, Model } from "./model";

import type { Block, Transform } from "./type";

export * from "./type";

export interface Options {
  transform: Transform;
  addGeneratorIfNotExists?: boolean;
}

export const formatPrisma = async (
  content: string,
  opts: Options
): Promise<string> => {
  const { transform, addGeneratorIfNotExists = true } = opts;
  const lines = content.split("\n");
  let currBlock: Block | null = null;
  const blocks: Block[] = [];
  let hasGenerator = false;
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.length <= 0) {
      continue;
    }
    if (currBlock !== null) {
      currBlock.append(trimmedLine);
      if (trimmedLine === "}") {
        blocks.push(currBlock);
        currBlock = null;
      }
      continue;
    }
    if (isDataSource(trimmedLine)) {
      currBlock = new DataSource(trimmedLine);
      continue;
    }
    if (isGenerator(trimmedLine)) {
      currBlock = new Generator(trimmedLine);
      hasGenerator = true;
      continue;
    }
    if (isModel(trimmedLine)) {
      currBlock = new Model(trimmedLine);
      continue;
    }
    if (isEnum(trimmedLine)) {
      currBlock = new Enum(trimmedLine);
      continue;
    }
    throw new Error(`Unknown line: ${line}`);
  }
  let result = blocks.map(b => b.toString(transform)).join("\n");
  if (!hasGenerator && addGeneratorIfNotExists) {
    const generator = new Generator("generator client {");
    generator.provider = '"prisma-client-js"';
    result += "\n" + generator.toString();
  }
  return result;
};
