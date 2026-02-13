# Zoom REST API Tester - Server to Server Ver

Zoom REST APIをテストするためのChrome拡張機能です。Server-to-Server OAuth認証を使用してAPIリクエストを実行できます。

## 機能

- Server-to-Server OAuth認証によるアクセストークン取得
- Zoom公式API Specから動的にAPI仕様を取得
- 全35カテゴリ、数百のAPIエンドポイントを自動網羅
- Swagger風のAPI一覧表示
- カテゴリ別・検索によるAPIフィルタリング
- パラメータ入力フォーム
- APIリクエストの実行と結果表示
- Granular Scopes対応
- 独立ウィンドウで起動（サイズ制限なし）
- API Specのキャッシュと自動更新

## インストール方法

1. このリポジトリをクローンまたはダウンロード
   ```bash
   git clone https://github.com/bitzed/zoom-restapi-tester.git
   ```

2. Chromeで `chrome://extensions/` を開く

3. 右上の「デベロッパーモード」をONにする

4. 「パッケージ化されていない拡張機能を読み込む」をクリック

5. ダウンロードしたフォルダを選択

## 使用方法

### 1. 認証情報の設定

1. 拡張機能アイコンをクリックして独立ウィンドウを開く
2. 右上の歯車アイコン（Settings）をクリック
3. Zoom Server-to-Server OAuthアプリの認証情報を入力:
   - **Account ID**: ZoomアカウントID
   - **Client ID**: OAuthアプリのクライアントID
   - **Client Secret**: OAuthアプリのクライアントシークレット
4. 「Save Settings」をクリック

### 2. アクセストークンの取得

1. 「Get Access Token」ボタンをクリック
2. 認証成功後、ステータスが「Authenticated」に変わる
3. トークンは自動的にローカルストレージに保存される（1時間有効）

### 3. APIのテスト

1. **Group** を選択（Workplace, Business Services, Accounts等）
2. **Category** を選択（Meetings, Users, Phone等）
   - 初回選択時、Zoom公式サイトからAPI Specを自動取得
   - 取得したSpecはキャッシュされ、次回以降は即座に表示
3. 検索でAPIを絞り込む
4. テストしたいAPIをクリック
5. 詳細パネルで:
   - **Required Granular Scopes**: 必要なGranular Scopesを確認
   - **Path Parameters**: パスパラメータを入力
   - **Query Parameters**: クエリパラメータを入力
   - **Request Body**: リクエストボディ（POST/PUT/PATCHの場合）を入力
6. 「Execute Request」をクリック
7. レスポンスが下部に表示される

### 4. API Specの更新

- カテゴリ選択後、更新ボタン（🔄）をクリックすると最新のSpecを再取得
- キャッシュは7日間有効。期限切れ後は自動的に再取得

## Zoom Server-to-Server OAuthアプリの作成

1. [Zoom App Marketplace](https://marketplace.zoom.us/) にログイン
2. 「Develop」→「Build App」をクリック
3. 「Server-to-Server OAuth」を選択して作成
4. 必要なScopes（Granular Scopes）を追加:
   - 例: `user:read:list_users:admin`（ユーザー一覧取得用）
5. Account ID、Client ID、Client Secretをコピー

## 対応APIカテゴリ

### Workplace
- Meetings, Team Chat, Phone, Mail, Calendar, Scheduler
- Rooms, Clips, Whiteboard, CRC, Chatbot
- AI Companion, Zoom Docs, Tasks

### Business Services
- Contact Center, Webinars Plus & Events, Virtual Agent
- Revenue Accelerator, Number Management, Quality Management
- Workforce Management, Commerce, Healthcare
- Video Management, Auto Dialer

### Accounts
- Users, Accounts, QSS, SCIM 2

### Build Platform
- Video SDK, Cobrowse SDK

### Marketplace
- Apps

## プロジェクト構成

```
zoom-restapi-tester/
├── manifest.json          # Chrome拡張機能マニフェスト
├── popup.html             # メインUI
├── popup.js               # UIロジック
├── api-spec-loader.js     # API Spec動的ローダー
├── styles.css             # スタイルシート
├── background.js          # Service Worker
├── icons/                 # アイコン画像
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## 技術詳細

### API Spec取得の仕組み

1. ユーザーがカテゴリを選択
2. `https://developers.zoom.us/api-hub/{category}/methods/endpoints.json` からOpenAPI 3.0形式のSpecを取得
3. OpenAPI形式を内部形式にパースし、`chrome.storage.local` にキャッシュ
4. Granular Scopes（4セグメント形式）のみを抽出して表示

### キャッシュ管理

- キャッシュキー: `apiSpec_{category-slug}`
- 有効期限: 7日間
- 手動更新: 更新ボタンで強制再取得可能

## Granular Scopesの形式

Granular Scopesは以下の形式で記述されています:

```
{resource}:{permission}:{action}:{level}
```

例:
- `user:read:list_users:admin` - 管理者レベルでユーザー一覧を読み取る
- `meeting:write:meeting:admin` - 管理者レベルでミーティングを作成/更新する
- `phone:read:call_log:admin` - 管理者レベルで通話履歴を読み取る

## 注意事項

- アクセストークンは1時間で期限切れになります
- Client Secretは安全に保管してください
- 本番環境のAPIを叩く際は十分注意してください
- 拡張機能アイコンを再度クリックすると、既存のウィンドウにフォーカスします
- API Spec取得には初回のみネットワーク接続が必要です

## ライセンス

MIT License
