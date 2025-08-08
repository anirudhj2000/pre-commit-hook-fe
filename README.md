# Production-Ready Pre-Commit Hook System

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

## Installation

1. Clone this repository or copy the files to your project
2. Install dependencies:

```bash
npm install
```

3. Initialize git hooks:

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

## Usage

Once configured, the pre-commit hooks will run automatically when you attempt to commit:

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

## Troubleshooting

### Hook Not Running

```bash
# Reinstall husky
npx husky init
chmod +x .husky/pre-commit
```

### Permission Errors

```bash
chmod +x scripts/*.js
chmod +x .husky/pre-commit
```

### TypeScript Errors

- Ensure `tsconfig.json` is properly configured
- Check that TypeScript is installed: `npm install -D typescript`

### Console Log Detection Issues

- Check `allowedPatterns` in configuration
- Use ESLint disable comments for legitimate console usage

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

## License

MIT# pre-commit-hook-fe

# pre-commit-hook-fe
