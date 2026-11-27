#!/usr/bin/env node
/**
 * 維護註解：由下方單一設定產生三種 agent 的 plugin 設定檔，並檢查 skill 是否符合封裝契約。
 *
 * 責任：寫出 Claude Code、Codex、Antigravity 各自的 manifest 與 marketplace 檔，確保三邊的
 * 名稱、版本、說明一致；檢查每個 skill 的資料夾名稱等於 frontmatter 的 `name`，且有 `description`。
 * 非責任：不驗證各平台的完整 schema，也不取代實際安裝測試。
 * 用法：
 *   node scripts/build-manifests.cjs          產生／覆寫
 *   node scripts/build-manifests.cjs --check  只檢查，有差異或問題時 exit 1
 * 改動風險：改 plugin 名稱會改變 skill 的呼叫名稱（例如 `/dev-workflow:debugging`），已安裝的人要重裝。
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const kit = { name: 'cubi-agent-kit', displayName: 'CUBI Agent Kit', owner: 'CUBI Team' };
const plugin = {
  name: 'dev-workflow',
  displayName: 'Dev Workflow',
  version: '0.1.0',
  dir: 'plugins/dev-workflow',
  short: '與專案無關的通用開發工作流。',
  description: '與專案無關的通用開發工作流：除錯、完成前自我審查、code review 流程、測試原則、NestJS 踩坑提醒、技術文件寫法。專案規則請放在各專案的 AGENTS.md。',
  keywords: ['workflow', 'debugging', 'code-review', 'testing', 'nestjs', 'documentation'],
};

const json = (value) => JSON.stringify(value, null, 2) + '\n';

const files = {
  '.claude-plugin/marketplace.json': json({
    name: kit.name,
    owner: { name: kit.owner },
    description: '跨 Claude Code、Codex、Antigravity 共用的通用開發工作流。',
    plugins: [{ name: plugin.name, source: `./${plugin.dir}`, version: plugin.version, description: plugin.description }],
  }),
  '.agents/plugins/marketplace.json': json({
    name: kit.name,
    interface: { displayName: kit.displayName },
    plugins: [{
      name: plugin.name,
      source: { source: 'local', path: `./${plugin.dir}` },
      policy: { installation: 'AVAILABLE', authentication: 'ON_INSTALL' },
      category: 'Developer Tools',
    }],
  }),
  [`${plugin.dir}/.claude-plugin/plugin.json`]: json({
    name: plugin.name, version: plugin.version, description: plugin.description,
    author: { name: kit.owner }, keywords: plugin.keywords,
  }),
  [`${plugin.dir}/.codex-plugin/plugin.json`]: json({
    name: plugin.name, version: plugin.version, description: plugin.description,
    author: { name: kit.owner }, keywords: plugin.keywords, skills: './skills/',
    interface: {
      displayName: plugin.displayName, shortDescription: plugin.short, longDescription: plugin.description,
      developerName: kit.owner, category: 'Developer Tools', capabilities: ['Skills'],
    },
  }),
  [`${plugin.dir}/.antigravity-plugin/plugin.json`]: json({
    name: plugin.name, version: plugin.version, description: plugin.description,
  }),
};

function checkSkills(problems) {
  const skillsDir = path.join(root, plugin.dir, 'skills');
  const names = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name);
  for (const name of names) {
    const file = path.join(skillsDir, name, 'SKILL.md');
    if (!fs.existsSync(file)) { problems.push(`${name}: missing SKILL.md`); continue; }
    const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
    const front = text.match(/^---\n([\s\S]*?)\n---\n/);
    if (!front) { problems.push(`${name}: missing frontmatter`); continue; }
    const declared = (front[1].match(/^name:\s*(.+)$/m) || [])[1];
    const description = (front[1].match(/^description:\s*(.+)$/m) || [])[1];
    if (!declared || declared.trim() !== name) problems.push(`${name}: frontmatter name must equal folder name`);
    if (!description || description.trim().length < 20) problems.push(`${name}: description missing or too short`);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) problems.push(`${name}: folder name must be lowercase kebab-case`);
  }
  return names;
}

function main() {
  const check = process.argv.includes('--check');
  const problems = [];
  for (const [relative, expected] of Object.entries(files)) {
    const file = path.join(root, relative);
    if (check) {
      const actual = fs.existsSync(file) ? fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n') : null;
      if (actual !== expected) problems.push(`out of sync: ${relative}`);
    } else {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, expected, 'utf8');
    }
  }
  const names = checkSkills(problems);
  if (problems.length > 0) {
    console.error(`Found ${problems.length} problem(s):`);
    for (const problem of problems) console.error(`- ${problem}`);
    process.exit(1);
  }
  console.log(`${check ? 'In sync' : 'Written'}: ${Object.keys(files).length} manifests, ${names.length} skills (${names.join(', ')}).`);
}

main();
