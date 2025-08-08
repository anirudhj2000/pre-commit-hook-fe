#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const config = require('./pre-commit-config');

if (!config.checks.fileSize.enabled) {
  process.exit(0);
}

const files = process.argv.slice(2);
let hasLargeFiles = false;
const findings = [];

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const getMaxSizeForFile = (file) => {
  const ext = path.extname(file).toLowerCase();
  const limits = config.checks.fileSize.limits;

  if (limits[ext]) {
    return limits[ext];
  }

  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.bmp'];
  const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'];
  const documentExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

  if (imageExtensions.includes(ext)) {
    return limits.images || limits.default;
  }
  if (videoExtensions.includes(ext)) {
    return limits.videos || limits.default;
  }
  if (documentExtensions.includes(ext)) {
    return limits.documents || limits.default;
  }

  return limits.default;
};

const parseSize = (sizeStr) => {
  const units = {
    b: 1,
    byte: 1,
    bytes: 1,
    kb: 1024,
    kilobyte: 1024,
    kilobytes: 1024,
    mb: 1024 * 1024,
    megabyte: 1024 * 1024,
    megabytes: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
    gigabyte: 1024 * 1024 * 1024,
    gigabytes: 1024 * 1024 * 1024,
  };

  if (typeof sizeStr === 'number') {
    return sizeStr;
  }

  const match = sizeStr.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/);
  if (!match) {
    throw new Error(`Invalid size format: ${sizeStr}`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';

  if (!units[unit]) {
    throw new Error(`Unknown unit: ${unit}`);
  }

  return value * units[unit];
};

files.forEach((file) => {
  try {
    const stats = fs.statSync(file);
    const fileSize = stats.size;
    const maxSize = getMaxSizeForFile(file);
    const maxSizeBytes = parseSize(maxSize);

    if (fileSize > maxSizeBytes) {
      hasLargeFiles = true;
      findings.push({
        file: path.relative(process.cwd(), file),
        size: fileSize,
        maxSize: maxSizeBytes,
        formattedSize: formatBytes(fileSize),
        formattedMaxSize: formatBytes(maxSizeBytes),
      });
    }
  } catch (error) {
    console.error(chalk.red(`Error checking file ${file}:`), error.message);
  }
});

if (hasLargeFiles) {
  console.log(chalk.red.bold('\n❌ Large files detected:\n'));

  findings.forEach(({ file, formattedSize, formattedMaxSize }) => {
    console.log(chalk.yellow(`  ${file}`));
    console.log(
      chalk.gray(`    Size: ${chalk.red(formattedSize)} (Max: ${chalk.green(formattedMaxSize)})`)
    );
  });

  console.log(chalk.yellow('\n💡 Tip: Compress images or move large files to Git LFS'));
  console.log(chalk.cyan('   Resources:'));
  console.log(chalk.cyan('   - Image compression: https://tinypng.com'));
  console.log(chalk.cyan('   - Git LFS: https://git-lfs.github.com\n'));

  if (config.checks.fileSize.blockCommit) {
    process.exit(1);
  }
}

process.exit(0);
