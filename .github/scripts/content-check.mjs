// Astrolay content-check (spike S3 prototype).
// Enforces astrolay.json on pull requests from people who aren't builders:
// only allowed collections, fields and media folders may change.
// No dependencies. Frontmatter parsing is line-based (top-level keys only);
// the product version will use a real YAML parser.
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';

export function frontmatter(src) {
  if (src == null) return null;
  const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { fields: {}, body: src };
  const fields = {};
  let key = null;
  for (const line of m[1].split(/\r?\n/)) {
    const top = line.match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (top) {
      key = top[1];
      fields[key] = top[2].trim();
    } else if (key) {
      fields[key] += '\n' + line; // continuation of a nested or multi-line value
    }
  }
  return { fields, body: m[2] };
}

function changedKeys(a, b) {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].filter((k) => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
}

const under = (path, dir) => path === dir || path.startsWith(dir.replace(/\/$/, '') + '/');

/**
 * @param contract parsed astrolay.json
 * @param author PR author login
 * @param changes [{ status: 'A'|'M'|'D'|'R', path, oldPath? }]
 * @param readBase / readHead (path) => string | null
 * @returns violations: [{ path, message }]
 */
export function checkChanges({ contract, author, changes, readBase, readHead }) {
  if ((contract.builders ?? []).includes(author)) return [];
  const client = contract.client ?? {};
  const collections = Object.entries(client.collections ?? {});
  const media = client.media ?? [];
  const violations = [];
  const fail = (path, message) => violations.push({ path, message });

  for (const change of changes) {
    const paths = change.status === 'R' ? [change.oldPath, change.path] : [change.path];
    if (paths.some((p) => p === 'astrolay.json' || under(p, '.github'))) {
      fail(change.path, 'Only builders can change astrolay.json or .github/.');
      continue;
    }
    if (paths.every((p) => media.some((dir) => under(p, dir)))) continue;

    const match = collections.find(([, c]) => (c.path && under(change.path, c.path)) || c.file === change.path);
    if (!match) {
      fail(change.path, 'This file is outside the content the client may edit.');
      continue;
    }
    const [name, c] = match;
    const allowed = new Set(c.fields ?? []);

    if (change.status === 'R') {
      fail(change.path, `Renaming entries in "${name}" is not allowed.`);
    } else if (c.file) {
      checkDataFile(name, c, allowed, readBase(change.path), readHead(change.path), change.path, fail);
    } else if (change.status === 'A') {
      if (!c.create) fail(change.path, `Creating entries in "${name}" is not allowed.`);
    } else if (change.status === 'D') {
      if (!c.delete) fail(change.path, `Deleting entries in "${name}" is not allowed.`);
    } else {
      const before = frontmatter(readBase(change.path));
      const after = frontmatter(readHead(change.path));
      for (const key of changedKeys(before.fields, after.fields)) {
        if (!allowed.has(key)) fail(change.path, `Field "${key}" in "${name}" is not editable.`);
      }
      if (before.body !== after.body && !c.body) fail(change.path, `The body of "${name}" entries is not editable.`);
    }
  }
  return violations;
}

function checkDataFile(name, c, allowed, baseSrc, headSrc, path, fail) {
  let base, head;
  try {
    base = baseSrc == null ? [] : JSON.parse(baseSrc);
    head = headSrc == null ? [] : JSON.parse(headSrc);
  } catch {
    return fail(path, `"${name}" is not valid JSON.`);
  }
  if (!Array.isArray(base) || !Array.isArray(head)) return fail(path, `"${name}" must be a JSON array.`);
  const key = c.key ?? 'id';
  const byKey = (items) => new Map(items.map((item) => [item?.[key], item]));
  const before = byKey(base);
  const after = byKey(head);
  for (const [id, item] of after) {
    const old = before.get(id);
    if (!old) {
      if (!c.create) fail(path, `Adding "${id}" to "${name}" is not allowed.`);
      continue;
    }
    for (const field of changedKeys(old, item)) {
      if (!allowed.has(field)) fail(path, `Field "${field}" of "${id}" in "${name}" is not editable.`);
    }
  }
  for (const id of before.keys()) {
    if (!after.has(id) && !c.delete) fail(path, `Removing "${id}" from "${name}" is not allowed.`);
  }
}

// ---- CLI (runs in GitHub Actions) ----
if (import.meta.url === `file://${process.argv[1]}`) {
  const base = process.env.BASE_SHA;
  const head = process.env.HEAD_SHA;
  const author = process.env.PR_AUTHOR;
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' });
  const show = (rev, path) => {
    try {
      return git('show', `${rev}:${path}`);
    } catch {
      return null;
    }
  };
  const contract = JSON.parse(show(base, 'astrolay.json'));
  const changes = git('diff', '--name-status', '-M', `${base}...${head}`)
    .trim()
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, a, b] = line.split('\t');
      return status.startsWith('R') ? { status: 'R', oldPath: a, path: b } : { status: status[0], path: a };
    });

  const violations = checkChanges({ contract, author, changes, readBase: (p) => show(base, p), readHead: (p) => show(head, p) });

  const summary = [`## Astrolay content check`, '', `Author: \`${author}\` · ${changes.length} changed file(s)`, ''];
  if (!violations.length) summary.push('✅ All changes are within the editing contract.');
  else {
    summary.push('❌ Some changes are outside what this role may edit:', '');
    for (const v of violations) {
      summary.push(`- \`${v.path}\`: ${v.message}`);
      console.log(`::error file=${v.path}::${v.message}`);
    }
  }
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary.join('\n') + '\n');
  console.log(summary.join('\n'));
  process.exit(violations.length ? 1 : 0);
}
