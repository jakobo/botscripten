# Changelog

# 0.1.1 (in progress)

- **Features**
  - node.js support. Chatbook now has a simple parser for Chatbook-formated Twine2 files.
  - Tests now running via `yarn test`. Currently used to validate the parser is working as-intended
- **Fixes**
  - Removed `chatbook.umd.js` as it's an intermediate file in the twine build
  - Refactored build scripts and `concurrently` output for a cleaner dev console
  - Added Husky + Prettier for consistent JavaScript formatting

# 0.1.0 (intermediate)

Between 0.1.0 and 0.1.1, the `chatbook` repository was transferred to the `aibexhq` organization. Contributors remained the same.

# 0.1.0

- **Breaking Changes**
  - Comments are migrated from JavaScript style `/* ... */` to using Octothorpes `#` / `###`. This allos us to support Directives.
  - Removed support completely for `<% ... %>` to promote Twine file portability
  - Removed markdown support, as markdown implementations are not consistent between JavaScript (marked) and other platforms
- **Features**
  - Directives - Directives allow you to attach meaning to comments for your runtime engine. These statements are the new Octothorpe comment, followed by an `@` sign, followed by the directive. For example, a line of `#@foo bar` in your Twine file would be a comment with the directive `@foo`, and the content `bar`.

# 0.0.1

Initial Release
