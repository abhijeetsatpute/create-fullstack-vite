import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const log = (msg) => console.log(`\n🛠️  ${msg}`);
const logStep = (msg) => console.log(`   ↳ ${msg}`);

function generateBackendDockerfile(backendPath, type = "express") {
  let dockerfileContent;
  if (type === "express") {
    dockerfileContent = `
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "run", "prod"]
    `.trim();
  } else if (type === "nestjs") {
    dockerfileContent = `
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production
EXPOSE 5001
CMD ["npm", "run", "prod"]
    `.trim();
  }
  fs.writeFileSync(path.join(backendPath, "Dockerfile"), dockerfileContent);
  console.log(
    `🐳 Dockerfile created for the ${
      type === "express" ? "Express" : "NestJS"
    } backend.`
  );
}

function setupExpressBackend(backendPath) {
  log("Setting up Express backend...");

  execSync("npm init -y", { stdio: "inherit" });
  execSync("npm install express dotenv", { stdio: "inherit" });
  execSync("npm install -D nodemon", { stdio: "inherit" });

  fs.writeFileSync(
    "index.js",
    `const express = require("express");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

app.get("/api", (req, res) => res.send("Hello from Express!"));

app.get("/*test", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "API route not found" });
  }
  res.sendFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
});

app.listen(PORT, () => console.log(\`🚀 Server running on http://localhost:\${PORT}/api\`));`
  );

  const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
  pkg.scripts = {
    ...pkg.scripts,
    dev: "nodemon index.js",
    prod: "node index.js",
  };
  fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2));
}

function setupNestBackend() {
  log("Scaffolding NestJS backend...");

  execSync("npx @nestjs/cli new . --package-manager npm", { stdio: "inherit" });

  execSync(
    "npm install --save @nestjs/serve-static @nestjs/config --legacy-peer-deps",
    {
      stdio: "inherit",
    }
  );

  updateMainTs();
  createConfigFile();
  updatePackageJson();
}

function updateMainTs() {
  const mainPath = path.join("src", "main.ts");
  if (!fs.existsSync(mainPath)) return;

  logStep("Customizing main.ts...");

  const content = `
import { join } from 'path';
import { PORT } from './config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', '..', 'frontend', 'dist'));

  app.setGlobalPrefix('api');
  app.enableCors({ origin: '*', allowedHeaders: '*' });

  app.enableVersioning({ type: VersioningType.URI });

  await app.listen(PORT ?? 5000);
}
bootstrap();
  `.trim();

  fs.writeFileSync(mainPath, content);
}

function createConfigFile() {
  logStep("Creating config/index.ts for env support...");

  const configDir = path.join("src", "config");
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configContent = `
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const {
  PORT,
  DB_PORT,
  DB_HOST,
  DB_PASS,
  DB_USER,
  DB_NAME,
  DB_DIALECT,
  DB_CERT,
  NODE_ENV,
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION,
  URL_TOKEN_SECRET,
  URL_TOKEN_EXPIRATION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_S3_BUCKET_NAME,
  AWS_S3_PATH,
  AWS_S3_SIGNED_URL_EXPIRATION,
  SMTP_HOST,
  SMTP_USER,
  SMTP_PASSWORD,
  FROM_MAIL,
  REACT_APP_BASE_URL,
  LOG_WEBHOOK,
} = process.env;

export const S3_BASE_URL = \`https://\${AWS_S3_BUCKET_NAME}.s3.\${AWS_REGION}.amazonaws.com/\`;
  `.trim();

  fs.writeFileSync(path.join(configDir, "index.ts"), configContent);
}

function updatePackageJson() {
  logStep("Updating package.json scripts...");

  const pkgPath = "package.json";
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

  if (pkg.scripts?.["start:dev"]) {
    pkg.scripts.dev = `${pkg.scripts["start:dev"]} --preserveWatchOutput`;
    pkg.scripts.prod = "node ./dist/main";
    delete pkg.scripts["start:dev"];
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
}

export async function scaffoldBackend(framework, rootDir) {
  console.log("\n🔧 Starting backend setup...");
  const backendPath = path.join(rootDir, "backend");

  fs.mkdirSync(backendPath);
  process.chdir(backendPath);

  if (framework === "Express") {
    setupExpressBackend(backendPath);
    generateBackendDockerfile(backendPath, "express");
  } else {
    setupNestBackend();
    generateBackendDockerfile(process.cwd(), "nestjs");
  }

  log("✅ Backend setup complete.");
  process.chdir(rootDir);
}
