const TOKEN_ESCAPED_OCTO = "__TOKEN_ESCAPED_BACKSLASH_OCTO__";

const BLOCK_COMMENT = /###[\s\S]*?###/gm;
const INLINE_COMMENT = /^#.*$/gm;

const stripComments = str =>
  str
    .replace("\\#", TOKEN_ESCAPED_OCTO)
    .replace(BLOCK_COMMENT, "")
    .replace(INLINE_COMMENT, "")
    .replace(TOKEN_ESCAPED_OCTO, "#")
    .trim();

export default stripComments;
