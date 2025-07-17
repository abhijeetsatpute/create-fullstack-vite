#!/usr/bin/env node

import chalk from "chalk";
import { init } from "../lib/init.js";

(async () => {
  try {
    console.log(chalk.bold.cyan("\n🚀 Welcome to create-fullstack-vite"));
    await init();
  } catch (err) {
    console.error(chalk.red("\n❌ Something went wrong:"), err.message);
    process.exit(1);
  }
})();
