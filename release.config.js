const fs = require("fs");
const czrc = JSON.parse(fs.readFileSync("./.czrc", "utf8"));

const generateTypes = () =>
  czrc.config["cz-emoji"].types.map(t => {
    const opts = {
      type: t.name.toLowerCase(),
      hidden: !t.changelog || !t.changelog.section ? true : false,
    };
    if (t.changelog && t.changelog.section) {
      opts.section = t.changelog.section;
    }
    return opts;
  });

const generateReleaseRules = () =>
  czrc.config["cz-emoji"].types
    .map(t => {
      if (!t.release) {
        return false;
      }
      if (typeof t.release === "string") {
        return {
          type: t.name,
          release: t.release,
        };
      }

      // lots of options
      let opts = {};
      opts.type = t.name;
      if (t.release.scope) {
        opts.scope = t.release.scope;
        opts.release = t.release.release;
      }
      return opts;
    })
    .filter(Boolean);

const ccOptions = {
  releaseRules: generateReleaseRules(),
  parserOpts: {
    headerPattern: /^.+?\s+(\w+)(?:\((.+)\))?!?: (.+)$/, // emoji friendly
    headerCorrespondence: ["type", "scope", "subject"],
  },
  linkReferences: true,
  presetConfig: {
    header: "Changelog",
    types: generateTypes(),
    releaseCommitMessageFormat:
      "🧹 Chore: Adds changelog for {{currentTag}} [skip ci]",
  },
};

module.exports = {
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        ...ccOptions,
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "conventionalcommits",
        ...ccOptions,
      },
    ],
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
        assets: ["dist/**/*", "examples/**/*", "CHANGELOG.md"],
        message:
          "🧹 Chore: Releases ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
  ],
};
