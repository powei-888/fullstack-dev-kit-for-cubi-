---
name: nestjs-pitfalls
description: "撰寫或審查 NestJS controller 路由、module 與 provider 註冊、guard、交易內的 TypeORM 查詢或 migration 時使用。列出會無聲失敗的框架行為。"
---

# NestJS 踩坑提醒

以下是 NestJS 與 TypeORM 的框架行為，共同點是寫錯時不會報錯。它們不是分層或命名規範；專案的架構規則依專案 `AGENTS.md`。

## 路由與註冊

- **靜態路徑宣告在動態參數之前**。`@Delete(':id')` 寫在 `@Delete('completed')` 上面時，`completed` 會被當成 id，錯誤訊息只會說 id 格式不對。
- **需要注入依賴的全域 filter、guard、interceptor、pipe 用 `APP_FILTER`、`APP_GUARD`、`APP_INTERCEPTOR`、`APP_PIPE` 註冊**。用 `app.useGlobal*(new X())` 建立的實例不在 DI 容器內，注入的依賴是 `undefined`。
- **多個 `APP_GUARD` 依 providers 陣列順序執行**。需要 `request.user` 的 guard 必須排在建立使用者身分的 guard 之後。
- **沒有 export 的 provider 是模組私有的**，外部注入會在啟動時失敗。這是邊界生效，不要用 `@Global()` 繞過。
- **`@Global()` 只給基礎設施**。業務模組標 `@Global()` 會讓依賴關係變得看不見。
- **`forRootAsync` 的 `useFactory` 只看得到自己的 `imports`**。要注入自訂 provider 時，把它包成獨立模組再 import。

## TypeScript

- **當作 DI token 或執行期需要的 class 不可改成 `import type`**；純型別才用 `import type`。改錯時編譯會過，執行期才出錯。
- **裝飾器在 class 定義時求值，那時 DI 容器還不存在**。裝飾器參數需要設定值時，只能用模組層常數，不能注入。

## 交易

- **TypeORM 的 repository 不會自動加入外層交易**。交易內的讀與寫都要用該交易的 `EntityManager`／`QueryRunner`。混用連線池 repository 時程式照跑、測試照過，回滾時才發現有資料沒退回。
- **交易內讀取剛寫入的資料也要走同一個交易連線**，否則未 commit 的資料查不到。
- **「先記錄再拋錯」不能包在會回滾的交易內**。例如失敗計數，例外回滾後計數就消失了。
- **純查詢不需要包交易**，只會多一次往返。

## 查詢與 Entity

- **`select` 明確列欄位時，漏列的欄位是 `undefined` 而不是錯誤**。新增欄位後檢查所有明確列欄位的查詢。
- **`repository.delete(criteria)` 不觸發 entity 生命週期**，依賴 subscriber 的稽核或同步不會執行。

## Migration

- **新增有業務語意的欄位時，先確認既有資料的真實值**：先可空、回填、再加 `NOT NULL`。直接 `DEFAULT now()` 會寫入假的歷史值。
- **Migration 不 import 應用程式常數**。Migration 是歷史紀錄，常數之後會變，耦合會改變已執行 migration 的語意。
- **Migration 內的值也用參數化查詢**，即使目前是固定字串。

## 測試

- **測試與正式啟動共用同一份 app 設定程式**。測試自行重建 middleware 與 guard 接線會逐漸漂移。
- **純 ESM 套件在 Jest 出現 `Unexpected token 'export'` 時，檢查 `transformIgnorePatterns`**，單元與 e2e 兩份設定都要改。
