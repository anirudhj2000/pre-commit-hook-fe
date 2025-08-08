# pre-commit-hook-fe

## Production-Ready Pre-Commit Hook System

A comprehensive and configurable pre-commit hook system for maintaining code quality and consistency in your projects.

## Features

- **ESLint Integration** - Automatic code linting with auto-fix capability
- **Prettier Formatting** - Consistent code formatting across the project
- **TypeScript Type Checking** - Optional TypeScript compilation checks
- **Console Log Detection** - Identifies and reports console statements
- **File Size Validation** - Prevents committing large files with configurable limits
- **Branch Naming Convention** - Enforces branch naming patterns
- **Commit Message Format** - Validates commit messages against conventional commits
- **Highly Configurable** - Toggle features on/off via configuration file
- **Performance Optimized** - Parallel processing with configurable workers

## Quick Start - Using in Other Repositories

### Method 1: Automatic Installation (Recommended)

From your target repository, run the installer:

```bash
# Navigate to your project repository
cd /path/to/your/project

# Run the installer
node /path/to/pre-commit-hook-project/install.js
```

This will automatically:

- ✅ Install all required dependencies
- ✅ Copy configuration files
- ✅ Set up Husky hooks
- ✅ Configure package.json scripts
- ✅ Make scripts executable

### Method 2: Manual Installation

If you prefer manual setup:

```bash
# 1. Copy configuration files to your project
cp -r /path/to/pre-commit-hook-project/scripts ./
cp /path/to/pre-commit-hook-project/.eslintrc.json ./
cp /path/to/pre-commit-hook-project/.prettierrc.json ./
cp /path/to/pre-commit-hook-project/.prettierignore ./
cp /path/to/pre-commit-hook-project/.lintstagedrc.json ./
cp /path/to/pre-commit-hook-project/tsconfig.json ./
cp /path/to/pre-commit-hook-project/eslint.config.js ./

# 2. Install dependencies
npm install --save-dev eslint prettier typescript husky lint-staged \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-config-prettier eslint-plugin-prettier chalk@4.1.2

# 3. Initialize Husky
npx husky init

# 4. Copy the pre-commit hook
cp /path/to/pre-commit-hook-project/.husky/pre-commit .husky/pre-commit

# 5. Make scripts executable
chmod +x scripts/*.js .husky/pre-commit
```

### Method 3: NPM Package (For Teams)

Convert to an NPM package for easy distribution:

```bash
# In pre-commit-hook-project directory
npm publish --access public

# In your target repository
npm install --save-dev @yourorg/pre-commit-hooks
npx @yourorg/pre-commit-hooks
```

## Troubleshooting

### "npm test" Error

If you see an error about `npm test` when committing, Husky has the default hook. Fix it:

```bash
# Quick fix
node /path/to/pre-commit-hook-project/fix-husky.js

# Or manually replace
cp /path/to/pre-commit-hook-project/.husky/pre-commit .husky/pre-commit
```

### Hooks Not Running

```bash
# Ensure scripts are executable
chmod +x .husky/pre-commit scripts/*.js

# Reinstall Husky
rm -rf .husky && npx husky init
cp /path/to/pre-commit-hook-project/.husky/pre-commit .husky/pre-commit
```

## Installation for This Repository

If you want to test this pre-commit system in its own repository:

1. Install dependencies:

```bash
npm install
```

2. Initialize git hooks:

```bash
npx husky init
```

## Configuration

All settings are managed in `scripts/pre-commit-config.js`. You can enable/disable checks and customize behavior:

### Available Checks

#### ESLint

```javascript
eslint: {
  enabled: true,        // Enable/disable ESLint
  autoFix: true,        // Auto-fix issues
  blockCommit: true,    // Block commit on errors
}
```

#### Prettier

```javascript
prettier: {
  enabled: true,        // Enable/disable Prettier
  autoFix: true,        // Auto-format code
  blockCommit: true,    // Block commit on errors
}
```

#### TypeScript

```javascript
typescript: {
  enabled: true,        // Enable/disable TypeScript check
  strict: false,        // Use strict mode
  noEmit: true,         // Only type-check, don't emit files
  blockCommit: true,    // Block commit on errors
}
```

#### Console Logs

```javascript
consoleLogs: {
  enabled: true,        // Enable/disable console detection
  blockCommit: false,   // Block commit on console statements
  patterns: [...],      // Patterns to detect
  allowedPatterns: [...] // Exceptions (e.g., logger.*, winston.*)
}
```

#### File Size

```javascript
fileSize: {
  enabled: true,        // Enable/disable file size check
  blockCommit: true,    // Block commit on large files
  limits: {
    default: '5mb',     // Default size limit
    images: '2mb',      // Image files limit
    '.png': '2mb',      // Specific extension limits
    // ... more limits
  }
}
```

#### Branch Naming

```javascript
branchNaming: {
  enabled: true,        // Enable/disable branch name check
  blockCommit: false,   // Block commit on invalid branch name
  pattern: /^(feature|bugfix|hotfix)\/[a-z0-9-]+$/,
  allowedBranches: ['main', 'master', 'develop'],
  message: 'Custom error message'
}
```

#### Commit Message

```javascript
commitMessage: {
  enabled: true,        // Enable/disable commit message check
  blockCommit: true,    // Block commit on invalid message
  pattern: /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,100}$/,
  message: 'Commit message must follow Conventional Commits format',
  examples: [...]       // Example messages to show
}
```

## Post-Installation Steps

After installation in your repository:

1. **Verify Installation**

   ```bash
   # Check if hooks are installed
   ls -la .husky/pre-commit
   ls -la scripts/
   ```

2. **Customize Configuration**
   Edit `scripts/pre-commit-config.js` to match your project needs:

   ```javascript
   // Example: Disable TypeScript for JavaScript-only projects
   typescript: {
     enabled: false,
   }

   // Example: Set stricter file size limits
   fileSize: {
     limits: {
       images: '1mb',
       '.js': '500kb',
     }
   }
   ```

3. **Test the Hooks**

   ```bash
   # Make a test commit
   git add .
   git commit -m "test: verify pre-commit hooks"
   ```

4. **Add Custom Checks** (Optional)
   ```javascript
   // In scripts/pre-commit-config.js
   customHooks: {
     after: ['npm run test:unit', 'npm run check:dependencies'];
   }
   ```

## Usage

Once installed and configured, the pre-commit hooks will run automatically when you attempt to commit:

```bash
git add .
git commit -m "feat: add new feature"
```

The hooks will:

1. Check branch naming convention
2. Run TypeScript type checking (if enabled)
3. Run ESLint on staged files
4. Format code with Prettier
5. Check for console statements
6. Validate file sizes
7. Display commit message format requirements

### Bypassing Hooks

If you need to bypass the hooks temporarily:

```bash
git commit --no-verify -m "emergency fix"
```

**Note:** Use this sparingly and only when absolutely necessary.

## File Structure

```
pre-commit-hook-project/
├── .husky/
│   └── pre-commit          # Main pre-commit hook
├── scripts/
│   ├── pre-commit-config.js # Configuration file
│   ├── check-console-logs.js # Console log detector
│   ├── check-file-size.js   # File size validator
│   └── run-tsc.js          # TypeScript checker
├── src/                     # Example source files
├── .eslintrc.json          # ESLint configuration
├── .prettierrc.json        # Prettier configuration
├── tsconfig.json           # TypeScript configuration
└── .lintstagedrc.json      # Lint-staged configuration
```

## Customization

### Adding Custom Hooks

You can add custom hooks in the configuration:

```javascript
customHooks: {
  before: ['npm run custom-check'],
  after: ['npm run post-check']
}
```

### Modifying Lint Rules

Edit `.eslintrc.json` to customize ESLint rules:

```json
{
  "rules": {
    "no-console": "error",
    "semi": ["error", "always"]
  }
}
```

### Formatting Options

Edit `.prettierrc.json` to customize formatting:

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

## Performance

The system is optimized for performance with:

- Parallel processing of checks
- Configurable worker limits
- Timeout settings
- Only processing staged files

## Common Issues & Solutions

### Issue: "npm test" Error

**Problem:** Husky runs default `npm test` instead of custom hooks  
**Solution:**

```bash
# Quick fix - replace the hook
node /path/to/pre-commit-hook-project/fix-husky.js
```

### Issue: Hooks Not Running

**Problem:** Pre-commit hooks don't execute  
**Solutions:**

```bash
# 1. Check file permissions
chmod +x .husky/pre-commit scripts/*.js

# 2. Reinstall Husky
rm -rf .husky
npx husky init
cp /path/to/pre-commit-hook-project/.husky/pre-commit .husky/pre-commit
chmod +x .husky/pre-commit
```

### Issue: ESLint v9 Compatibility

**Problem:** ESLint requires new config format  
**Solution:** The installer includes `eslint.config.js` for ESLint v9 compatibility

### Issue: TypeScript Errors

**Problem:** TypeScript checks fail  
**Solutions:**

```bash
# 1. Disable TypeScript for non-TS projects
# In scripts/pre-commit-config.js:
typescript: { enabled: false }

# 2. Fix TypeScript configuration
npm install -D typescript
# Adjust tsconfig.json as needed
```

### Issue: Console Log Detection

**Problem:** Legitimate console usage blocked  
**Solution:** Add exceptions in `scripts/pre-commit-config.js`:

```javascript
consoleLogs: {
  allowedPatterns: [/logger\./, /console\.error\(['"]Critical/];
}
```

## Best Practices

1. **Keep hooks fast** - Long-running hooks frustrate developers
2. **Configure appropriately** - Not all projects need all checks
3. **Document exceptions** - When bypassing hooks, document why
4. **Regular updates** - Keep dependencies and configurations current
5. **Team alignment** - Ensure all team members understand the rules

## Contributing

Feel free to customize this setup for your specific needs. Common modifications include:

- Adding new file type checks
- Integrating with CI/CD pipelines
- Adding security scanning
- Custom linting rules
- Integration with issue tracking systems

## Quick Reference

### Essential Commands

```bash
# Install in another repo
node /path/to/pre-commit-hook-project/install.js

# Fix "npm test" error
node /path/to/pre-commit-hook-project/fix-husky.js

# Test hooks
git add . && git commit -m "test: hooks"

# Bypass hooks (emergency only)
git commit --no-verify -m "emergency: bypass hooks"

# Check configuration
cat scripts/pre-commit-config.js
```

### Configuration Toggles

```javascript
// scripts/pre-commit-config.js
{
  eslint: { enabled: true },        // Toggle ESLint
  prettier: { enabled: true },      // Toggle Prettier
  typescript: { enabled: false },   // Toggle TypeScript
  consoleLogs: { enabled: true },   // Toggle console detection
  fileSize: { enabled: true },      // Toggle file size check
}
```
