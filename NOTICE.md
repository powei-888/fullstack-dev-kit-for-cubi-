# 第三方內容出處

下列 skill 的部分內容改寫自 [PinQiH/fullstack-dev-kit](https://github.com/PinQiH/fullstack-dev-kit)（commit `a34ae27`，MIT License）：

| 本 repo 的 skill | 來源 |
| --- | --- |
| `doc-style` | `plugins/workflow-core/skills/doc-style` |
| `nestjs-pitfalls` | `plugins/backend-node/skills/nestjs-guidelines/references` |
| `debugging` | `plugins/workflow-core/skills/debug` |
| `code-review` | `plugins/workflow-core/skills/code-review` |
| `testing-principles` | `plugins/backend-node/skills/test-backend`、`nestjs-guidelines/references/quality.md` |

改寫時移除了原 kit 的專案範本慣例（縮排、註解標記、回應格式、commit 格式、Repository 層主張），只保留與專案無關的部分。

## 為什麼移除原本的四個 plugin

原 kit 的 `workflow-core`、`backend-node`、`frontend-vue`、`python-toolkit` 內含特定專案範本的慣例。這些慣例與使用本 kit 的專案現況不同，直接安裝會讓 agent 收到互相矛盾的指示。需要原始內容時請使用上游 repo。

原授權聲明：

```text
MIT License

Copyright (c) 2026 PinChi Huang

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
