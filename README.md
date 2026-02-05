# Zoom REST API Tester

Zoom REST APIをテストするためのChrome拡張機能です。Server-to-Server OAuth認証を使用してAPIリクエストを実行できます。

## 機能

- Server-to-Server OAuth認証によるアクセストークン取得
- Swagger風のAPI一覧表示
- カテゴリ別・検索によるAPIフィルタリング
- パラメータ入力フォーム
- APIリクエストの実行と結果表示
- Granular Scopes対応

## インストール方法

1. このリポジトリをクローンまたはダウンロード
   ```bash
   git clone <repository-url>
   ```

2. Chromeで `chrome://extensions/` を開く

3. 右上の「デベロッパーモード」をONにする

4. 「パッケージ化されていない拡張機能を読み込む」をクリック

5. ダウンロードしたフォルダを選択

## 使用方法

### 1. 認証情報の設定

1. 拡張機能アイコンをクリックしてポップアップを開く
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

1. カテゴリを選択または検索でAPIを絞り込む
2. テストしたいAPIをクリック
3. 詳細パネルで:
   - **Required Scopes**: 必要なGranular Scopesを確認
   - **Path Parameters**: パスパラメータを入力
   - **Query Parameters**: クエリパラメータを入力
   - **Request Body**: リクエストボディ（POST/PUT/PATCHの場合）を入力
4. 「Execute Request」をクリック
5. レスポンスが下部に表示される

## Zoom Server-to-Server OAuthアプリの作成

1. [Zoom App Marketplace](https://marketplace.zoom.us/) にログイン
2. 「Develop」→「Build App」をクリック
3. 「Server-to-Server OAuth」を選択して作成
4. 必要なScopes（Granular Scopes）を追加:
   - 例: `user:read:list_users:admin`（ユーザー一覧取得用）
5. Account ID、Client ID、Client Secretをコピー

## プロジェクト構成

```
zoom-restapi-tester/
├── manifest.json          # Chrome拡張機能マニフェスト
├── popup.html             # ポップアップUI
├── popup.js               # メインロジック
├── styles.css             # スタイルシート
├── background.js          # Service Worker
├── icons/                 # アイコン画像
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── specs/                 # API仕様ファイル
    ├── index.js           # メインローダー
    ├── workplace-meetings.js
    ├── workplace-team-chat.js
    ├── workplace-phone.js
    ├── workplace-cloud-recording.js
    ├── workplace-reports.js
    ├── business-webinars.js
    ├── accounts-users.js
    ├── accounts-accounts.js
    ├── accounts-groups.js
    └── accounts-roles.js
```

## API Specの追加方法

新しいAPIカテゴリを追加する手順:

### 1. 新しいSpecファイルを作成

`specs/` フォルダに新しいJSファイルを作成します。

命名規則: `{グループ名}-{カテゴリ名}.js`
- 例: `workplace-calendar.js`, `business-contact-center.js`

### 2. Specファイルの構造

```javascript
// specs/workplace-calendar.js

registerCategory("Workplace", {
  name: "Calendar",
  endpoints: [
    {
      method: "GET",
      path: "/users/{userId}/calendar/events",
      summary: "List calendar events",
      description: "List all calendar events for a user.",
      scopes: ["calendar:read:list_events:admin"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          type: "string",
          description: "User ID or email address"
        },
        {
          name: "from",
          in: "query",
          required: false,
          type: "string",
          description: "Start date (yyyy-MM-dd)"
        },
        {
          name: "to",
          in: "query",
          required: false,
          type: "string",
          description: "End date (yyyy-MM-dd)"
        }
      ]
    },
    {
      method: "POST",
      path: "/users/{userId}/calendar/events",
      summary: "Create calendar event",
      description: "Create a new calendar event.",
      scopes: ["calendar:write:event:admin"],
      parameters: [
        {
          name: "userId",
          in: "path",
          required: true,
          type: "string",
          description: "User ID or email address"
        }
      ],
      requestBody: {
        required: true,
        example: {
          "topic": "Team Meeting",
          "start_time": "2024-01-15T10:00:00Z",
          "duration": 60
        }
      }
    }
  ]
});
```

### 3. グループ名の一覧

`registerCategory()` の第1引数に使用できるグループ名:

| グループ名 | 説明 |
|-----------|------|
| `Workplace` | Meetings, Team Chat, Phone, Calendar, Rooms, Clips等 |
| `Business Services` | Webinars, Contact Center, Revenue Accelerator等 |
| `Accounts` | Users, Accounts, Groups, Roles, SCIM等 |
| `Build Platform` | Video SDK, Cobrowse SDK等 |
| `Marketplace` | Apps等 |

### 4. popup.htmlにスクリプトを追加

`popup.html` の `<!-- API Specifications -->` セクションに新しいファイルを追加:

```html
<!-- API Specifications -->
<script src="specs/index.js"></script>
<!-- Workplace -->
<script src="specs/workplace-meetings.js"></script>
<script src="specs/workplace-calendar.js"></script>  <!-- 追加 -->
...
```

### 5. エンドポイント定義のプロパティ

| プロパティ | 型 | 必須 | 説明 |
|-----------|------|------|------|
| `method` | string | Yes | HTTP メソッド (GET, POST, PUT, PATCH, DELETE) |
| `path` | string | Yes | APIパス（パスパラメータは `{paramName}` 形式） |
| `summary` | string | Yes | APIの短い説明 |
| `description` | string | Yes | APIの詳細説明 |
| `scopes` | string[] | Yes | 必要なGranular Scopes |
| `parameters` | array | No | パスパラメータとクエリパラメータ |
| `requestBody` | object | No | リクエストボディ（POST/PUT/PATCH用） |

### 6. パラメータ定義

```javascript
{
  name: "paramName",      // パラメータ名
  in: "path" | "query",   // パスパラメータ or クエリパラメータ
  required: true | false, // 必須かどうか
  type: "string" | "integer" | "boolean", // データ型
  description: "説明",    // パラメータの説明
  default: "value",       // デフォルト値（オプション）
  enum: ["val1", "val2"]  // 選択肢（オプション）
}
```

## Granular Scopesの形式

Granular Scopesは以下の形式で記述します:

```
{resource}:{permission}:{action}:{level}
```

例:
- `user:read:list_users:admin` - 管理者レベルでユーザー一覧を読み取る
- `meeting:write:meeting:admin` - 管理者レベルでミーティングを作成/更新する
- `phone:read:call_log:admin` - 管理者レベルで通話履歴を読み取る

## 注意事項

- Chrome拡張機能のポップアップサイズは最大800x600pxに制限されています
- アクセストークンは1時間で期限切れになります
- Client Secretは安全に保管してください
- 本番環境のAPIを叩く際は十分注意してください

## ライセンス

MIT License
