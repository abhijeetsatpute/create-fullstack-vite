import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export async function scaffoldFrontend(variant, rootDir) {
  console.log("\n\u2728 Scaffolding frontend with Vite...");
  execSync(`npm create vite@latest frontend -- --template ${variant}`, {
    stdio: "inherit",
  });
  const frontendPath = path.join(rootDir, "frontend");

  const viteConfigFile = fs
    .readdirSync(frontendPath)
    .find(
      (f) =>
        f.startsWith("vite.config.") && (f.endsWith(".js") || f.endsWith(".ts"))
    );

  if (viteConfigFile) {
    const viteConfigPath = path.join(rootDir, "frontend", viteConfigFile);
    let content = fs.readFileSync(viteConfigPath, "utf-8");

    if (!content.includes("server:")) {
      content = content.replace(
        /defineConfig\(\{([\s\S]*?)\}\)/m,
        (match, inside) => {
          const updated = inside.trim().endsWith(",")
            ? `${inside}\n  server: { port: 5173 },`
            : `${inside},\n  server: { port: 5173 }`;
          return `defineConfig({${updated}})`;
        }
      );
      fs.writeFileSync(viteConfigPath, content);
    }
  }

  // 🔥 Add Dockerfile for production (Nginx)
  const dockerfileContent = `
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`.trim();

  fs.writeFileSync(path.join(frontendPath, "Dockerfile"), dockerfileContent);
  console.log("🐳 Dockerfile created for the frontend.");
}
