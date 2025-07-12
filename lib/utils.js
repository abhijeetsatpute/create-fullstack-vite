import inquirer from "inquirer";
import { execSync } from "child_process";

export async function getProjectName() {
  const cliName = process.argv[2];
  if (cliName) return cliName;

  const res = await inquirer.prompt([
    {
      name: "projectName",
      message: "Project name:",
      validate: (input) => !!input || "Project name cannot be empty.",
    },
  ]);

  return res.projectName;
}

export function installRootDependencies() {
  execSync("npm install", { stdio: "inherit" });
}
