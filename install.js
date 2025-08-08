#!/usr/bin/env node

/**
 * Pre-commit Hook Installer
 * This script installs the pre-commit hook system in any repository
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const chalk = require('chalk');

const sourceDir = __dirname;
const targetDir = process.cwd();

console.log(chalk.cyan.bold('\n🚀 Pre-commit Hook System Installer\n'));

// Check if we're in a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  console.log(chalk.red('❌ Not a git repository. Please run this in a git repository.'));
  process.exit(1);
}

// Files to copy
const filesToCopy = [
  { src: '.eslintrc.json', optional: true },
  { src: '.prettierrc.json', optional: true },
  { src: '.prettierignore', optional: true },
  { src: 'tsconfig.json', optional: true },
  { src: '.lintstagedrc.json', optional: false },
];

const scriptsToCopy = [
  'check-console-logs.js',
  'check-file-size.js',
  'run-tsc.js',
  'pre-commit-config.js',
];

// Create necessary directories
console.log(chalk.blue('📁 Creating directories...'));
['scripts', '.husky'].forEach((dir) => {
  const dirPath = path.join(targetDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(chalk.green(`  ✓ Created ${dir}/`));
  }
});

// Copy configuration files
console.log(chalk.blue('\n📋 Copying configuration files...'));
filesToCopy.forEach(({ src, optional }) => {
  const sourcePath = path.join(sourceDir, src);
  const targetPath = path.join(targetDir, src);

  if (fs.existsSync(targetPath) && optional) {
    console.log(chalk.yellow(`  ⚠️  ${src} already exists, skipping...`));
  } else {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(chalk.green(`  ✓ Copied ${src}`));
    } catch (error) {
      console.log(chalk.red(`  ✗ Failed to copy ${src}: ${error.message}`));
    }
  }
});

// Copy scripts
console.log(chalk.blue('\n📜 Copying scripts...'));
scriptsToCopy.forEach((script) => {
  const sourcePath = path.join(sourceDir, 'scripts', script);
  const targetPath = path.join(targetDir, 'scripts', script);

  try {
    fs.copyFileSync(sourcePath, targetPath);
    fs.chmodSync(targetPath, '755');
    console.log(chalk.green(`  ✓ Copied scripts/${script}`));
  } catch (error) {
    console.log(chalk.red(`  ✗ Failed to copy ${script}: ${error.message}`));
  }
});

// Initialize Husky first
console.log(chalk.blue('\n🪝 Setting up Husky...'));
try {
  execSync('npx husky init', { stdio: 'ignore' });
  console.log(chalk.green('  ✓ Husky initialized'));
} catch {
  console.log(chalk.yellow('  ⚠️  Husky already initialized'));
}

// Copy Husky pre-commit hook (force overwrite)
const huskySource = path.join(sourceDir, '.husky', 'pre-commit');
const huskyTarget = path.join(targetDir, '.husky', 'pre-commit');

try {
  // Ensure .husky directory exists
  const huskyDir = path.join(targetDir, '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
  }

  // Force copy the pre-commit hook
  fs.copyFileSync(huskySource, huskyTarget);
  fs.chmodSync(huskyTarget, '755');
  console.log(chalk.green('  ✓ Installed custom pre-commit hook'));
} catch (error) {
  console.log(chalk.red(`  ✗ Failed to setup Husky: ${error.message}`));
}

// Update package.json
console.log(chalk.blue('\n📦 Updating package.json...'));
const packageJsonPath = path.join(targetDir, 'package.json');

if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Add scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      prepare: 'husky',
      lint: 'eslint . --ext .js,.jsx,.ts,.tsx',
      'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
      format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,css,scss,md}"',
      'format:check': 'prettier --check "**/*.{js,jsx,ts,tsx,json,css,scss,md}"',
      typecheck: 'tsc --noEmit',
      'pre-commit': 'lint-staged',
    };

    // Add devDependencies
    const requiredDeps = {
      eslint: '^9.32.0',
      prettier: '^3.6.2',
      typescript: '^5.9.2',
      husky: '^9.1.7',
      'lint-staged': '^16.1.4',
      '@typescript-eslint/parser': '^8.39.0',
      '@typescript-eslint/eslint-plugin': '^8.39.0',
      'eslint-config-prettier': '^10.1.8',
      'eslint-plugin-prettier': '^5.5.4',
      chalk: '^4.1.2',
    };

    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      ...requiredDeps,
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log(chalk.green('  ✓ Updated package.json'));

    // Install dependencies
    console.log(chalk.blue('\n📥 Installing dependencies...'));
    console.log(chalk.gray('  This may take a few moments...\n'));
    execSync('npm install', { stdio: 'inherit' });

    // Husky will be initialized earlier, before copying hooks
  } catch (error) {
    console.log(chalk.red(`  ✗ Failed to update package.json: ${error.message}`));
  }
} else {
  console.log(chalk.yellow('  ⚠️  No package.json found. Please run npm init first.'));
}

// Success message
console.log(chalk.green.bold('\n✅ Installation complete!\n'));
console.log(chalk.cyan('📖 Next steps:'));
console.log(chalk.white('  1. Review and customize scripts/pre-commit-config.js'));
console.log(chalk.white('  2. Adjust .eslintrc.json and .prettierrc.json if needed'));
console.log(chalk.white('  3. Test with: git add . && git commit -m "test: hooks"'));
console.log(chalk.white('\n💡 Configuration file: scripts/pre-commit-config.js\n'));
