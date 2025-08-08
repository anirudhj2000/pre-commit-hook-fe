#!/bin/bash

# Pre-commit Hook Setup Script
# This script installs the pre-commit hook system in any repository

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "🚀 Setting up pre-commit hooks..."

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "📦 Initializing npm project..."
    npm init -y
fi

echo "📥 Installing dependencies..."
npm install --save-dev \
    eslint \
    prettier \
    typescript \
    husky \
    lint-staged \
    @typescript-eslint/parser \
    @typescript-eslint/eslint-plugin \
    eslint-config-prettier \
    eslint-plugin-prettier \
    chalk@4.1.2

echo "📁 Creating directories..."
mkdir -p scripts
mkdir -p .husky

echo "📋 Copying configuration files..."
cp "$SCRIPT_DIR/.eslintrc.json" ./.eslintrc.json 2>/dev/null || echo "⚠️  ESLint config already exists"
cp "$SCRIPT_DIR/.prettierrc.json" ./.prettierrc.json 2>/dev/null || echo "⚠️  Prettier config already exists"
cp "$SCRIPT_DIR/.prettierignore" ./.prettierignore 2>/dev/null || echo "⚠️  Prettier ignore already exists"
cp "$SCRIPT_DIR/tsconfig.json" ./tsconfig.json 2>/dev/null || echo "⚠️  TypeScript config already exists"
cp "$SCRIPT_DIR/.lintstagedrc.json" ./.lintstagedrc.json 2>/dev/null || echo "⚠️  Lint-staged config already exists"

echo "📜 Copying scripts..."
cp "$SCRIPT_DIR/scripts/"*.js ./scripts/

echo "🪝 Setting up Husky..."
npx husky init 2>/dev/null || echo "⚠️  Husky already initialized"
cp "$SCRIPT_DIR/.husky/pre-commit" ./.husky/pre-commit

echo "🔧 Making scripts executable..."
chmod +x scripts/*.js
chmod +x .husky/pre-commit

echo "📝 Adding npm scripts to package.json..."
node -e "
const fs = require('fs');
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

packageJson.scripts = {
    ...packageJson.scripts,
    'prepare': 'husky',
    'lint': 'eslint . --ext .js,.jsx,.ts,.tsx',
    'lint:fix': 'eslint . --ext .js,.jsx,.ts,.tsx --fix',
    'format': 'prettier --write \"**/*.{js,jsx,ts,tsx,json,css,scss,md}\"',
    'format:check': 'prettier --check \"**/*.{js,jsx,ts,tsx,json,css,scss,md}\"',
    'typecheck': 'tsc --noEmit',
    'pre-commit': 'lint-staged',
    'check:console': 'node scripts/check-console-logs.js src/**/*.{js,ts}',
    'check:size': 'node scripts/check-file-size.js assets/**/*'
};

fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
console.log('✅ NPM scripts added');
"

echo "
✅ Pre-commit hooks setup complete!

📖 Next steps:
1. Review and customize scripts/pre-commit-config.js
2. Adjust .eslintrc.json and .prettierrc.json to match your preferences
3. Test by making a commit: git commit -m 'test: pre-commit hooks'

💡 To customize settings, edit: scripts/pre-commit-config.js
"