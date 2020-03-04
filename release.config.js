const fs = require("fs");
const czrc = JSON.parse(fs.readFileSync("./.czrc", "utf8"));

const generateTypes = () =>
  czrc.config["cz-emoji"].types.map(t => ({
    type: t.name,
    section: t.changelog ? t.changelog.section || "" : "",
    hidden: !t.changelog || !t.changelog.section ? true : false,
  }));

module.exports = {
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventional-changelog",
        parserOpts: {
          headerPattern: /^.+?\s(\w*)(?:\((.*)\))?!?: (.*)$/, // emoji friendly
        },
        presetConfig: {
          header: "Changelog",
          types: generateTypes(),
          releaseCommitMessageFormat:
            "🧹 Chore: Adds changelog for {{currentTag}} [skip ci]",
        },
      },
    ],
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    "@semantic-release/npm",
    [
      "@semantic-release/git",
      {
        assets: ["dist/**/*", "CHANGELOG.md"],
        message:
          "🧹 Chore: Releases ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
