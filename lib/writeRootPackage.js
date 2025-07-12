import fs from "fs";

export function writeRootPackage(projectName) {
  fs.writeFileSync(
    "package.json",
    JSON.stringify(
      {
        name: projectName,
        private: true,
        devDependencies: {
          turbo: "latest",
        },
        workspaces: ["frontend", "backend"],
        scripts: {
          dev: "turbo run dev",
          build: "turbo run build",
        },
        packageManager: "npm@10.9.0",
      },
      null,
      2
    )
  );
}
