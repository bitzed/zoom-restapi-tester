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
});

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
