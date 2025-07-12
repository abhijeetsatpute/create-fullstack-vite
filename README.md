# ⚡ create-fullstack-vite

A fast and flexible CLI tool to scaffold a modern full-stack monorepo using **Vite** for the frontend and **Express** or **NestJS** for the backend — fully integrated with **Turborepo**, `.env` configuration, and modular folder structure.

---

## 🚀 Features

- ⚙️ Monorepo scaffold with Turborepo
- ⚛️ Frontend setup with Vite + React (JS/TS)
- 🧐 Backend setup with Express or NestJS
- 📆 Environment variable support out-of-the-box
- ↻ Auto-linked frontend/backend dev scripts
- 📄 Auto-generated `.env`, `turbo.json`, and `package.json`
- ✅ Works with `npx` — no install required

---

## 📦 Usage

```bash
npx create-fullstack-vite my-app
```

Then follow the prompts to select:

- Frontend framework: React + JavaScript / React + TypeScript
- Backend framework: Express / NestJS

### 🔧 Run the project

```bash
cd my-app
npm run dev
```

---

## 📂 Project Structure

```
my-app/
├── frontend/         # Vite-based React app
├── backend/          # Express or NestJS backend
├── .env              # Environment variables shared across apps
├── turbo.json        # Turborepo task configuration
└── package.json      # Monorepo root with dev/build scripts
```

---

## 🛠️ Contributing

We welcome contributions! Here’s how to get started:

### 1. Clone and install

```bash
git clone https://github.com/your-username/create-fullstack-vite.git
cd create-fullstack-vite
npm install
```

### 2. Run locally for testing

```bash
npm link
# Now test it as a CLI:
create-fullstack-vite my-local-test
```

### 3. Submit a PR

- Create a new branch: `git checkout -b feature/my-feature`
- Make your changes
- Commit and push: `git commit -am "feat: added xyz"` then `git push origin feature/my-feature`
- Open a Pull Request

---

## 🥉 TODOs / Help Wanted

We're actively working on these improvements. Feel free to pick one and open a PR!

- [ ] Improve NestJS backend scaffolding (better .env injection, cleanup files)
- [ ] Add support to serve frontend build from backend
- [ ] Add Database configuration templates (PostgreSQL, MongoDB)
- [ ] Add full login module (Frontend + Backend integration)
- [ ] Add option to choose Tailwind / MUI for frontend styling
- [ ] Add GitHub Actions for CI/CD

---

## 📃 License

create-fullstack-vite is licensed under the [MIT License](https://github.com/abhijeetsatpute/create-fullstack-vite/blob/main/LICENSE.md). See the LICENSE.md file for details.

---

## 💬 Support

If you found this useful or need help:

- Open an [issue](https://github.com/abhijeetsatpute/create-fullstack-vite/issues)
- Or reach out via [Discussions](https://github.com/abhijeetsatpute/create-fullstack-vite/discussions)

---
---
# Made with ❤️ for full-stack devs.
---