module.exports = {
  checks: {
    eslint: {
      enabled: true,
      autoFix: true,
      blockCommit: true,
    },
    prettier: {
      enabled: true,
      autoFix: true,
      blockCommit: true,
    },
    typescript: {
      enabled: false, // Set to true to enable TypeScript checking
      strict: false,
      noEmit: true,
      blockCommit: true,
    },
    consoleLogs: {
      enabled: false,
      blockCommit: false,
      patterns: [
        /console\.(log|debug|info|warn|error|trace|dir|table|time|timeEnd|group|groupEnd)\(/g,
      ],
      allowedPatterns: [
        /\/\/ eslint-disable-next-line no-console/,
        /\/\* eslint-disable no-console \*\//,
        /logger\./,
        /winston\./,
      ],
    },
    fileSize: {
      enabled: true,
      blockCommit: true,
      limits: {
        default: '5mb',
        images: '2mb',
        '.png': '2mb',
        '.jpg': '2mb',
        '.jpeg': '2mb',
        '.gif': '3mb',
        '.svg': '500kb',
        '.ico': '100kb',
        videos: '50mb',
        documents: '10mb',
        '.pdf': '10mb',
        '.js': '1mb',
        '.ts': '1mb',
        '.css': '500kb',
      },
    },
    branchNaming: {
      enabled: true,
      blockCommit: false,
      pattern:
        /^(main|master|develop|staging|production|feature|bugfix|hotfix|release|chore)\/[a-z0-9-]+$/,
      allowedBranches: ['main', 'master', 'develop', 'staging', 'production'],
      message: 'Branch name should follow the pattern: type/description (e.g., feature/add-login)',
    },
    commitMessage: {
      enabled: true,
      blockCommit: true,
      pattern:
        /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.+\))?: .{1,100}$/,
      message: 'Commit message must follow Conventional Commits format',
      examples: [
        'feat: add user authentication',
        'fix(api): resolve memory leak in data processing',
        'docs: update README with installation steps',
      ],
    },
  },

  notifications: {
    enabled: true,
    showTips: true,
    showWarnings: true,
    showErrors: true,
  },

  performance: {
    parallel: true,
    maxWorkers: 4,
    timeout: 60000,
  },

  customHooks: {
    before: [],
    after: [],
  },
};
