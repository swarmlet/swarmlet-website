const mkdirp = require("mkdirp");
const simpleGit = require("simple-git");
const { readdirSync, existsSync, readFileSync, writeFileSync } = require("fs");
const { execSync } = require("child_process");

module.exports = function (context, opts) {
  return {
    name: "fetch-external-docs",

    async loadContent() {
      console.log("Fetching examples docs");
      const { tmpDir, remoteUrl, targetPath } = opts;

      execSync(`rm -rf ${tmpDir}`);
      await mkdirp(tmpDir);
      const git = simpleGit(tmpDir);

      if (await git.checkIsRepo()) {
        console.log(tmpDir, "exists, pulling from remote");
        await git.fetch().reset("hard", ["origin/develop"]);
      } else {
        console.log("Pulling from remote", remoteUrl);
        await git
          .init()
          .addRemote("origin", remoteUrl)
          .pull("origin", "develop");
      }

      return readdirSync(`${tmpDir}/examples`).reduce((acc, curr) => {
        const file = `${tmpDir}/examples/${curr}/README.md`;
        return existsSync(file)
          ? {
              ...acc,
              [curr]: {
                docContent: readFileSync(file, "utf8"),
                docPath: `${targetPath}/${curr}.md`,
              },
            }
          : acc;
      }, {});
    },

    async contentLoaded({ content }) {
      const { repoUrl, sidebarContent, sidebarPath } = opts;

      Object.entries(content).forEach(([key, { docContent, docPath }]) => {
        const docHeader = `---\nid: ${key}\ntitle: ${key}\ncustom_edit_url: ${repoUrl}/edit/master/examples/${key}/README.md\n---\n\n`;
        writeFileSync(docPath, docHeader.concat(docContent));
      });

      sidebarContent.sidebar.Examples = Object.keys(content).map(
        (key) => `examples/${key}`
      );
      writeFileSync(
        sidebarPath,
        `module.exports=${JSON.stringify(sidebarContent, null, 2)}`
      );
    },

    // configureWebpack(config, isServer) {
    //   // Modify internal webpack config. If returned value is an Object, it
    //   // will be merged into the final config using webpack-merge;
    //   // If the returned value is a function, it will receive the config as the 1st argument and an isServer flag as the 2nd argument.
    // },
  };
};
