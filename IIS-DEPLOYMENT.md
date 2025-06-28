# IIS 部署指南

## 部署步驟

### 1. 建置專案
```bash
npm run build:iis
```

### 2. IIS 設定
1. 在 IIS 管理員中創建新的網站或應用程式
2. 將 `dist` 資料夾的內容複製到 IIS 網站根目錄
3. 確保 `web.config` 檔案存在於根目錄

### 3. 應用程式集區設定
1. 開啟 IIS 管理員
2. 選擇您的應用程式集區
3. 設定 .NET CLR 版本為「沒有 Managed 程式碼」
4. 設定 Managed 管線模式為「整合式」

### 4. 必要的 IIS 功能
確保已安裝以下 IIS 功能：
- 靜態內容
- 預設文件
- HTTP 錯誤
- URL 重寫模組 (重要！)

### 5. URL 重寫模組安裝
如果尚未安裝 URL 重寫模組：
1. 下載並安裝 [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite)
2. 重新啟動 IIS

### 6. 權限設定
確保 IIS_IUSRS 對網站目錄有讀取權限：
1. 右鍵網站目錄 → 內容 → 安全性
2. 確保 IIS_IUSRS 有「讀取及執行」權限

## 故障排除

### 403.18 錯誤
- 確保應用程式集區設定為「沒有 Managed 程式碼」
- 確保已安裝 URL 重寫模組
- 檢查 web.config 檔案是否存在且格式正確

### 404 錯誤
- 確保 URL 重寫規則正確設定
- 確保預設文件設定為 index.html

### 靜態資源載入失敗
- 檢查 MIME 類型設定
- 確保靜態內容功能已啟用

## 測試
部署完成後，測試以下路由：
- `/` - 應該重導向到登入頁面
- `/login` - 登入頁面
- `/dashboard` - 儀表板（需要登入）
- `/products` - 商品列表（需要登入）
- `/history` - 兌換紀錄（需要登入）

所有路由都應該正常顯示，不會出現 404 錯誤。
