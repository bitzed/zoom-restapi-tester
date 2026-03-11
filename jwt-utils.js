// JWT Utility for Build Platform API authentication
// Implements HS256 JWT signing using Web Crypto API

/**
 * Base64URL encode a string or ArrayBuffer
 */
function base64UrlEncode(data) {
  let base64;
  if (typeof data === 'string') {
    base64 = btoa(data);
  } else {
    // ArrayBuffer
    const bytes = new Uint8Array(data);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    base64 = btoa(binary);
  }
  // Convert to base64url
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Generate HS256 JWT token
 * @param {string} apiKey - Zoom API Key (used as 'iss' claim)
 * @param {string} apiSecret - Zoom API Secret (used as signing key)
 * @param {number} expirationMinutes - Token expiration time in minutes (default: 120)
 * @returns {Promise<string>} - JWT token
 */
async function generateJWT(apiKey, apiSecret, expirationMinutes = 120) {
  const iat = Math.floor(Date.now() / 1000) - 30; // 30 seconds before current time
  const exp = iat + (60 * expirationMinutes);

  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const payload = {
    iss: apiKey,
    iat: iat,
    exp: exp
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const message = `${encodedHeader}.${encodedPayload}`;

  // Create HMAC-SHA256 signature
  const encoder = new TextEncoder();
  const keyData = encoder.encode(apiSecret);
  const messageData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const encodedSignature = base64UrlEncode(signature);

  return `${message}.${encodedSignature}`;
}

/**
 * Validate that API Key and Secret are configured
 */
function hasJWTCredentials(credentials) {
  return !!(credentials.apiKey && credentials.apiSecret);
}

// Export for use in popup.js
window.JWTUtils = {
  generateJWT,
  hasJWTCredentials
};
