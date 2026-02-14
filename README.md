# Zoom REST API Tester - Server to Server Ver

A Chrome extension for testing Zoom REST APIs using Server-to-Server OAuth authentication.

## Features

- Server-to-Server OAuth access token management
- Dynamic API spec loading from Zoom's official developer documentation
- Automatic coverage of all 35 categories with hundreds of API endpoints
- Swagger-like API reference UI
- Filtering by category and search
- Parameter input forms
- API request execution with response display
- Granular Scopes support
- Standalone window (no popup size limits)
- API spec caching with manual refresh

## Installation

1. Clone or download this repository
   ```bash
   git clone https://github.com/bitzed/zoom-restapi-tester.git
   ```

2. Open `chrome://extensions/` in Chrome

3. Enable "Developer mode" in the top right

4. Click "Load unpacked"

5. Select the downloaded folder

## Usage

### 1. Configure Credentials

1. Click the extension icon to open the standalone window
2. Click the gear icon (Settings) in the top right
3. Enter your Zoom Server-to-Server OAuth app credentials:
   - **Account ID**: Your Zoom Account ID
   - **Client ID**: OAuth app Client ID
   - **Client Secret**: OAuth app Client Secret
4. Click "Save Settings"

### 2. Get Access Token

1. Click "Get Access Token"
2. On success, the status changes to "Authenticated"
3. The token is automatically stored in local storage (valid for 1 hour)

### 3. Test APIs

1. Select a **Group** (Workplace, Business Services, Accounts, etc.)
2. Select a **Category** (Meetings, Users, Phone, etc.)
   - On first selection, the API spec is automatically fetched from Zoom's official site
   - Fetched specs are cached and loaded instantly on subsequent visits
3. Use search to filter APIs
4. Click an API to open its detail panel
5. In the detail panel:
   - **Required Granular Scopes**: Review the scopes your app needs
   - **Path Parameters**: Fill in path parameters
   - **Query Parameters**: Fill in query parameters
   - **Request Body**: Enter JSON body (for POST/PUT/PATCH)
6. Click "Execute Request"
7. The response is displayed below

### 4. Updating API Specs

- After selecting a category, click the refresh button to re-fetch the latest spec
- Cache is valid for 7 days. Expired cache is automatically refreshed on next access

## Creating a Zoom Server-to-Server OAuth App

1. Log in to [Zoom App Marketplace](https://marketplace.zoom.us/)
2. Click "Develop" > "Build App"
3. Select "Server-to-Server OAuth" and create the app
4. Add the required Granular Scopes:
   - Example: `user:read:list_users:admin` (for listing users)
5. Copy the Account ID, Client ID, and Client Secret

## Supported API Categories

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

## Project Structure

```
zoom-restapi-tester/
├── manifest.json          # Chrome extension manifest
├── popup.html             # Main UI
├── popup.js               # UI logic
├── api-spec-loader.js     # Dynamic API spec loader
├── styles.css             # Stylesheet
├── background.js          # Service worker
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

## Technical Details

### How API Spec Loading Works

1. User selects a category
2. Fetches OpenAPI 3.0 spec from `https://developers.zoom.us/api-hub/{category}/methods/endpoints.json`
3. Parses the OpenAPI format into an internal representation and caches it in `chrome.storage.local`
4. Extracts only Granular Scopes (4-segment format) for display

### Cache Management

- Cache key: `apiSpec_{category-slug}`
- Expiry: 7 days
- Manual refresh: Force re-fetch via the refresh button

## Granular Scopes Format

Granular Scopes follow this pattern:

```
{resource}:{permission}:{action}:{level}
```

Examples:
- `user:read:list_users:admin` - Read user list at admin level
- `meeting:write:meeting:admin` - Create/update meetings at admin level
- `phone:read:call_log:admin` - Read call logs at admin level

## Notes

- Access tokens expire after 1 hour
- Keep your Client Secret secure
- Exercise caution when making requests to production APIs
- Clicking the extension icon again focuses the existing window
- Network access is required only on the first spec fetch per category

## License

MIT License
