import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export async function scaffoldFrontend(variant, rootDir) {
  console.log("\n\u2728 Scaffolding frontend with Vite...");
  execSync(`npm create vite@latest frontend -- --template ${variant}`, {
    stdio: "inherit",
  });

  const viteConfigFile = fs
    .readdirSync(path.join(rootDir, "frontend"))
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
}
