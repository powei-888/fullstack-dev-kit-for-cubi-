# fullstack-dev-kit-for-cubi

跨 Claude Code、Codex、Antigravity 共用的通用開發工作流 plugin。

## 這個 repo 放什麼、不放什麼

| 放這裡 | 不放這裡 |
| --- | --- |
| 換到任何專案都成立的做事方法：怎麼除錯、怎麼自我審查、怎麼寫測試 | 只有某個專案才成立的規則：架構邊界、API 格式、命名、縮排、commit 格式 |

專案規則放在各專案 repo 的 `AGENTS.md` 與專案 skill，跟著分支與 PR 走。本 plugin 的每個 skill 都寫明「專案規範優先」，兩者衝突時以專案為準。

## Skills

Plugin 名稱是 `dev-workflow`。

| Skill | 用途 |
| --- | --- |
| `debugging` | 重現、蒐證、假設、驗證、修根因、補測試 |
| `self-review` | 回報完成或 commit 前檢查差異，分開回報已驗證與未驗證 |
| `code-review` | 唯讀審查流程、檢查清單、嚴重程度、輸出格式 |
| `testing-principles` | 測試放哪一層、mock 邊界、單元測試驗不到什麼 |
| `nestjs-pitfalls` | NestJS 與 TypeORM 會無聲失敗的框架行為 |
| `doc-style` | 繁體中文技術文件的句子、步驟、用詞寫法 |

三個平台都會依 skill 的 `description` 自動判斷是否載入，也可以直接指名。

## 安裝

下列指令直接從 GitHub 安裝。本機開發時把 `powei-888/fullstack-dev-kit-for-cubi-` 換成本 repo 的絕對路徑。

### Claude Code

```text
/plugin marketplace add powei-888/fullstack-dev-kit-for-cubi-
/plugin install dev-workflow@cubi-agent-kit
```

### Codex

```powershell
codex plugin marketplace add powei-888/fullstack-dev-kit-for-cubi-
codex plugin add dev-workflow@cubi-agent-kit
```

### Antigravity

```powershell
git clone https://github.com/powei-888/fullstack-dev-kit-for-cubi-.git
agy plugin validate --strict .\fullstack-dev-kit-for-cubi-\plugins\dev-workflow
agy plugin install .\fullstack-dev-kit-for-cubi-\plugins\dev-workflow
```

`cubi-agent-kit` 是 marketplace 的名稱，定義在 `scripts/build-manifests.cjs`。

安裝或更新後開新的對話，讓工具重新載入 skill。

## 尚未實機驗證

建立這個 repo 的機器上沒有安裝 `claude`、`codex`、`agy` 指令，所以三個平台的安裝都還沒有實際跑過。第一次安裝時請確認：

1. 安裝指令沒有回報 manifest 錯誤。
2. skill 列表看得到上表 6 個 skill。
3. 輸入「幫我找出這個錯誤的根因」時會載入 `debugging`。

Codex 與 Antigravity 的 manifest 欄位依各自官方文件與既有範例撰寫；格式若有出入，修改 `scripts/build-manifests.cjs` 後重新產生。

## 維護

所有 manifest 由一支腳本產生，不要手改：

```powershell
node scripts/build-manifests.cjs
node scripts/build-manifests.cjs --check
```

- 升版：改腳本內的 `version`，重新產生。
- 新增 skill：建立 `plugins/dev-workflow/skills/<name>/SKILL.md`，資料夾名稱必須等於 frontmatter 的 `name`。
- 新增 skill 前先問：這條規則換一個專案還成立嗎？不成立就應該放進該專案的 repo。

## 出處

本 repo 是 `PinQiH/fullstack-dev-kit` 的 fork，沿用 MIT 授權（見 [LICENSE](LICENSE)）。原 kit 的四個 plugin 已移除，原因與各 skill 的出處見 [NOTICE.md](NOTICE.md)。
