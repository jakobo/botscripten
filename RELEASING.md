# This Package is Maintained via `semantic-release`

Releases in this package are automatically managed by `semantic-release` with the following branch designations:

- Commits to `master` are automatically **versioned** and released as both **versioned** (x.y.x) and under the tag `latest`
- Commits to `beta` are automatically released under the tag `beta`
- Commits to `next` are automatically released under the tax `next` and may contain `rc` information.

# Default PR Branch

PRs are automatically targeted for `next`, which includes all improvements and bug fixes that have been accepted and merged. We do not make an attempt to batch together commits with backwards-incompatible changes; these changes land on merge.

# Lifecycle

1. Code is submitted as a PR against `next`
2. On PR accept & merge, `semantic-release` will push the update to the `next` tag.
3. When a reasonable amount of time (or changes) have amassed, `next` is merged to `beta` via a PR
4. On PR accept & merge, `semantic-release` will push the update to the `beta` tag with `rc` information
5. Bug fixes can be submitted either against `next` or `beta`. Bug fixes against `beta` will be cherry-picked back to `next`.
6. On stability and agreement for release, `beta` is merged to `master` via a PR
7. On PR accept & merge, `semantic-release` will publish to npm with the `latest` tag, as well as a `x.y.x` version.
