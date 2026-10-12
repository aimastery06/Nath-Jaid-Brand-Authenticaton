// Pre-launch check (AGENT.md, Phase 2). Fails while brand facts are pending, policies are drafts,
// or a secret appears in the client-side build output.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const problems = [];

// 1. Company details still marked pending in brand/README.md
const readme = readFileSync('brand/README.md', 'utf8');
for (const line of readme.split('\n')) {
  if (line.startsWith('|') && /pending confirmation/i.test(line)) {
    problems.push(`brand/README.md: confirm "${line.split('|')[1].trim()}"`);
  }
}

// 2. Draft policies
for (const file of readdirSync('brand/policies').filter((f) => f.endsWith('.md') && f !== 'README.md')) {
  const text = readFileSync(join('brand/policies', file), 'utf8');
  if (/^status:\s*draft\s*$/m.test(text)) problems.push(`brand/policies/${file}: still a draft`);
}

// 3. Secrets in files served to browsers
const clientDirs = ['.vercel/output/static', 'dist/client'].filter((dir) => existsSync(dir));
const secretPatterns = [/sk_(live|test)_[A-Za-z0-9]{10,}/, /rk_(live|test)_[A-Za-z0-9]{10,}/, /whsec_[A-Za-z0-9]{10,}/, /sb_secret_[A-Za-z0-9_-]{10,}/, /"role"\s*:\s*"service_role"/];
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
if (clientDirs.length === 0) {
  problems.push('No build output to scan for secrets. Run `npm run build` first.');
}
for (const path of clientDirs.flatMap(walk).filter((p) => /\.(js|mjs|html|css|json|map)$/.test(p))) {
  const text = readFileSync(path, 'utf8');
  if (secretPatterns.some((pattern) => pattern.test(text))) problems.push(`${path}: contains what looks like a secret key`);
}

if (problems.length) {
  console.error(`Not ready for live payments:\n${problems.map((p) => `  • ${p}`).join('\n')}`);
  process.exit(1);
}
console.log('Launch check passed.');
