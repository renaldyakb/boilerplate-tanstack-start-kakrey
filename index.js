#!/usr/bin/env node

import prompts from "prompts";
import { downloadTemplate } from "giget";
import { cyan, green, red, yellow, bold } from "kleur/colors";
import fs from "node:fs";
import path from "node:path";

const TEMPLATES = [
  {
    title: "TanStack Start + Drizzle + Better Auth",
    value: "tanstack-start-drizzle-better-auth",
    description: "Full-stack auth with Drizzle ORM",
  },
  {
    title: "TanStack Start + Prisma + Better Auth",
    value: "tanstack-start-prisma-better-auth",
    description: "Full-stack auth with Prisma ORM",
  },
  {
    title: "TanStack Start + Drizzle + PG (Simple)",
    value: "tanstack-start-drizzle-pg",
    description: "Simple setup with Drizzle & Postgres",
  },
  {
    title: "TanStack Start + Prisma + PG (Simple)",
    value: "tanstack-start-prisma-pg",
    description: "Simple setup with Prisma & Postgres",
  },
  {
    title: "TanStack Start + tRPC + Query (Minimal)",
    value: "tanstack-start-trpc-query",
    description: "Minimal boilerplate without Auth/DB",
  },
];

async function main() {
  console.log(bold("\n🚀  Welcome to Create Kakrey Stack!\n"));

  const response = await prompts(
    [
      {
        type: "select",
        name: "template",
        message: "Which boilerplate would you like to use?",
        choices: TEMPLATES,
        initial: 0,
      },
      {
        type: "text",
        name: "projectName",
        message: "What is your project name?",
        initial: "my-app",
        validate: (value) => {
          if (!value.trim()) return "Project name cannot be empty";
          if (fs.existsSync(path.resolve(process.cwd(), value))) {
            return "Directory already exists";
          }
          return true;
        },
      },
    ],
    {
      onCancel: () => {
        console.log(red("✖ Operation cancelled"));
        process.exit(1);
      },
    }
  );

  const { template, projectName } = response;
  const targetDir = path.resolve(process.cwd(), projectName);

  console.log(`\n⏳  Downloading ${cyan(template)} to ${green(projectName)}...\n`);

  try {
    // Download from GitHub
    // Assuming the repo is 'renaldyakb/boilerplate-tanstack-start-kakrey'
    await downloadTemplate(
      `gh:renaldyakb/boilerplate-tanstack-start-kakrey/${template}`,
      {
        dir: targetDir,
        force: true, // we validated existence but force allows non-empty overwrite if needed, mainly for subdirs
      }
    );

    console.log(green(`\n✔ Success! Project created in ${bold(projectName)}\n`));
    console.log("Next steps:");
    console.log(`  ${cyan(`cd ${projectName}`)}`);
    console.log(`  ${cyan("npm install")}`);
    console.log(`  ${cyan("cp .env.example .env")}`);
    console.log(`  ${cyan("npm run dev")}`);
    console.log();
  } catch (err) {
    console.error(red("\n✖ Failed to download template:"));
    console.error(err.message);
    if (err.message.includes("404")) {
      console.log(yellow("\n(Make sure the repository is public or you are authenticated if using private repos)"));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
