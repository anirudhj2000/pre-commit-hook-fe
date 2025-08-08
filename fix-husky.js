#!/usr/bin/env node

/**
 * Quick fix script for repos where Husky is trying to run npm test
 * Run this from your repository root to fix the pre-commit hook
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if we're in a git repository
try {
  execSync('git rev-parse --git-dir', { stdio: 'ignore' });
} catch {
  console.error('❌ Not a git repository. Please run this in a git repository.');
  process.exit(1);
}

const huskyPreCommitPath = path.join(process.cwd(), '.husky', 'pre-commit');

if (!fs.existsSync(huskyPreCommitPath)) {
  console.error('❌ No .husky/pre-commit file found.');
  console.log('💡 Try running: npx husky init');
  process.exit(1);
}

// Read the current pre-commit file
const currentContent = fs.readFileSync(huskyPreCommitPath, 'utf8');

// Check if it's just the default npm test
if (currentContent.includes('npm test') && !currentContent.includes('pre-commit-config')) {
  console.log('🔧 Fixing default Husky pre-commit hook...');

  // Get the path to the pre-commit hook template
  const scriptDir = __dirname;
  const templatePath = path.join(scriptDir, '.husky', 'pre-commit');

  if (fs.existsSync(templatePath)) {
    // Copy the correct pre-commit hook
    fs.copyFileSync(templatePath, huskyPreCommitPath);
    fs.chmodSync(huskyPreCommitPath, '755');
    console.log('✅ Pre-commit hook fixed! The hook will now run the configured checks.');
  } else {
    console.error('❌ Could not find the pre-commit template.');
    console.log('💡 Please run the full installer: node install.js');
  }
} else if (currentContent.includes('pre-commit-config')) {
  console.log('✅ Your pre-commit hook is already configured correctly!');
} else {
  console.log('⚠️  Your pre-commit hook has custom content.');
  console.log(
    '💡 To replace it with the pre-commit-hook-project version, delete .husky/pre-commit and run the installer again.'
  );
}
