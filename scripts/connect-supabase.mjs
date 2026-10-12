// Sets up the hosted Supabase project named in .env so it matches this repo.
// Usage: put SUPABASE_URL=https://<project-ref>.supabase.co in .env, then: npm run db:connect [-- --seed]
//        (or pass the ref directly: npm run db:connect -- <project-ref> [--seed])
// Needs `npx supabase login` first. Uses SUPABASE_DB_PASSWORD from .env, or asks for it.
//   1. links the project              (supabase link)
//   2. applies supabase/migrations/   (supabase db push; --seed also loads supabase/seed.sql opening stock)
//   3. applies the [auth] settings and email templates in supabase/config.toml (supabase config push)
//   4. fills in SUPABASE_PUBLISHABLE_KEY / SUPABASE_SECRET_KEY in .env if they are blank or from another project
// Safe to rerun: migrations and config are only applied when they differ.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

if (existsSync('.env')) process.loadEnvFile('.env');

const hostedUrl = /^https:\/\/([a-z]{20})\.supabase\.co\/?$/;
const argRef = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
const ref = argRef ?? process.env.SUPABASE_URL?.match(hostedUrl)?.[1];
const seed = process.argv.includes('--seed');
const cli = join('node_modules', '.bin', 'supabase');

if (!ref || !/^[a-z]{20}$/.test(ref)) {
  console.error(`SUPABASE_URL in .env is ${process.env.SUPABASE_URL ? `"${process.env.SUPABASE_URL}"` : 'not set'}, which is not a hosted project.`);
  console.error('Set it to https://<project-ref>.supabase.co (Project Settings → Data API → Project URL), then run this again.');
  process.exit(1);
}

function run(args, { capture = false, allowFailure = false } = {}) {
  console.log(`\n→ supabase ${args.join(' ')}`);
  const result = spawnSync(cli, args, { stdio: capture ? ['inherit', 'pipe', 'pipe'] : 'inherit', encoding: 'utf8' });
  if (result.status !== 0 && !allowFailure) {
    if (capture) console.error(result.stdout, result.stderr);
    console.error(`\nStopped: \`supabase ${args[0]}\` failed. Fix the error above, then run this again.`);
    process.exit(1);
  }
  return result;
}

run(['link', '--project-ref', ref]);
run(['db', 'push', '--yes', ...(seed ? ['--include-seed'] : [])]);

// Free-tier projects on Supabase's built-in email sender reject custom email templates, and with them the whole
// auth update. Retry without the templates so the Site URL and redirect URLs still apply; /account/confirm
// handles the default templates' links too.
const push = run(['config', 'push', '--project-ref', ref, '--yes'], { capture: true, allowFailure: true });
const output = `${push.stdout}${push.stderr}`;
if (push.status !== 0 && /Email template modification is not available/.test(output)) {
  const workdir = mkdtempSync(join(tmpdir(), 'supabase-config-'));
  mkdirSync(join(workdir, 'supabase'));
  const config = readFileSync(join('supabase', 'config.toml'), 'utf8').replace(/^\[auth\.email\.template\.[^\]\n]+\]\n(?:[^\n#[][^\n]*\n)*/gm, '');
  writeFileSync(join(workdir, 'supabase', 'config.toml'), config);
  console.log('\nThis project only allows Supabase\'s default email templates (set up custom SMTP to use the branded ones).');
  run(['config', 'push', '--project-ref', ref, '--yes', '--workdir', workdir]);
} else if (push.status !== 0) {
  console.error(output, '\nStopped: `supabase config push` failed. Fix the error above, then run this again.');
  process.exit(1);
} else {
  console.log(output);
}

// Keep keys already in .env when they belong to this project (new or legacy ones); otherwise use the project's own.
const keys = JSON.parse(run(['projects', 'api-keys', '--project-ref', ref, '--reveal', '--output', 'json'], { capture: true }).stdout);
const projectKeys = new Set(keys.map((key) => key.api_key));
const keyOf = (type) => keys.find((key) => key.type === type)?.api_key;
const pick = (name, type) => (projectKeys.has(process.env[name]) ? process.env[name] : keyOf(type));
const values = {
  SUPABASE_URL: `https://${ref}.supabase.co`,
  SUPABASE_PUBLISHABLE_KEY: pick('SUPABASE_PUBLISHABLE_KEY', 'publishable'),
  SUPABASE_SECRET_KEY: pick('SUPABASE_SECRET_KEY', 'secret'),
};
if (!values.SUPABASE_PUBLISHABLE_KEY || !values.SUPABASE_SECRET_KEY) {
  console.error('\nThe project has no publishable/secret API keys yet. Create them in Project Settings → API Keys, then run this again.');
  process.exit(1);
}

// Replace the active line for each variable (or append it), leaving every other line in .env untouched.
let env = existsSync('.env') ? readFileSync('.env', 'utf8') : readFileSync('.env.example', 'utf8');
for (const [name, value] of Object.entries(values)) {
  const line = new RegExp(`^${name}=.*$`, 'm');
  env = line.test(env) ? env.replace(line, `${name}=${value}`) : `${env.trimEnd()}\n${name}=${value}\n`;
  if (process.env[name] !== value) console.log(`.env: ${name} ${process.env[name] ? 'updated' : 'set'} for this project`);
}
writeFileSync('.env', env);

console.log(`\nReady: ${values.SUPABASE_URL}. Restart \`npm run dev\` to pick it up.`);
