#!/usr/bin/env node

const { execSync } = require('child_process');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

const config = require('./pre-commit-config');

if (!config.checks.typescript.enabled) {
  process.exit(0);
}

const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

if (!fs.existsSync(tsconfigPath)) {
  console.log(chalk.yellow('⚠️  No tsconfig.json found, skipping TypeScript check'));
  process.exit(0);
}

console.log(chalk.blue('🔍 Running TypeScript type check...'));

try {
  const options = config.checks.typescript.strict ? '--strict' : '';
  const noEmit = config.checks.typescript.noEmit !== false ? '--noEmit' : '';

  execSync(`npx tsc ${options} ${noEmit}`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  console.log(chalk.green('✅ TypeScript check passed'));
  process.exit(0);
} catch (error) {
  console.log(chalk.red('❌ TypeScript check failed'));

  if (config.checks.typescript.blockCommit) {
    console.log(chalk.yellow('\n💡 Fix TypeScript errors before committing'));
    process.exit(1);
  } else {
    console.log(chalk.yellow('\n⚠️  TypeScript errors detected but commit allowed'));
    process.exit(0);
  }
}
