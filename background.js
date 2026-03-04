// Background service worker for Zoom REST API Tester
// Handles background tasks and token management

// Window state
let appWindowId = null;

// Listen for extension icon click - open independent window
chrome.action.onClicked.addListener(async () => {
  // Check if window already exists and is open
  if (appWindowId !== null) {
    try {
      const window = await chrome.windows.get(appWindowId);
      // Window exists, focus it
      await chrome.windows.update(appWindowId, { focused: true });
      return;
    } catch (e) {
      // Window doesn't exist anymore
      appWindowId = null;
    }
  }

  // Create new window
  const window = await chrome.windows.create({
    url: 'popup.html',
    type: 'popup',
    width: 1000,
    height: 800,
    focused: true
  });

  appWindowId = window.id;
});

// Clean up window ID when window is closed
chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === appWindowId) {
    appWindowId = null;
  }
});

// Listen for extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Zoom REST API Tester installed');
  } else if (details.reason === 'update') {
    console.log('Zoom REST API Tester updated to version', chrome.runtime.getManifest().version);
  }

  // Create token expiration check alarm
  chrome.alarms.create('checkTokenExpiry', {
    periodInMinutes: 5
  });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkTokenExpiry') {
    await checkAndNotifyTokenExpiry();
  }
});

async function checkAndNotifyTokenExpiry() {
  const result = await chrome.storage.local.get('zoomToken');
  if (result.zoomToken) {
    const { expiresAt } = result.zoomToken;
    const expiryTime = new Date(expiresAt);
    const now = new Date();
    const minutesUntilExpiry = (expiryTime - now) / 1000 / 60;

    // Notify if token expires in less than 10 minutes
    if (minutesUntilExpiry > 0 && minutesUntilExpiry < 10) {
      // Token is about to expire
      console.log(`Zoom API token expires in ${Math.round(minutesUntilExpiry)} minutes`);
    } else if (minutesUntilExpiry <= 0) {
      // Token has expired - clear it
      await chrome.storage.local.remove('zoomToken');
      console.log('Zoom API token has expired and been cleared');
    }
  }
}

// Message handling from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTokenStatus') {
    getTokenStatus().then(sendResponse);
    return true; // Indicates async response
  }

  if (request.action === 'fetchZoomToken') {
    fetchZoomToken(request.credentials).then(sendResponse);
    return true;
  }

  if (request.action === 'executeZoomRequest') {
    executeZoomRequest(request.url, request.options).then(sendResponse);
    return true;
  }

  if (request.action === 'fetchApiSpec') {
    fetchApiSpec(request.url).then(sendResponse);
    return true;
  }
});

// Fetch API Spec from developers.zoom.us (runs in service worker to bypass CORS)
async function fetchApiSpec(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return { error: `Failed to fetch: ${response.status}` };
    }
    const data = await response.json();
    return { data };
  } catch (e) {
    return { error: e.message };
  }
}

// Fetch Zoom OAuth token (runs in service worker to bypass CORS)
async function fetchZoomToken(credentials) {
  try {
    const { accountId, clientId, clientSecret } = credentials;
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.reason || data.error_description || data.error || 'Authentication failed' };
    }

    return data;
  } catch (e) {
    return { error: e.message };
  }
}

// Execute Zoom API request (runs in service worker to bypass CORS)
async function executeZoomRequest(url, options) {
  try {
    const startTime = Date.now();
    const response = await fetch(url, options);
    const endTime = Date.now();
    const duration = endTime - startTime;

    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return {
      status: response.status,
      ok: response.ok,
      data: data,
      duration: duration
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function getTokenStatus() {
  const result = await chrome.storage.local.get('zoomToken');
  if (result.zoomToken) {
    const { expiresAt } = result.zoomToken;
    const expiryTime = new Date(expiresAt);
    const now = new Date();

    if (expiryTime > now) {
      return {
        valid: true,
        expiresAt: expiresAt,
        minutesRemaining: Math.round((expiryTime - now) / 1000 / 60)
      };
    }
  }

  return { valid: false };
}
