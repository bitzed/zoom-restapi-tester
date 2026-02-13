// API Spec Loader - Fetches and caches Zoom OpenAPI specs dynamically

// Category definitions with API Hub slugs
const API_CATEGORIES = {
  groups: [
    {
      name: "Workplace",
      categories: [
        { name: "Meetings", slug: "meetings" },
        { name: "Team Chat", slug: "team-chat" },
        { name: "Phone", slug: "phone" },
        { name: "Mail", slug: "mail" },
        { name: "Calendar", slug: "calendar" },
        { name: "Scheduler", slug: "scheduler" },
        { name: "Rooms", slug: "rooms" },
        { name: "Clips", slug: "clips" },
        { name: "Whiteboard", slug: "whiteboard" },
        { name: "CRC", slug: "crc" },
        { name: "Chatbot", slug: "chatbot" },
        { name: "AI Companion", slug: "ai-companion" },
        { name: "Zoom Docs", slug: "zoom-docs" },
        { name: "Tasks", slug: "tasks" }
      ]
    },
    {
      name: "Business Services",
      categories: [
        { name: "Contact Center", slug: "contact-center" },
        { name: "Webinars Plus & Events", slug: "events" },
        { name: "Virtual Agent", slug: "virtual-agent" },
        { name: "Revenue Accelerator", slug: "iq" },
        { name: "Number Management", slug: "number-management" },
        { name: "Quality Management", slug: "quality-management" },
        { name: "Workforce Management", slug: "workforce-management" },
        { name: "Commerce", slug: "commerce" },
        { name: "Healthcare", slug: "healthcare" },
        { name: "Video Management", slug: "video-management" },
        { name: "Auto Dialer", slug: "auto-dialer" }
      ]
    },
    {
      name: "Accounts",
      categories: [
        { name: "Users", slug: "users" },
        { name: "Accounts", slug: "accounts" },
        { name: "QSS", slug: "qss" },
        { name: "SCIM 2", slug: "scim2" }
      ]
    },
    {
      name: "Build Platform",
      categories: [
        { name: "Video SDK", slug: "video-sdk" },
        { name: "Cobrowse SDK", slug: "cobrowse-sdk" }
      ]
    },
    {
      name: "Marketplace",
      categories: [
        { name: "Apps", slug: "marketplace" }
      ]
    }
  ]
};

// Cache configuration
const CACHE_KEY_PREFIX = 'apiSpec_';
const CACHE_METADATA_KEY = 'apiSpecMetadata';
const CACHE_EXPIRY_DAYS = 7;

// API Hub base URL
const API_HUB_BASE_URL = 'https://developers.zoom.us/api-hub';

/**
 * Get all category groups
 */
function getCategoryGroups() {
  return API_CATEGORIES.groups;
}

/**
 * Get flat list of all categories
 */
function getAllCategories() {
  const categories = [];
  API_CATEGORIES.groups.forEach(group => {
    group.categories.forEach(cat => {
      categories.push({
        ...cat,
        groupName: group.name
      });
    });
  });
  return categories;
}

/**
 * Build the endpoints.json URL for a category
 */
function buildSpecUrl(slug) {
  return `${API_HUB_BASE_URL}/${slug}/methods/endpoints.json`;
}

/**
 * Extract Granular Scopes from text
 * Granular scopes have 4 segments: resource:action:specific:level
 */
function extractGranularScopes(text) {
  if (!text) return [];

  // Match 4-segment scope pattern
  const granularPattern = /([a-z_]+:[a-z_]+:[a-z_]+:[a-z_]+)/g;
  const matches = text.match(granularPattern) || [];

  // Remove duplicates
  return [...new Set(matches)];
}

/**
 * Parse OpenAPI spec to internal format
 */
function parseOpenAPISpec(openApiJson, categoryName) {
  const endpoints = [];
  const paths = openApiJson.paths || {};

  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, details] of Object.entries(methods)) {
      // Skip non-HTTP methods
      if (!['get', 'post', 'put', 'patch', 'delete'].includes(method.toLowerCase())) {
        continue;
      }

      // Extract scopes from description and security
      let scopeText = details.description || '';

      // Also check security section
      if (details.security) {
        details.security.forEach(sec => {
          Object.values(sec).forEach(scopes => {
            if (Array.isArray(scopes)) {
              scopeText += ' ' + scopes.join(' ');
            }
          });
        });
      }

      const granularScopes = extractGranularScopes(scopeText);

      // Parse parameters
      const parameters = (details.parameters || []).map(param => ({
        name: param.name,
        in: param.in,
        required: param.required || false,
        type: param.schema?.type || 'string',
        description: param.description || '',
        default: param.schema?.default,
        enum: param.schema?.enum
      }));

      // Parse request body
      let requestBody = null;
      if (details.requestBody) {
        const content = details.requestBody.content;
        if (content && content['application/json']) {
          const schema = content['application/json'].schema;
          requestBody = {
            required: details.requestBody.required || false,
            schema: schema,
            example: content['application/json'].example || generateExampleFromSchema(schema)
          };
        }
      }

      // Get tags for sub-categorization
      const tags = details.tags || [categoryName];

      endpoints.push({
        method: method.toUpperCase(),
        path: path,
        summary: details.summary || '',
        description: details.description || '',
        operationId: details.operationId || '',
        scopes: granularScopes,
        parameters: parameters,
        requestBody: requestBody,
        tags: tags
      });
    }
  }

  return {
    name: categoryName,
    info: openApiJson.info || {},
    servers: openApiJson.servers || [],
    endpoints: endpoints,
    fetchedAt: new Date().toISOString()
  };
}

/**
 * Generate example object from JSON schema
 */
function generateExampleFromSchema(schema) {
  if (!schema) return {};

  if (schema.example) return schema.example;

  if (schema.type === 'object' && schema.properties) {
    const example = {};
    for (const [key, prop] of Object.entries(schema.properties)) {
      if (prop.example !== undefined) {
        example[key] = prop.example;
      } else if (prop.type === 'string') {
        example[key] = prop.enum ? prop.enum[0] : '';
      } else if (prop.type === 'integer' || prop.type === 'number') {
        example[key] = prop.default || 0;
      } else if (prop.type === 'boolean') {
        example[key] = prop.default || false;
      } else if (prop.type === 'array') {
        example[key] = [];
      } else if (prop.type === 'object') {
        example[key] = {};
      }
    }
    return example;
  }

  return {};
}

/**
 * Fetch and parse spec for a category
 */
async function fetchCategorySpec(slug, categoryName) {
  const url = buildSpecUrl(slug);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch spec for ${categoryName}: ${response.status}`);
  }

  const openApiJson = await response.json();
  return parseOpenAPISpec(openApiJson, categoryName);
}

/**
 * Get cached spec for a category
 */
async function getCachedSpec(slug) {
  const cacheKey = CACHE_KEY_PREFIX + slug;
  const result = await chrome.storage.local.get([cacheKey, CACHE_METADATA_KEY]);

  const metadata = result[CACHE_METADATA_KEY] || {};
  const cachedData = result[cacheKey];

  if (!cachedData) return null;

  // Check expiry
  const categoryMeta = metadata[slug];
  if (categoryMeta) {
    const fetchedAt = new Date(categoryMeta.fetchedAt);
    const now = new Date();
    const daysSinceFetch = (now - fetchedAt) / (1000 * 60 * 60 * 24);

    if (daysSinceFetch > CACHE_EXPIRY_DAYS) {
      return null; // Cache expired
    }
  }

  return cachedData;
}

/**
 * Save spec to cache
 */
async function cacheSpec(slug, spec) {
  const cacheKey = CACHE_KEY_PREFIX + slug;

  // Get existing metadata
  const result = await chrome.storage.local.get(CACHE_METADATA_KEY);
  const metadata = result[CACHE_METADATA_KEY] || {};

  // Update metadata
  metadata[slug] = {
    fetchedAt: spec.fetchedAt,
    endpointCount: spec.endpoints.length
  };

  // Save to storage
  await chrome.storage.local.set({
    [cacheKey]: spec,
    [CACHE_METADATA_KEY]: metadata
  });
}

/**
 * Get spec for a category (with caching)
 */
async function getSpec(slug, categoryName, forceRefresh = false) {
  if (!forceRefresh) {
    const cached = await getCachedSpec(slug);
    if (cached) {
      return { spec: cached, fromCache: true };
    }
  }

  const spec = await fetchCategorySpec(slug, categoryName);
  await cacheSpec(slug, spec);
  return { spec, fromCache: false };
}

/**
 * Get cache metadata for all categories
 */
async function getCacheMetadata() {
  const result = await chrome.storage.local.get(CACHE_METADATA_KEY);
  return result[CACHE_METADATA_KEY] || {};
}

/**
 * Clear all cached specs
 */
async function clearAllCache() {
  const categories = getAllCategories();
  const keysToRemove = categories.map(cat => CACHE_KEY_PREFIX + cat.slug);
  keysToRemove.push(CACHE_METADATA_KEY);
  await chrome.storage.local.remove(keysToRemove);
}

/**
 * Clear cache for a specific category
 */
async function clearCategoryCache(slug) {
  const cacheKey = CACHE_KEY_PREFIX + slug;

  // Update metadata
  const result = await chrome.storage.local.get(CACHE_METADATA_KEY);
  const metadata = result[CACHE_METADATA_KEY] || {};
  delete metadata[slug];

  await chrome.storage.local.remove(cacheKey);
  await chrome.storage.local.set({ [CACHE_METADATA_KEY]: metadata });
}

// Export for use in popup.js
window.ApiSpecLoader = {
  getCategoryGroups,
  getAllCategories,
  getSpec,
  getCacheMetadata,
  clearAllCache,
  clearCategoryCache,
  buildSpecUrl,
  CACHE_EXPIRY_DAYS
};
