# @prisma-fmt/fmt

[![License][license_badge]][license] [![Actions][actions_badge]][actions] [![NPM][npm_badge]][npm] ![semantic-release][semantic_release_badge]

Library that can be used to customized how to format the [prisma] schema files.

## Getting Started

```sh
npm i @prisma-fmt/fmt
```

```typescript
import { formatPrisma } from "@prisma-fmt/fmt";

const model = (input) => input.toUpperCase();
const field = (input) => input.toUpperCase();
const result = formatPrisma(content, { transform: { model, field } });
```

Both `model` and `field` are transformation functions for model names and field names respectively.
Note that you need to handle `[]` for array and `?` for optional values.

Please refer to [@prisma-fmt/cli][cli] for an example.

[license]: https://github.com/joshuaavalon/prisma-fmt/blob/master/packages/fmt/LICENSE
[license_badge]: https://img.shields.io/badge/license-Apache--2.0-green.svg
[actions]: https://github.com/joshuaavalon/prisma-fmt/actions
[actions_badge]: https://github.com/joshuaavalon/prisma-fmt/actions/workflows/release.yml/badge.svg
[semantic_release_badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[npm]: https://www.npmjs.com/package/@prisma-fmt/fmt
[npm_badge]: https://img.shields.io/npm/v/@prisma-fmt/fmt/latest.svg
[prisma]: https://github.com/prisma/prisma
[cli]: ../cli/src/format.ts
