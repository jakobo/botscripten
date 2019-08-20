# Changelog

# 0.1.0

- **Breaking Changes**
  - Comments are migrated from JavaScript style `/* ... */` to using Octothorpes `#` / `###`. This allos us to support Directives.
  - Removed support completely for `<% ... %>` to promote Twine file portability
  - Removed markdown support, as markdown implementations are not consistent between JavaScript (marked) and other platforms
- **Features**
  - Directives - Directives allow you to attach meaning to comments for your runtime engine. These statements are the new Octothorpe comment, followed by an `@` sign, followed by the directive. For example, a line of `#@foo bar` in your Twine file would be a comment with the directive `@foo`, and the content `bar`.

# 0.0.1

Initial Release
