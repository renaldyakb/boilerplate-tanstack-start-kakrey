#!/usr/bin/env node

import prompts from "prompts";
import { downloadTemplate } from "giget";
import { cyan, green, red, yellow, bold, dim, magenta } from "kleur/colors";
import fs from "node:fs";
import path from "node:path";

const TEMPLATES = [
  {
    title: "TanStack Start + Drizzle + Better Auth",
    value: "tanstack-start-drizzle-better-auth",
    description: "Full-stack auth with Drizzle ORM",
    hasDb: true,
    orm: "drizzle",
  },
  {
    title: "TanStack Start + Prisma + Better Auth",
    value: "tanstack-start-prisma-better-auth",
    description: "Full-stack auth with Prisma ORM",
    hasDb: true,
    orm: "prisma",
  },
  {
    title: "TanStack Start + Drizzle + PG (Simple)",
    value: "tanstack-start-drizzle-pg",
    description: "Simple setup with Drizzle & Postgres",
    hasDb: true,
    orm: "drizzle",
  },
  {
    title: "TanStack Start + Prisma + PG (Simple)",
    value: "tanstack-start-prisma-pg",
    description: "Simple setup with Prisma & Postgres",
    hasDb: true,
    orm: "prisma",
  },
  {
    title: "TanStack Start + tRPC + Query (Minimal)",
    value: "tanstack-start-trpc-query",
    description: "Minimal boilerplate without Auth/DB",
    hasDb: false,
    orm: null,
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
  const selectedTemplate = TEMPLATES.find((t) => t.value === template);

  console.log(`\n⏳  Downloading ${cyan(template)} to ${green(projectName)}...\n`);

  try {
    // Download from GitHub
    await downloadTemplate(
      `gh:renaldyakb/boilerplate-tanstack-start-kakrey/${template}`,
      {
        dir: targetDir,
        force: true,
      }
    );

    // Auto-copy .env.example to .env
    const envExamplePath = path.join(targetDir, ".env.example");
    const envPath = path.join(targetDir, ".env");
    
    if (fs.existsSync(envExamplePath) && !fs.existsSync(envPath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log(green("✔ Created .env from .env.example"));
    }

    console.log(green(`\n✔ Success! Project created in ${bold(projectName)}\n`));
    
    // Print next steps
    console.log(bold("📋 Next Steps:\n"));
    console.log(`  ${dim("1.")} ${cyan(`cd ${projectName}`)}`);
    console.log(`  ${dim("2.")} ${cyan("npm install")}`);
    
    if (selectedTemplate?.hasDb) {
      console.log(`  ${dim("3.")} ${cyan("npm run db:up")}         ${dim("# Start PostgreSQL via Docker")}`);
      
      if (selectedTemplate.orm === "prisma") {
        console.log(`  ${dim("4.")} ${cyan("npm run db:push")}       ${dim("# Push schema to database")}`);
      } else if (selectedTemplate.orm === "drizzle") {
        console.log(`  ${dim("4.")} ${cyan("npm run db:push")}       ${dim("# Push schema to database")}`);
      }
      
      console.log(`  ${dim("5.")} ${cyan("npm run dev")}`);
    } else {
      console.log(`  ${dim("3.")} ${cyan("npm run dev")}`);
    }
    
    console.log();
    console.log(dim("─".repeat(50)));
    console.log();
    console.log(`${magenta("💡 Tip:")} Edit ${cyan(".env")} to configure your environment variables.`);
    
    if (selectedTemplate?.hasDb) {
      console.log(`${magenta("💡 Tip:")} Make sure Docker is running before ${cyan("npm run db:up")}`);
    }
    
    console.log();
    console.log(bold(green("Happy coding! 🎉")));
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

