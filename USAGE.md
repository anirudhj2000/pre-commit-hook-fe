# How to Use This Pre-commit Hook System in Another Repository

## Quick Setup Methods

### Method 1: Using the Install Script (Easiest)

1. **Copy the entire pre-commit-hook-project folder** to a temporary location
2. **Navigate to your target repository**
3. **Run the installer:**

```bash
# From your target repository
node /path/to/pre-commit-hook-project/install.js
```

Or use the bash script:

```bash
bash /path/to/pre-commit-hook-project/setup.sh
```

### Method 2: NPM Package (Best for Teams)

1. **Publish as an NPM package:**

```bash
# In pre-commit-hook-project directory
npm login
npm publish --access public
```

2. **Install in your target repo:**

```bash
npm install --save-dev @yourname/pre-commit-hooks
npx @yourname/pre-commit-hooks install
```

### Method 3: Git Submodule

1. **Add as a submodule in your target repo:**

```bash
git submodule add https://github.com/yourname/pre-commit-hooks.git .pre-commit-hooks
cd .pre-commit-hooks
./setup.sh
```

### Method 4: Manual Copy

1. **Copy these files to your target repository:**

```bash
# Required files
cp -r scripts/ /path/to/target/repo/
cp .eslintrc.json /path/to/target/repo/
cp .prettierrc.json /path/to/target/repo/
cp .prettierignore /path/to/target/repo/
cp tsconfig.json /path/to/target/repo/
cp .lintstagedrc.json /path/to/target/repo/
cp -r .husky/ /path/to/target/repo/
```

2. **Install dependencies in target repo:**

```bash
npm install --save-dev \
  eslint prettier typescript husky lint-staged \
  @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-config-prettier eslint-plugin-prettier chalk@4.1.2
```

3. **Initialize Husky:**

```bash
npx husky init
```

4. **Make scripts executable:**

```bash
chmod +x scripts/*.js .husky/pre-commit
```

## Creating a Reusable NPM Package

Transform this into an NPM package for easy distribution:

1. **Create a new `bin/install.js` file:**

```javascript
#!/usr/bin/env node
require('../install.js');
```

2. **Update package.json:**

```json
{
  "name": "@yourorg/pre-commit-hooks",
  "version": "1.0.0",
  "bin": {
    "install-pre-commit-hooks": "./bin/install.js"
  },
  "files": [
    "scripts/",
    ".husky/",
    ".eslintrc.json",
    ".prettierrc.json",
    ".prettierignore",
    ".lintstagedrc.json",
    "tsconfig.json",
    "install.js",
    "bin/"
  ]
}
```

3. **Publish to NPM:**

```bash
npm publish --access public
```

4. **Use in any project:**

```bash
npx @yourorg/pre-commit-hooks
```

## GitHub Template Repository

1. **Create a template repository:**
   - Push this project to GitHub
   - Go to Settings → Check "Template repository"

2. **Use the template:**
   - Click "Use this template" on GitHub
   - Clone and customize for your project

## Docker Integration

Create a Dockerfile for containerized setup:

```dockerfile
FROM node:18-alpine
WORKDIR /hooks
COPY . .
RUN npm install
ENTRYPOINT ["node", "install.js"]
```

Use it:

```bash
docker build -t pre-commit-hooks .
docker run -v $(pwd):/target pre-commit-hooks
```

## CI/CD Integration

Add to your CI pipeline:

**.github/workflows/setup-hooks.yml:**

```yaml
name: Setup Pre-commit Hooks
on: [pull_request]
jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: |
          npm install
          npm run lint
          npm run format:check
          npm run typecheck
```

## Customization After Installation

1. **Edit `scripts/pre-commit-config.js`** to:
   - Enable/disable specific checks
   - Adjust file size limits
   - Configure console log patterns
   - Set branch naming rules

2. **Modify linting rules** in `.eslintrc.json`

3. **Adjust formatting** in `.prettierrc.json`

4. **Configure TypeScript** in `tsconfig.json`

## Troubleshooting

If hooks don't run after installation:

```bash
# Reinstall Husky
rm -rf .husky
npx husky init
cp /path/to/pre-commit-hook-project/.husky/pre-commit .husky/

# Fix permissions
chmod +x .husky/pre-commit
chmod +x scripts/*.js
```

## Best Practices

1. **Version control the configuration** - Commit all config files
2. **Document exceptions** - Add comments when disabling checks
3. **Team onboarding** - Include setup in your README
4. **Regular updates** - Keep dependencies current
5. **Progressive adoption** - Start with warnings, then enforce
