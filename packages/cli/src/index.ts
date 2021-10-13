import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";

import { formatAndWrite } from "./format";

export const main = async (): Promise<void> => {
  await yargs(hideBin(process.argv))
    .command(
      ["format [file]", "fmt"],
      "format to Prisma schema file",
      yargs =>
        yargs
          .positional("file", {
            describe: "file to format",
            default: "schema.prisma"
          })
          .option("generator", {
            alias: "g",
            type: "boolean",
            describe: "add generator if not exists",
            default: true,
            demandOption: true
          }),
      async argv => {
        await formatAndWrite(argv.file, {
          addGeneratorIfNotExists: argv.generator
        });
      }
    )
    .help()
    .parseAsync();
};
