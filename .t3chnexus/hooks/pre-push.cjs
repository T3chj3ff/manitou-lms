#!/usr/bin/env node
/**
 * T3chNexus Pre-Push Hook
 * Checks if there are pending instincts in this repo.
 * If found, prompts the developer to submit them to the hive brain.
 *
 * Installed automatically by: t3chnexus-sync <repo>
 * Runs on: git push (before the push happens)
 */
const fs = require('node:fs');
const path = require('node:path');
const readline = require('node:readline');
const { execSync } = require('node:child_process');

const CWD = process.cwd();

// Locations where instincts may live
const INSTINCT_DIRS = [
  path.join(CWD, '.claude', 'homunculus', 'instincts', 'pending'),
  path.join(CWD, '.claude', 'instincts'),
  path.join(CWD, 'skills', 'continuous-learning-v2', 'instincts'),
];

// ─── Find pending instincts ────────────────────────────────────────────────
const pending = [];
for (const dir of INSTINCT_DIRS) {
  if (!fs.existsSync(dir)) continue;
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.yaml') || f.endsWith('.md'));
  for (const f of files) pending.push(path.join(dir, f));
}

// Nothing to report — proceed with push silently
if (pending.length === 0) {
  process.exit(0);
}

// ─── Prompt the developer ─────────────────────────────────────────────────
const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const CYAN   = '\x1b[36m';
const YELLOW = '\x1b[33m';
const GREEN  = '\x1b[32m';
const DIM    = '\x1b[2m';

process.stderr.write(
  `\n${CYAN}${BOLD}🧠 T3chNexus Hive Brain${RESET}\n` +
  `${YELLOW}You have ${pending.length} pending instinct(s) ready to share:${RESET}\n` +
  pending.map(f => `  ${DIM}→ ${path.basename(f)}${RESET}`).join('\n') +
  `\n\n${BOLD}Submit to the T3chNexus hive brain? [y/N]: ${RESET}`
);

// Need to read from /dev/tty directly so it works during git push
let answer = 'n';
try {
  // Read one line directly from the terminal, bypassing stdin which git has redirected
  answer = execSync('bash -c "read -r -n 1 ans </dev/tty && echo $ans"', {
    encoding: 'utf8',
    stdio: ['inherit', 'pipe', 'inherit'],
  }).trim().toLowerCase();
} catch {
  // If we can't get input, default to no
  answer = 'n';
}

process.stderr.write('\n');

if (answer !== 'y') {
  process.stderr.write(`${DIM}Skipped. You can submit later with: npx t3chnexus-learn --repo <project-name>${RESET}\n\n`);
  process.exit(0);
}

// ─── Auto-detect project name from package.json or folder name ────────────
let repoName = path.basename(CWD);
const pkgPath = path.join(CWD, 'package.json');
if (fs.existsSync(pkgPath)) {
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    if (pkg.name) repoName = pkg.name;
  } catch { /* use folder name */ }
}

// ─── Check for GITHUB_TOKEN ────────────────────────────────────────────────
if (!process.env.GITHUB_TOKEN) {
  process.stderr.write(
    `${YELLOW}⚠  GITHUB_TOKEN not set. Set it to enable automatic hive brain submissions:${RESET}\n` +
    `   export GITHUB_TOKEN=ghp_...\n\n` +
    `   Then re-run: ${BOLD}npx t3chnexus-learn --repo ${repoName}${RESET}\n\n`
  );
  process.exit(0);
}

// ─── Run learn-report.js ──────────────────────────────────────────────────
process.stderr.write(`${GREEN}Submitting instincts from '${repoName}' to T3chNexus hive brain...${RESET}\n\n`);

// Find learn-report.js relative to this hook file — it lives in t3chnexus/scripts/
const hookDir = path.dirname(process.argv[1]);
const learnReport = path.resolve(hookDir, '../../scripts/learn-report.js');

if (!fs.existsSync(learnReport)) {
  // Fallback: try npx
  try {
    execSync(`npx t3chnexus-learn --repo "${repoName}"`, { stdio: 'inherit' });
  } catch {
    process.stderr.write(`${YELLOW}Could not run learn-report. Submit manually: npx t3chnexus-learn --repo ${repoName}${RESET}\n`);
  }
} else {
  try {
    execSync(`node "${learnReport}" --repo "${repoName}"`, { stdio: 'inherit' });
  } catch {
    process.stderr.write(`${YELLOW}Submission failed. Try manually: npx t3chnexus-learn --repo ${repoName}${RESET}\n`);
  }
}

// Always exit 0 so the push is never blocked by the hook
process.exit(0);
