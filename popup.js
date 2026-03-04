// Zoom REST API Tester - Main Popup Script

// State
let currentToken = null;
let tokenExpiresAt = null;
let currentSpec = null;
let currentCategory = null;

// DOM Elements
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const saveSettingsBtn = document.getElementById('save-settings-btn');
const clearSettingsBtn = document.getElementById('clear-settings-btn');
const toggleSecretBtn = document.getElementById('toggle-secret');

const authBtn = document.getElementById('auth-btn');
const clearTokenBtn = document.getElementById('clear-token-btn');
const authStatus = document.getElementById('auth-status');
const tokenInfo = document.getElementById('token-info');
const tokenPreview = document.getElementById('token-preview');
const tokenExpires = document.getElementById('token-expires');
const authError = document.getElementById('auth-error');

const groupSelect = document.getElementById('group-select');
const categorySelect = document.getElementById('category-select');
const refreshSpecBtn = document.getElementById('refresh-spec-btn');
const apiSearch = document.getElementById('api-search');
const apiList = document.getElementById('api-list');
const cacheInfo = document.getElementById('cache-info');
const cacheStatus = document.getElementById('cache-status');
const specLoading = document.getElementById('spec-loading');

const apiDetailPanel = document.getElementById('api-detail-panel');
const closePanelBtn = document.getElementById('close-panel-btn');
const panelTitle = document.getElementById('panel-title');
const apiDetailContent = document.getElementById('api-detail-content');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  setupEventListeners();
  await loadStoredToken();
  populateGroups();
}

// Event Listeners
function setupEventListeners() {
  // Settings
  settingsBtn.addEventListener('click', openSettings);
  closeSettingsBtn.addEventListener('click', closeSettings);
  saveSettingsBtn.addEventListener('click', saveSettings);
  clearSettingsBtn.addEventListener('click', clearSettings);
  toggleSecretBtn.addEventListener('click', toggleSecretVisibility);

  // Modal background click
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) closeSettings();
  });

  // Auth
  authBtn.addEventListener('click', authenticate);
  clearTokenBtn.addEventListener('click', clearToken);

  // Group/Category selection
  groupSelect.addEventListener('change', onGroupChange);
  categorySelect.addEventListener('change', onCategoryChange);
  refreshSpecBtn.addEventListener('click', onRefreshSpec);

  // API filtering
  apiSearch.addEventListener('input', debounce(renderApiList, 300));

  // Panel
  closePanelBtn.addEventListener('click', closeDetailPanel);
}

// Settings Functions
async function openSettings() {
  settingsModal.style.display = 'flex';
  const credentials = await getCredentials();
  document.getElementById('account-id').value = credentials.accountId || '';
  document.getElementById('client-id').value = credentials.clientId || '';
  document.getElementById('client-secret').value = credentials.clientSecret || '';
  hideSettingsMessage();
}

function closeSettings() {
  settingsModal.style.display = 'none';
}

async function saveSettings() {
  const accountId = document.getElementById('account-id').value.trim();
  const clientId = document.getElementById('client-id').value.trim();
  const clientSecret = document.getElementById('client-secret').value.trim();

  if (!accountId || !clientId || !clientSecret) {
    showSettingsMessage('Please fill in all fields', 'error');
    return;
  }

  await chrome.storage.local.set({
    zoomCredentials: { accountId, clientId, clientSecret }
  });

  showSettingsMessage('Settings saved successfully', 'success');

  // Clear existing token since credentials changed
  await clearToken();
}

async function clearSettings() {
  if (!confirm('Are you sure you want to clear all credentials?')) return;

  await chrome.storage.local.remove(['zoomCredentials', 'zoomToken']);
  document.getElementById('account-id').value = '';
  document.getElementById('client-id').value = '';
  document.getElementById('client-secret').value = '';

  currentToken = null;
  tokenExpiresAt = null;
  updateAuthUI(false);

  showSettingsMessage('All credentials cleared', 'success');
}

function toggleSecretVisibility() {
  const secretInput = document.getElementById('client-secret');
  secretInput.type = secretInput.type === 'password' ? 'text' : 'password';
}

function showSettingsMessage(message, type) {
  const messageEl = document.getElementById('settings-message');
  messageEl.textContent = message;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
}

function hideSettingsMessage() {
  document.getElementById('settings-message').style.display = 'none';
}

async function getCredentials() {
  const result = await chrome.storage.local.get('zoomCredentials');
  return result.zoomCredentials || {};
}

// Authentication Functions
async function loadStoredToken() {
  const result = await chrome.storage.local.get('zoomToken');
  if (result.zoomToken) {
    const { token, expiresAt } = result.zoomToken;
    if (new Date(expiresAt) > new Date()) {
      currentToken = token;
      tokenExpiresAt = new Date(expiresAt);
      updateAuthUI(true);
      return;
    }
  }
  updateAuthUI(false);
}

async function authenticate() {
  const credentials = await getCredentials();

  if (!credentials.accountId || !credentials.clientId || !credentials.clientSecret) {
    showAuthError('Please configure your credentials in Settings first.');
    return;
  }

  authBtn.disabled = true;
  authBtn.innerHTML = '<span class="loading"><span class="spinner"></span> Authenticating...</span>';
  hideAuthError();

  try {
    const token = await getAccessToken(credentials);
    currentToken = token.access_token;

    // Token expires in `expires_in` seconds (typically 3600 = 1 hour)
    const expiresIn = token.expires_in || 3600;
    tokenExpiresAt = new Date(Date.now() + expiresIn * 1000);

    // Store token
    await chrome.storage.local.set({
      zoomToken: {
        token: currentToken,
        expiresAt: tokenExpiresAt.toISOString()
      }
    });

    updateAuthUI(true);
  } catch (error) {
    showAuthError(error.message);
    updateAuthUI(false);
  } finally {
    authBtn.disabled = false;
    authBtn.textContent = 'Get Access Token';
  }
}

async function getAccessToken(credentials) {
  // Use background script to bypass CORS
  const result = await chrome.runtime.sendMessage({ action: 'fetchZoomToken', credentials });
  if (result.error) throw new Error(result.error);
  return result;
}

async function clearToken() {
  await chrome.storage.local.remove('zoomToken');
  currentToken = null;
  tokenExpiresAt = null;
  updateAuthUI(false);
}

function updateAuthUI(isAuthenticated) {
  const statusIndicator = authStatus.querySelector('.status-indicator');
  const statusText = authStatus.querySelector('.status-text');

  if (isAuthenticated) {
    statusIndicator.className = 'status-indicator connected';
    statusText.textContent = 'Authenticated';

    tokenInfo.style.display = 'block';
    tokenPreview.textContent = currentToken.substring(0, 20) + '...';
    tokenExpires.textContent = tokenExpiresAt.toLocaleString();

    clearTokenBtn.style.display = 'inline-block';
    authBtn.textContent = 'Refresh Token';
  } else {
    statusIndicator.className = 'status-indicator disconnected';
    statusText.textContent = 'Not authenticated';

    tokenInfo.style.display = 'none';
    clearTokenBtn.style.display = 'none';
    authBtn.textContent = 'Get Access Token';
  }
}

function showAuthError(message) {
  authError.textContent = message;
  authError.style.display = 'block';
}

function hideAuthError() {
  authError.style.display = 'none';
}

// Group/Category Functions
function populateGroups() {
  const groups = ApiSpecLoader.getCategoryGroups();
  groupSelect.innerHTML = '<option value="">Select Group</option>';
  groups.forEach(group => {
    const option = document.createElement('option');
    option.value = group.name;
    option.textContent = group.name;
    groupSelect.appendChild(option);
  });
}

function onGroupChange() {
  const selectedGroup = groupSelect.value;
  categorySelect.innerHTML = '<option value="">Select Category</option>';

  if (!selectedGroup) {
    categorySelect.disabled = true;
    refreshSpecBtn.disabled = true;
    apiSearch.disabled = true;
    currentSpec = null;
    currentCategory = null;
    renderEmptyState('Select a Group and Category to load APIs');
    hideCacheInfo();
    return;
  }

  const groups = ApiSpecLoader.getCategoryGroups();
  const group = groups.find(g => g.name === selectedGroup);

  if (group) {
    group.categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.slug;
      option.textContent = cat.name;
      option.dataset.categoryName = cat.name;
      categorySelect.appendChild(option);
    });
    categorySelect.disabled = false;
  }

  currentSpec = null;
  currentCategory = null;
  renderEmptyState('Select a Category to load APIs');
  hideCacheInfo();
}

async function onCategoryChange() {
  const slug = categorySelect.value;
  const selectedOption = categorySelect.options[categorySelect.selectedIndex];
  const categoryName = selectedOption?.dataset?.categoryName || slug;

  if (!slug) {
    refreshSpecBtn.disabled = true;
    apiSearch.disabled = true;
    currentSpec = null;
    currentCategory = null;
    renderEmptyState('Select a Category to load APIs');
    hideCacheInfo();
    return;
  }

  currentCategory = { slug, name: categoryName };
  await loadCategorySpec(slug, categoryName, false);
}

async function onRefreshSpec() {
  if (!currentCategory) return;
  await loadCategorySpec(currentCategory.slug, currentCategory.name, true);
}

async function loadCategorySpec(slug, categoryName, forceRefresh) {
  showLoading(true);
  refreshSpecBtn.disabled = true;
  apiSearch.disabled = true;
  hideCacheInfo();

  try {
    const result = await ApiSpecLoader.getSpec(slug, categoryName, forceRefresh);
    currentSpec = result.spec;

    // Show cache info
    showCacheInfo(result.fromCache, currentSpec.fetchedAt, currentSpec.endpoints.length);

    // Enable controls
    refreshSpecBtn.disabled = false;
    apiSearch.disabled = false;
    apiSearch.value = '';

    // Render API list
    renderApiList();
  } catch (error) {
    console.error('Failed to load spec:', error);
    renderErrorState(`Failed to load API spec: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

function showLoading(show) {
  specLoading.style.display = show ? 'flex' : 'none';
  if (show) {
    apiList.innerHTML = '';
  }
}

function showCacheInfo(fromCache, fetchedAt, endpointCount) {
  const date = new Date(fetchedAt);
  const dateStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();

  cacheStatus.innerHTML = `
    <span class="cache-badge ${fromCache ? 'cached' : 'fresh'}">${fromCache ? 'Cached' : 'Fresh'}</span>
    <span class="cache-date">Fetched: ${dateStr}</span>
    <span class="cache-count">${endpointCount} endpoints</span>
  `;
  cacheInfo.style.display = 'flex';
}

function hideCacheInfo() {
  cacheInfo.style.display = 'none';
}

function renderEmptyState(message) {
  apiList.innerHTML = `
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

function renderErrorState(message) {
  apiList.innerHTML = `
    <div class="empty-state error">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p>${message}</p>
      <button class="btn btn-secondary" onclick="onCategoryChange()">Retry</button>
    </div>
  `;
}

// API List Functions
function renderApiList() {
  if (!currentSpec) {
    renderEmptyState('Select a Category to load APIs');
    return;
  }

  const searchTerm = apiSearch.value.toLowerCase();
  apiList.innerHTML = '';

  // Group endpoints by tags
  const tagGroups = {};
  currentSpec.endpoints.forEach(endpoint => {
    const tag = endpoint.tags[0] || 'Other';
    if (!tagGroups[tag]) {
      tagGroups[tag] = [];
    }
    tagGroups[tag].push(endpoint);
  });

  let totalVisible = 0;

  Object.entries(tagGroups).forEach(([tag, endpoints]) => {
    const filteredEndpoints = endpoints.filter(endpoint => {
      if (!searchTerm) return true;
      return (
        endpoint.path.toLowerCase().includes(searchTerm) ||
        endpoint.summary.toLowerCase().includes(searchTerm) ||
        endpoint.method.toLowerCase().includes(searchTerm) ||
        endpoint.operationId.toLowerCase().includes(searchTerm)
      );
    });

    if (filteredEndpoints.length === 0) return;
    totalVisible += filteredEndpoints.length;

    const categoryEl = document.createElement('div');
    categoryEl.className = 'api-category';

    const headerEl = document.createElement('div');
    headerEl.className = 'category-header';
    headerEl.innerHTML = `
      <span class="arrow">▶</span>
      <span>${tag}</span>
      <span style="margin-left: auto; color: #666; font-weight: normal;">(${filteredEndpoints.length})</span>
    `;
    headerEl.addEventListener('click', () => toggleCategory(headerEl));

    const endpointsEl = document.createElement('div');
    endpointsEl.className = 'category-endpoints';

    filteredEndpoints.forEach(endpoint => {
      const endpointEl = document.createElement('div');
      endpointEl.className = 'api-endpoint';
      endpointEl.innerHTML = `
        <span class="method-badge ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
        <span class="endpoint-path">${endpoint.path}</span>
        <span class="endpoint-summary">${endpoint.summary}</span>
      `;
      endpointEl.addEventListener('click', () => openEndpointDetail(endpoint));
      endpointsEl.appendChild(endpointEl);
    });

    categoryEl.appendChild(headerEl);
    categoryEl.appendChild(endpointsEl);
    apiList.appendChild(categoryEl);
  });

  if (totalVisible === 0) {
    apiList.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <p>No APIs found matching "${searchTerm}"</p>
      </div>
    `;
  }
}

function toggleCategory(headerEl) {
  headerEl.classList.toggle('expanded');
  const endpointsEl = headerEl.nextElementSibling;
  endpointsEl.classList.toggle('show');
}

// API Detail Panel
function openEndpointDetail(endpoint) {
  panelTitle.textContent = endpoint.summary;
  apiDetailPanel.style.display = 'flex';

  renderEndpointDetail(endpoint);
}

function closeDetailPanel() {
  apiDetailPanel.style.display = 'none';
}

function renderEndpointDetail(endpoint) {
  const hasBody = endpoint.requestBody;
  const pathParams = endpoint.parameters.filter(p => p.in === 'path');
  const queryParams = endpoint.parameters.filter(p => p.in === 'query');

  // Determine base URL
  const baseUrl = currentSpec?.servers?.[0]?.url || 'https://api.zoom.us/v2';

  let html = `
    <div class="api-detail">
      <div class="endpoint-header">
        <span class="method-badge ${endpoint.method.toLowerCase()}">${endpoint.method}</span>
        <span class="endpoint-path">${endpoint.path}</span>
      </div>

      <p class="description">${endpoint.description || endpoint.summary}</p>

      <!-- Required Scopes -->
      <div class="scopes-section">
        <h4>Required Granular Scopes</h4>
        ${endpoint.scopes.length > 0 ? `
          <p style="font-size: 12px; margin-bottom: 8px; color: #856404;">Ensure your Server-to-Server OAuth app has these scopes enabled:</p>
          <div class="scope-list">
            ${endpoint.scopes.map(scope => `<span class="scope-tag">${scope}</span>`).join('')}
          </div>
        ` : `
          <p style="font-size: 12px; color: #666;">No granular scopes found in documentation. Check the <a href="https://developers.zoom.us/docs/api/" target="_blank">official docs</a>.</p>
        `}
      </div>
  `;

  // Path Parameters
  if (pathParams.length > 0) {
    html += `
      <div class="params-section">
        <div class="section-header">Path Parameters</div>
        ${pathParams.map(param => renderParamInput(param, 'path')).join('')}
      </div>
    `;
  }

  // Query Parameters
  if (queryParams.length > 0) {
    html += `
      <div class="params-section">
        <div class="section-header">Query Parameters</div>
        ${queryParams.map(param => renderParamInput(param, 'query')).join('')}
      </div>
    `;
  }

  // Request Body
  if (hasBody) {
    const example = endpoint.requestBody.example || {};
    html += `
      <div class="body-section">
        <div class="section-header">Request Body</div>
        <div class="body-editor">
          <textarea id="request-body" placeholder="Enter JSON request body...">${JSON.stringify(example, null, 2)}</textarea>
        </div>
      </div>
    `;
  }

  // Execute Button
  html += `
    <div class="execute-section">
      <button id="execute-btn" class="btn btn-execute" ${!currentToken ? 'disabled title="Please authenticate first"' : ''}>
        Execute Request
      </button>
    </div>
  `;

  // Response Section
  html += `
    <div class="response-section" id="response-section" style="display: none;">
      <div class="section-header">Response</div>
      <div class="response-content" id="response-content"></div>
    </div>
  `;

  html += '</div>';

  apiDetailContent.innerHTML = html;

  // Store baseUrl for execution
  apiDetailContent.dataset.baseUrl = baseUrl;

  // Add execute handler
  document.getElementById('execute-btn').addEventListener('click', () => executeRequest(endpoint, baseUrl));
}

function renderParamInput(param, type) {
  let inputHtml = '';

  if (param.enum) {
    inputHtml = `
      <select class="param-input" data-param="${param.name}" data-in="${type}">
        <option value="">-- Select --</option>
        ${param.enum.map(val => `<option value="${val}">${val}</option>`).join('')}
      </select>
    `;
  } else {
    const inputType = param.type === 'integer' ? 'number' : 'text';
    const defaultValue = param.default !== undefined ? param.default : '';
    inputHtml = `
      <input type="${inputType}" class="param-input" data-param="${param.name}" data-in="${type}"
             placeholder="${param.type}${param.default !== undefined ? ` (default: ${param.default})` : ''}"
             value="${defaultValue}">
    `;
  }

  return `
    <div class="param-item">
      <div class="param-header">
        <span class="param-name">${param.name}</span>
        <span class="param-type">${param.type}</span>
        ${param.required ? '<span class="param-required">required</span>' : ''}
        <span class="param-in">${type}</span>
      </div>
      <p class="param-description">${param.description}</p>
      ${inputHtml}
    </div>
  `;
}

// API Execution
async function executeRequest(endpoint, baseUrl) {
  if (!currentToken) {
    alert('Please authenticate first.');
    return;
  }

  const executeBtn = document.getElementById('execute-btn');
  executeBtn.disabled = true;
  executeBtn.innerHTML = '<span class="loading"><span class="spinner"></span> Executing...</span>';

  const responseSection = document.getElementById('response-section');
  const responseContent = document.getElementById('response-content');
  responseSection.style.display = 'block';
  responseContent.innerHTML = '<div class="loading"><span class="spinner"></span> Loading...</div>';

  try {
    // Build URL with path and query parameters
    let url = baseUrl + endpoint.path;

    // Collect parameters
    const pathInputs = document.querySelectorAll('.param-input[data-in="path"]');
    const queryInputs = document.querySelectorAll('.param-input[data-in="query"]');

    // Replace path parameters
    pathInputs.forEach(input => {
      const paramName = input.dataset.param;
      const value = input.value.trim();
      if (value) {
        url = url.replace(`{${paramName}}`, encodeURIComponent(value));
      }
    });

    // Check for unreplaced path parameters
    if (url.includes('{')) {
      throw new Error('Please fill in all required path parameters');
    }

    // Add query parameters
    const queryParams = new URLSearchParams();
    queryInputs.forEach(input => {
      const value = input.value.trim();
      if (value) {
        queryParams.append(input.dataset.param, value);
      }
    });

    const queryString = queryParams.toString();
    if (queryString) {
      url += '?' + queryString;
    }

    // Prepare request options
    const options = {
      method: endpoint.method,
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json'
      }
    };

    // Add request body if needed
    if (endpoint.requestBody) {
      const bodyTextarea = document.getElementById('request-body');
      if (bodyTextarea && bodyTextarea.value.trim()) {
        try {
          options.body = JSON.stringify(JSON.parse(bodyTextarea.value));
        } catch (e) {
          throw new Error('Invalid JSON in request body');
        }
      }
    }

    // Use background script to bypass CORS
    const result = await chrome.runtime.sendMessage({ action: 'executeZoomRequest', url, options });
    if (result.error) throw new Error(result.error);
    renderResponse(result.status, result.data, result.duration, result.ok);

  } catch (error) {
    renderErrorResponse(error.message);
  } finally {
    executeBtn.disabled = false;
    executeBtn.textContent = 'Execute Request';
  }
}

function renderResponse(statusCode, data, duration, isSuccess) {
  const responseContent = document.getElementById('response-content');

  let html = `
    <div class="response-status">
      <span class="status-code ${isSuccess ? 'success' : 'error'}">${statusCode}</span>
      <span class="response-time">${duration}ms</span>
    </div>
  `;

  if (!isSuccess && typeof data === 'object') {
    // Error response - show detailed error information
    html += `
      <div class="response-error">
        ${data.code ? `<div class="error-detail"><span class="error-label">Error Code:</span><span class="error-value">${data.code}</span></div>` : ''}
        ${data.message ? `<div class="error-detail"><span class="error-label">Message:</span><span class="error-value">${data.message}</span></div>` : ''}
        ${data.reason ? `<div class="error-detail"><span class="error-label">Reason:</span><span class="error-value">${data.reason}</span></div>` : ''}
        ${data.errors ? `<div class="error-detail"><span class="error-label">Details:</span><span class="error-value">${JSON.stringify(data.errors, null, 2)}</span></div>` : ''}
      </div>
    `;
  }

  // JSON response body
  html += `
    <div class="response-body">${formatJson(data)}</div>
  `;

  responseContent.innerHTML = html;
}

function renderErrorResponse(errorMessage) {
  const responseContent = document.getElementById('response-content');
  responseContent.innerHTML = `
    <div class="response-error">
      <div class="error-detail">
        <span class="error-label">Error:</span>
        <span class="error-value">${errorMessage}</span>
      </div>
    </div>
  `;
}

function formatJson(data) {
  if (typeof data !== 'object') {
    return escapeHtml(String(data));
  }

  const jsonString = JSON.stringify(data, null, 2);
  return syntaxHighlightJson(jsonString);
}

function syntaxHighlightJson(json) {
  json = escapeHtml(json);
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    }
  );
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
