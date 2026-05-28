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

// Legacy cache keys from renamed categories (slug changed upstream)
const LEGACY_CACHE_SLUGS = ['zoom-docs'];

async function cleanupLegacyCache() {
  const keysToRemove = LEGACY_CACHE_SLUGS.map(slug => `apiSpec_${slug}`);
  await chrome.storage.local.remove(keysToRemove);

  const result = await chrome.storage.local.get('apiSpecMetadata');
  const metadata = result.apiSpecMetadata;
  if (!metadata) return;

  let changed = false;
  for (const slug of LEGACY_CACHE_SLUGS) {
    if (slug in metadata) {
      delete metadata[slug];
      changed = true;
    }
  }
  if (changed) {
    await chrome.storage.local.set({ apiSpecMetadata: metadata });
  }
}

// Listen for extension installation
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('Zoom REST API Tester installed');
  } else if (details.reason === 'update') {
    console.log('Zoom REST API Tester updated to version', chrome.runtime.getManifest().version);
    await cleanupLegacyCache();
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
  console.log('[BG] Message received:', request.action, request);

  if (request.action === 'getTokenStatus') {
    console.log('[BG] Getting token status...');
    getTokenStatus().then(result => {
      console.log('[BG] Token status result:', result);
      sendResponse(result);
    });
    return true; // Indicates async response
  }

  if (request.action === 'fetchZoomToken') {
    console.log('[BG] Fetching Zoom token...');
    fetchZoomToken(request.credentials).then(result => {
      console.log('[BG] Token fetch result:', result.error ? result.error : 'success');
      sendResponse(result);
    });
    return true;
  }

  if (request.action === 'executeZoomRequest') {
    console.log('[BG] Executing Zoom request:', request.url);
    console.log('[BG] Request options:', JSON.stringify(request.options, null, 2));
    executeZoomRequest(request.url, request.options).then(result => {
      console.log('[BG] Request result:', result.error ? result.error : `status=${result.status}`);
      sendResponse(result);
    });
    return true;
  }

  if (request.action === 'fetchApiSpec') {
    console.log('[BG] Fetching API spec:', request.url);
    fetchApiSpec(request.url).then(result => {
      console.log('[BG] API spec result:', result.error ? result.error : 'success');
      sendResponse(result);
    });
    return true;
  }
});

// Fetch API Spec from developers.zoom.us (runs in service worker to bypass CORS)
async function fetchApiSpec(url) {
  console.log('[BG] fetchApiSpec starting...');
  console.log('[BG] Spec URL:', url);

  try {
    console.log('[BG] Calling fetch for spec...');
    const response = await fetch(url);
    console.log('[BG] Spec fetch response status:', response.status);

    if (!response.ok) {
      console.error('[BG] Spec fetch failed:', response.status);
      return { error: `Failed to fetch: ${response.status}` };
    }
    const data = await response.json();
    console.log('[BG] Spec parsed successfully');
    return { data };
  } catch (e) {
    console.error('[BG] fetchApiSpec error:', e.message);
    return { error: e.message };
  }
}

// Fetch Zoom OAuth token (runs in service worker to bypass CORS)
async function fetchZoomToken(credentials) {
  console.log('[BG] fetchZoomToken starting...');
  console.log('[BG] Account ID:', credentials?.accountId ? '(provided)' : '(missing)');
  console.log('[BG] Client ID:', credentials?.clientId ? '(provided)' : '(missing)');

  try {
    const { accountId, clientId, clientSecret } = credentials;
    const basicAuth = btoa(`${clientId}:${clientSecret}`);

    console.log('[BG] Calling OAuth token endpoint...');
    const response = await fetch('https://zoom.us/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=account_credentials&account_id=${encodeURIComponent(accountId)}`
    });

    console.log('[BG] OAuth response status:', response.status);
    const data = await response.json();

    if (!response.ok) {
      console.error('[BG] OAuth failed:', data.reason || data.error_description || data.error);
      return { error: data.reason || data.error_description || data.error || 'Authentication failed' };
    }

    console.log('[BG] OAuth token obtained successfully');
    return data;
  } catch (e) {
    console.error('[BG] fetchZoomToken error:', e.message);
    return { error: e.message };
  }
}

// Execute Zoom API request (runs in service worker to bypass CORS)
async function executeZoomRequest(url, options) {
  console.log('[BG] executeZoomRequest starting...');
  console.log('[BG] URL:', url);
  console.log('[BG] Method:', options?.method || 'GET');
  console.log('[BG] Headers:', JSON.stringify(options?.headers || {}));
  console.log('[BG] Body:', options?.body ? options.body.substring(0, 500) : 'none');

  try {
    console.log('[BG] Calling fetch...');
    const response = await fetch(url, options);

    console.log('[BG] Fetch completed successfully');
    console.log('[BG] Response status:', response.status);
    console.log('[BG] Response ok:', response.ok);

    let data;
    const contentType = response.headers.get('content-type');
    console.log('[BG] Content-Type:', contentType);

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
      console.log('[BG] Parsed JSON response');
    } else {
      data = await response.text();
      console.log('[BG] Got text response, length:', data.length);
    }

    // Get x-zm-trackingid header
    const trackingId = response.headers.get('x-zm-trackingid') || '';

    return {
      status: response.status,
      ok: response.ok,
      data: data,
      trackingId: trackingId
    };
  } catch (e) {
    console.error('[BG] executeZoomRequest error:', e.message);
    console.error('[BG] Error stack:', e.stack);
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
