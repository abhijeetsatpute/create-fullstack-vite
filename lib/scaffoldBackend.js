import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export async function scaffoldBackend(framework, rootDir) {
  console.log("\n\u{1F6E0}\uFE0F  Setting up backend...");
  const backendPath = path.join(rootDir, "backend");
  fs.mkdirSync(backendPath);
  process.chdir(backendPath);

  if (framework === "Express") {
    execSync("npm init -y", { stdio: "inherit" });
    execSync("npm install express dotenv", { stdio: "inherit" });

    fs.writeFileSync(
      "index.js",
      `const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const app = express();
const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => res.send("Hello from Express!"));

app.listen(PORT, () => console.log(\`\u{1F680} Server running on http://localhost:\${PORT}\`));`
    );

    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts.dev = "node index.js";
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
  } else {
    execSync("npx @nestjs/cli new . --package-manager npm", {
      stdio: "inherit",
    });

    const mainPath = path.join(process.cwd(), "src", "main.ts");
    if (fs.existsSync(mainPath)) {
      let content = fs.readFileSync(mainPath, "utf-8");
      content = content.replace(
        /app\.listen\((\d+|['"]\d+['"])\)/,
        "app.listen(process.env.PORT || 3001)"
      );

      if (!content.includes("dotenv")) {
        content =
          `import * as dotenv from 'dotenv';\nimport { resolve } from 'path';\ndotenv.config({ path: resolve(__dirname, '../../.env') });\n` +
          content;
      }

      fs.writeFileSync(mainPath, content);
    }

    execSync("npm install dotenv", { stdio: "inherit" });

    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    if (pkg.scripts?.["start:dev"]) {
      pkg.scripts.dev = `${pkg.scripts["start:dev"]} --preserveWatchOutput`;
      delete pkg.scripts["start:dev"];
      fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
    }
  }

  process.chdir(rootDir);
}
