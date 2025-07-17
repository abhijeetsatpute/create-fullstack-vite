import inquirer from "inquirer";
import path from "path";
import fs from "fs";
import { scaffoldFrontend } from "./scaffoldFrontend.js";
import { scaffoldBackend } from "./scaffoldBackend.js";
import { updateConfigs } from "./updateConfigs.js";
import { writeRootPackage } from "./writeRootPackage.js";
import { installRootDependencies, getProjectName } from "./utils.js";

function generateDockerCompose(rootDir) {
  const composeContent = `
version: "3.8"
services:
  frontend:
    build: ./frontend
    ports:
      - "5173:80"
    depends_on:
      - backend
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    env_file:
      - .env
`.trim();

  fs.writeFileSync(path.join(rootDir, "docker-compose.yml"), composeContent);
  console.log("🐳 docker-compose.yml created at project root.");
}

export async function init() {
  const projectName = await getProjectName();
  const projectRoot = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectRoot)) {
    console.error("\u274C Folder already exists. Choose a different name.");
    process.exit(1);
  }

  const { frontendVariant, backendFramework } = await inquirer.prompt([
    {
      name: "frontendVariant",
      type: "list",
      message: "Choose a frontend framework:",
      choices: [
        { name: "React + TypeScript", value: "react-ts" },
        { name: "React + JavaScript", value: "react" },
      ],
    },
    {
      name: "backendFramework",
      type: "list",
      message: "Choose a backend framework:",
      choices: ["Express", "NestJS"],
    },
  ]);

  fs.mkdirSync(projectRoot);
  process.chdir(projectRoot);

  await scaffoldFrontend(frontendVariant, projectRoot);
  await scaffoldBackend(backendFramework, projectRoot);
  generateDockerCompose(projectRoot);
  updateConfigs(projectName);
  writeRootPackage(projectName);

  console.log("\n\u{1F4E6} Installing root dependencies...");
  installRootDependencies();

  console.log(`\n\u2705 Project created at: ${projectRoot}`);
  console.log(`\n\u{1F449} Next steps:`);
  console.log(`   cd ${projectName}`);
  console.log(`   npm run dev`);
}
