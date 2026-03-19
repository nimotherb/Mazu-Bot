# 蓬萊：媽祖陪伴機器人 (MVP) - 實作紀錄

## 完成項目 (Changes Made)

### 第一階段：MVP 起步
1. **角色設定檔 (SPEC.md)**：已將翰翰提供的「大稻埕慈聖宮媽祖」四步驟對話核心守則、人格設定與隱含命理推演邏輯，完整寫入供後端讀取。
2. **後端架構 (FastAPI + Gemini)**：
   - 建立 Python 虛擬環境與 [main.py](file:///c:/Users/user/Desktop/Project%20Mo/backend/main.py)，串接 `google-genai` SDK，並將 [SPEC.md](file:///c:/Users/user/Desktop/Project%20Mo/SPEC.md) 作為 System Prompt 載入。

### 第二階段：真實運算與禪風改版
3. **前端視覺與互動翻新 (React + 傳統 CSS)**：
   - 移除寫死的假資料，新增「結緣入陣」表單，讓使用者輸入真實的姓名、性別、出生年月與地點。
   - 翻新「道賽博」視覺，從深色迷霧轉為**淺色系「禪風天空雲層流動」**。
   - 聊天室與表單採用高級感的**毛玻璃擬物化 (Glassmorphism)**，搭配明亮的紅色發光字體，強調空靈與寧靜。
4. **真實八字與星盤運算 (Python Backend)**：
   - 引入純 Python 的星曆套件 `lunar_python`。
   - 後端會精確將前端送來的西元生日自動轉換為**天干地支 (八字)**與**農曆日期**，並自行計算**太陽星座**。
5. **真實六十甲子籤詩系統 (Mazu Lottery Database)**：
   - 在後端建立了 [mazu_lottery.json](file:///c:/Users/user/Desktop/Project%20Mo/backend/mazu_lottery.json) 籤詩庫。
   - 當使用者訊息觸發「求籤」、「指引」等關鍵字時，**後端會直接抽出真實的籤詩 (籤號、原詩、白話意義)**，並注入到 `user_data` 中，強制 Gemini 根據這支既定的籤進行解答，徹底解決 AI 憑空捏造籤詩的問題。
6. **一鍵啟動腳本 (start.bat)**：撰寫了友善的批次檔，協助使用者自動開啟雙伺服器。

## 測試與驗證結果 (Validation Results)
- ✅ **API Key 與環境驗證**：使用者已成功在 [.env](file:///c:/Users/user/Desktop/Project%20Mo/backend/.env) 中填入正確的 Gemini API Key。前後端伺服器皆能順利在背景長駐。
- ✅ **表單綁定與視覺渲染**：`http://127.0.0.1:3000` 首頁的結緣表單順利載入，填寫送出後流暢切換為毛玻璃聊天室，背景流動雲層動畫滑順優雅。
- ✅ **命理與抽籤測試**：
  - 後端成功攔截生日資料並轉為精確的農曆與八字送給 Gemini。
  - 當發送求籤指令時，後端正確抽出了真實籤詩，默姊姊也依據該籤（例如：丁未籤，太公家業八十成...）做出了充滿同理心與安撫性質的完美白話解說。

> [!TIP]
> 目前專案可於桌面 `Project Mo` 資料夾中找到。日後若要啟動，只需直接點擊 [start.bat](file:///c:/Users/user/Desktop/Project%20Mo/start.bat) 即可！
