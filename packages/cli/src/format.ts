import fs from "fs/promises";
import { formatPrisma, Options } from "@prisma-fmt/fmt";
import { camelCase, pascalCase } from "change-case";
import { formatSchema } from "@prisma/sdk";

const findIndex = (input: string): number => {
  const questionMark = input.lastIndexOf("?");
  const squareMark = input.lastIndexOf("[");
  if (questionMark < 0 && squareMark < 0) {
    return -1;
  }
  if (questionMark < 0) {
    return squareMark;
  }
  if (squareMark < 0) {
    return questionMark;
  }
  return questionMark > squareMark ? squareMark : questionMark;
};
const model = (input: string): string => {
  const index = findIndex(input);
  if (index < 0) {
    return pascalCase(input);
  }
  const pre = input.substr(0, index);
  const post = input.substr(index);
  return pascalCase(pre) + post;
};

const field = (input: string): string => {
  const index = findIndex(input);
  if (index < 0) {
    return camelCase(input);
  }
  const pre = input.substr(0, index);
  const post = input.substr(index);
  return pascalCase(pre) + post;
};

type FormatOptions = Omit<Options, "transform">;

export const format = async (
  content: string,
  opts: FormatOptions = {}
): Promise<string> => {
  const schema = await formatPrisma(content, {
    ...opts,
    transform: { model, field }
  });
  return await formatSchema({ schema });
};

export const formatAndWrite = async (
  file: string,
  opts: FormatOptions = {}
): Promise<void> => {
  try {
    await fs.access(file);
  } catch {
    console.error(`${file} does not exist`);
    process.exit(1);
  }

  const content = await fs.readFile(file, { encoding: "utf8" });
  const formatted = await format(content, opts);
  await fs.writeFile(file, formatted, { encoding: "utf8" });
};
