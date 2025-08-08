#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const config = require('./pre-commit-config');

if (!config.checks.consoleLogs.enabled) {
  process.exit(0);
}

const files = process.argv.slice(2);
let hasConsoleLog = false;
const findings = [];

const consolePatterns = config.checks.consoleLogs.patterns || [
  /console\.(log|debug|info|warn|error|trace|dir|table|time|timeEnd|group|groupEnd)\(/g,
];

const allowedPatterns = config.checks.consoleLogs.allowedPatterns || [];

files.forEach((file) => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      const lineNumber = index + 1;

      for (const pattern of consolePatterns) {
        const matches = line.match(pattern);
        if (matches) {
          let isAllowed = false;
          for (const allowedPattern of allowedPatterns) {
            if (line.match(allowedPattern)) {
              isAllowed = true;
              break;
            }
          }

          if (!isAllowed && !line.trim().startsWith('//') && !line.trim().startsWith('*')) {
            hasConsoleLog = true;
            findings.push({
              file: path.relative(process.cwd(), file),
              line: lineNumber,
              content: line.trim(),
              match: matches[0],
            });
          }
        }
      }
    });
  } catch (error) {
    console.error(chalk.red(`Error reading file ${file}:`), error.message);
  }
});

if (hasConsoleLog) {
  console.log(chalk.red.bold('\n❌ Console statements detected:\n'));

  findings.forEach(({ file, line, content, match }) => {
    console.log(chalk.yellow(`  ${file}:${line}`));
    console.log(chalk.gray(`    ${content}`));
    console.log(chalk.red(`    Found: ${match}\n`));
  });

  console.log(
    chalk.yellow(
      '💡 Tip: Remove console statements or add them to allowed patterns in pre-commit-config.js'
    )
  );

  if (config.checks.consoleLogs.blockCommit) {
    process.exit(1);
  }
}

process.exit(0);
