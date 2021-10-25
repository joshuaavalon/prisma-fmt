# prisma-fmt

[![License][license_badge]][license] [![Actions][actions_badge]][actions] ![semantic-release][semantic_release_badge]

prisma-fmt is deigned to format [prisma] schema file created by introspection to pascal case. Currently, it is a [requested feature][prisma-issue] that is not supported.

prisma-fmt contains 2 packages: [@prisma-fmt/cli][cli] and [@prisma-fmt/fmt][fmt].

[@prisma-fmt/cli][cli] is the command line that can be used directly.

[@prisma-fmt/fmt][fmt] is the library that can be used to customized how to format prisma schema files.

[license]: https://github.com/joshuaavalon/prisma-fmt/blob/master/LICENSE
[license_badge]: https://img.shields.io/badge/license-Apache--2.0-green.svg
[actions]: https://github.com/joshuaavalon/prisma-fmt/actions
[actions_badge]: https://github.com/joshuaavalon/prisma-fmt/actions/workflows/release.yml/badge.svg
[semantic_release_badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[prisma]: https://github.com/prisma/prisma
[prisma-issue]: https://github.com/prisma/prisma/issues/1934
[cli]: ./packages/cli
[fmt]: ./packages/fmt
