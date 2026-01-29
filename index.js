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
  console.log(bold("\n🚀 Create Kakrey Stack!\n"));

  // Check for arguments: "." or project name
  const args = process.argv.slice(2);
  const firstArg = args[0];
  const installInCurrentDir = firstArg === ".";
  const projectNameFromArg = firstArg && firstArg !== "." ? firstArg : null;
  
  let projectName;
  let targetDir;

  if (installInCurrentDir) {
    // Install in current directory
    targetDir = process.cwd();
    projectName = path.basename(targetDir);
    
    // Check if directory has files (excluding common ignorable files)
    const existingFiles = fs.readdirSync(targetDir).filter(
      (f) => !f.startsWith(".") && f !== "node_modules"
    );
    
    if (existingFiles.length > 0) {
      const { confirmOverwrite } = await prompts({
        type: "confirm",
        name: "confirmOverwrite",
        message: `Current directory is not empty. Continue anyway?`,
        initial: false,
      });
      
      if (!confirmOverwrite) {
        console.log(red("✖ Operation cancelled"));
        process.exit(1);
      }
    }
    
    console.log(dim(`📁 Installing in current directory: ${cyan(targetDir)}\n`));
  } else if (projectNameFromArg) {
    // Project name provided as argument
    projectName = projectNameFromArg;
    targetDir = path.resolve(process.cwd(), projectName);
    
    if (fs.existsSync(targetDir)) {
      console.log(red(`✖ Directory "${projectName}" already exists`));
      process.exit(1);
    }
    
    console.log(dim(`📁 Creating project: ${cyan(projectName)}\n`));
  }

  // Template selection
  const templateResponse = await prompts(
    {
      type: "select",
      name: "template",
      message: "Which boilerplate would you like to use?",
      choices: TEMPLATES,
      initial: 0,
    },
    {
      onCancel: () => {
        console.log(red("✖ Operation cancelled"));
        process.exit(1);
      },
    }
  );

  const { template } = templateResponse;

  // Project name (only ask if not using ".")
  if (!installInCurrentDir) {
    const nameResponse = await prompts(
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
      {
        onCancel: () => {
          console.log(red("✖ Operation cancelled"));
          process.exit(1);
        },
      }
    );
    
    projectName = nameResponse.projectName;
    targetDir = path.resolve(process.cwd(), projectName);
  }

  const selectedTemplate = TEMPLATES.find((t) => t.value === template);

  console.log(`\n⏳  Downloading ${cyan(template)}${installInCurrentDir ? "" : ` to ${green(projectName)}`}...\n`);

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

    console.log(green(`\n✔ Success! Project created${installInCurrentDir ? " in current directory" : ` in ${bold(projectName)}`}\n`));
    
    // Print next steps
    console.log(bold("📋 Next Steps:\n"));
    
    let stepNum = 1;
    
    if (!installInCurrentDir) {
      console.log(`  ${dim(`${stepNum}.`)} ${cyan(`cd ${projectName}`)}`);
      stepNum++;
    }
    
    console.log(`  ${dim(`${stepNum}.`)} ${cyan("npm install")}`);
    stepNum++;
    
    if (selectedTemplate?.hasDb) {
      console.log(`  ${dim(`${stepNum}.`)} ${cyan("npm run db:up")}         ${dim("# Start PostgreSQL via Docker")}`);
      stepNum++;
      
      console.log(`  ${dim(`${stepNum}.`)} ${cyan("npm run db:push")}       ${dim("# Push schema to database")}`);
      stepNum++;
      
      console.log(`  ${dim(`${stepNum}.`)} ${cyan("npm run dev")}`);
    } else {
      console.log(`  ${dim(`${stepNum}.`)} ${cyan("npm run dev")}`);
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


