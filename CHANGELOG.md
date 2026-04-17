# Changelog

所有版本的重要變更記錄於此。格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)。

---

## [1.3.0] — 2026-04-17

### Added
- **聲調練習**：學習一二三四聲與輕聲，含示範頁與 10 題測驗，依答對率給予星星獎勵
- **每日複習（Spaced Repetition）**：首頁顯示今日應複習符號，依上次複習時間與熟練度自動排程
- **拼音組合練習**：聲母＋韻母拼合練習，分初級／中級／進階三組，支援提示功能（扣星）
- **學習模式分離**：學習頁新增「發音」與「寫字」模式切換 Tab，讓幼兒每次只專注一件事

### Changed
- 學習卡與筆順練習區所有說明文字改為 SVG 圖示，降低幼兒閱讀負擔
  - 翻面提示改脈動箭頭動畫、播放／完成／寫字按鈕改圓形純圖示
  - 示範／重播／練習按鈕改圓形圖示；手寫提示改鉛筆圖示；清除／參考改圖示切換
  - 遊戲頁移除說明文字，只保留遊戲名稱與圖示
- 手寫練習畫布從固定 200px 改為 `width: 100%` + `aspect-ratio: 1/1`，手機書寫區域明顯放大

---

## [1.2.0] — 2026-04-15

### Added
- 第三步「寫字練習」：筆畫動畫逐步示範，支援手寫練習與筆畫評分
- 手寫練習區：Canvas 手寫辨識，依筆畫路徑給予相似度評分

### Fixed
- 重整頁面於 GitHub Pages sub-path（`/learn`、`/games` 等）不再出現 404
  - 新增 `404.html` redirect trick + Service Worker navigation fallback
- `manifest.json` `start_url` 修正為正確的 base path
- 學習卡按鈕文字被裁切與視窗忽大忽小問題
- BGM 首次互動無聲：等待 `AudioContext.resume()` 完成後才播放
- BGM fade-in 失效：改以 `play` 事件觸發 fade，避免 Howler `_playLock`
- Service Worker 過濾 `chrome-extension://` scheme，消除 Cache API 錯誤
- Service Worker fetch handler 加入 `.catch()` 防止 Uncaught promise rejection

### Performance
- 首頁入場動畫加入 `will-change: transform, opacity`，預先提升 GPU layer
- Owl 無限浮動動畫延遲 0.6s 啟動，避免與入場動畫搶佔同一幀
- 背景裝飾容器加 `contain: strict` + `translateZ(0)` 隔離 paint

### Changed
- 37 個注音符號筆順 SVG 路徑全數重寫，改用 midpoint Q-spline 消除折角抖動
- Service Worker 升版至 `bopomoo-v3`

---

## [1.1.0] — 2026-01-xx

### Added
- 認識發音與詞彙步驟改為卡片翻轉效果，增加互動趣味性

---

## [1.0.1] — 2025-xx-xx

### Fixed
- GitHub Pages base path 設定錯誤導致音效資源 404

---

## [1.0.0] — 2025-xx-xx

### Added
- 背景音樂（BGM）系統：循環播放，支援淡入淡出
- 音效系統：點擊、翻牌、答對/答錯、星星、倒數等全套音效
- 音效設定面板：可獨立控制 BGM / 音效 開關與音量
- PWA 支援：離線快取、可安裝至主畫面

### Fixed
- `AudioContext` 洩漏與 React `setState` 反模式
- GitHub Pages base path 導致資源路徑錯誤

---

## [0.1.0] — 初始版本

### Added
- 37 個注音符號學習卡（ㄅ～儿）
- 三款互動遊戲：聆聽點選、拖拉配對、翻牌記憶
- 學習進度追蹤（Zustand + localStorage 持久化）
- 星星獎勵系統
- 響應式 PWA 設計，支援手機觸控
