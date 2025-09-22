Cookies - Complete Code Examples

--------------------------------------------------------------------------------

1. Basic Cookie Operations

```javascript
// Set cookie
document.cookie = "username=john; expires=Thu, 18 Dec 2024 12:00:00 UTC; path=/";
document.cookie = "sessionId=abc123; secure; httpOnly; sameSite=strict";

// Read cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Delete cookie
function deleteCookie(name, path = '/') {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
}

// Get all cookies
function getAllCookies() {
  const cookies = {};
  document.cookie.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=');
    if (name && value) {
      cookies[name] = value;
    }
  });
  return cookies;
}
```

--------------------------------------------------------------------------------

2. Cookie Utility Class

```javascript
class CookieManager {
  // Set cookie with options
  static set(name, value, options = {}) {
    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    if (options.expires) {
      cookieString += `; expires=${options.expires.toUTCString()}`;
    }
    
    if (options.maxAge) {
      cookieString += `; max-age=${options.maxAge}`;
    }
    
    if (options.path) {
      cookieString += `; path=${options.path}`;
    }
    
    if (options.domain) {
      cookieString += `; domain=${options.domain}`;
    }
    
    if (options.secure) {
      cookieString += `; secure`;
    }
    
    if (options.httpOnly) {
      cookieString += `; httpOnly`;
    }
    
    if (options.sameSite) {
      cookieString += `; sameSite=${options.sameSite}`;
    }
    
    document.cookie = cookieString;
  }
  
  // Get cookie value
  static get(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${encodeURIComponent(name)}=`);
    if (parts.length === 2) {
      return decodeURIComponent(parts.pop().split(';').shift());
    }
    return null;
  }
  
  // Delete cookie
  static delete(name, path = '/') {
    document.cookie = `${encodeURIComponent(name)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
  }
  
  // Get all cookies as object
  static getAll() {
    const cookies = {};
    document.cookie.split(';').forEach(cookie => {
      const [name, value] = cookie.trim().split('=');
      if (name && value) {
        cookies[decodeURIComponent(name)] = decodeURIComponent(value);
      }
    });
    return cookies;
  }
  
  // Check if cookie exists
  static exists(name) {
    return this.get(name) !== null;
  }
  
  // Set cookie with expiration date
  static setWithExpiry(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    
    this.set(name, value, {
      expires: expires,
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });
  }
  
  // Get cookie size in bytes
  static getSize(name) {
    const cookie = this.get(name);
    return cookie ? encodeURIComponent(cookie).length : 0;
  }
  
  // Get total cookie size
  static getTotalSize() {
    return document.cookie.length;
  }
}
```

--------------------------------------------------------------------------------

3. Cookie Usage Examples

```javascript
// Set various types of cookies
CookieManager.set('userPreference', 'dark', {
  maxAge: 86400, // 24 hours
  path: '/',
  secure: true,
  sameSite: 'strict'
});

CookieManager.set('sessionToken', 'abc123xyz', {
  expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  httpOnly: true,
  secure: true,
  sameSite: 'strict'
});

// Get cookie values
const userPref = CookieManager.get('userPreference');
const sessionToken = CookieManager.get('sessionToken');

// Check if cookie exists
if (CookieManager.exists('userPreference')) {
  console.log('User preference cookie exists');
}

// Get all cookies
const allCookies = CookieManager.getAll();
console.log('All cookies:', allCookies);

// Delete cookie
CookieManager.delete('oldCookie');

// Set with expiry helper
CookieManager.setWithExpiry('tempData', 'temporary', 1); // Expires in 1 day
```

--------------------------------------------------------------------------------

4. Cookie with Expiration Helper

```javascript
class CookieWithExpiry {
  static set(name, value, expiryDays) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
    
    CookieManager.set(name, value, {
      expires: expires,
      path: '/',
      secure: window.location.protocol === 'https:',
      sameSite: 'strict'
    });
  }
  
  static get(name) {
    return CookieManager.get(name);
  }
  
  static isExpired(name) {
    const cookieValue = CookieManager.get(name);
    return cookieValue === null;
  }
  
  static getRemainingTime(name) {
    const cookieValue = CookieManager.get(name);
    if (!cookieValue) return 0;
    
    // This is a simplified implementation
    // In practice, you'd need to store expiry info in the cookie value
    return 3600000; // 1 hour default
  }
}

// Usage
CookieWithExpiry.set('tempData', JSON.stringify({temp: 'value'}), 1); // Expires in 1 day
const tempData = CookieWithExpiry.get('tempData');

// Check if expired
if (CookieWithExpiry.isExpired('tempData')) {
  console.log('Data has expired');
}
```

--------------------------------------------------------------------------------

5. Server-side Cookie Examples (Node.js/Express)

```javascript
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// Set cookies
app.get('/set-cookies', (req, res) => {
  // Set multiple cookies
  res.cookie('username', 'john', {
    maxAge: 900000, // 15 minutes
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });
  
  res.cookie('theme', 'dark', {
    maxAge: 86400000, // 24 hours
    path: '/',
    secure: true,
    sameSite: 'lax'
  });
  
  res.json({ message: 'Cookies set successfully' });
});

// Read cookies
app.get('/get-cookies', (req, res) => {
  const username = req.cookies.username;
  const theme = req.cookies.theme;
  
  res.json({
    username: username,
    theme: theme,
    allCookies: req.cookies
  });
});

// Clear cookies
app.get('/clear-cookies', (req, res) => {
  res.clearCookie('username');
  res.clearCookie('theme');
  res.json({ message: 'Cookies cleared' });
});

// Advanced cookie handling
app.get('/secure-cookie', (req, res) => {
  res.cookie('sessionToken', generateToken(), {
    maxAge: 1800000, // 30 minutes
    httpOnly: true, // Prevent XSS
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // Prevent CSRF
    path: '/',
    domain: '.example.com' // Subdomain sharing
  });
  
  res.json({ message: 'Secure cookie set' });
});

// Cookie validation middleware
function validateCookies(req, res, next) {
  const requiredCookies = ['sessionToken', 'userId'];
  const missingCookies = requiredCookies.filter(cookie => !req.cookies[cookie]);
  
  if (missingCookies.length > 0) {
    return res.status(400).json({
      error: 'Missing required cookies',
      missing: missingCookies
    });
  }
  
  next();
}

// Use validation middleware
app.get('/protected', validateCookies, (req, res) => {
  res.json({ message: 'Access granted', user: req.cookies.userId });
});
```

--------------------------------------------------------------------------------

6. Cookie Security Best Practices

```javascript
class SecureCookie {
  static setSecureCookie(name, value, options = {}) {
    const secureOptions = {
      httpOnly: true, // Prevent XSS
      secure: window.location.protocol === 'https:', // HTTPS only
      sameSite: 'strict', // Prevent CSRF
      path: '/',
      maxAge: 3600, // 1 hour default
      ...options
    };
    
    CookieManager.set(name, value, secureOptions);
  }
  
  static setSessionCookie(name, value) {
    this.setSecureCookie(name, value, {
      maxAge: 1800 // 30 minutes for session
    });
  }
  
  static setPersistentCookie(name, value, days = 30) {
    this.setSecureCookie(name, value, {
      maxAge: days * 24 * 60 * 60 // Convert days to seconds
    });
  }
  
  static setAuthenticationCookie(token) {
    this.setSecureCookie('authToken', token, {
      maxAge: 3600, // 1 hour
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
  }
  
  static setPreferenceCookie(preferences) {
    CookieManager.set('preferences', JSON.stringify(preferences), {
      maxAge: 86400 * 30, // 30 days
      secure: true,
      sameSite: 'lax' // Allow cross-site requests for preferences
    });
  }
}

// Usage
SecureCookie.setAuthenticationCookie('jwt-token-here');
SecureCookie.setSessionCookie('sessionId', 'session-123');
SecureCookie.setPreferenceCookie({ theme: 'dark', language: 'en' });
```

--------------------------------------------------------------------------------

7. Cookie Consent Management

```javascript
class CookieConsent {
  constructor() {
    this.consentTypes = {
      necessary: true, // Always true
      functional: false,
      analytics: false,
      marketing: false
    };
  }
  
  static hasConsent(type = 'necessary') {
    const consent = CookieManager.get('cookieConsent');
    if (!consent) return type === 'necessary';
    
    try {
      const parsedConsent = JSON.parse(consent);
      return parsedConsent[type] || false;
    } catch (error) {
      return type === 'necessary';
    }
  }
  
  static setConsent(consentData) {
    const consent = {
      necessary: true,
      functional: consentData.functional || false,
      analytics: consentData.analytics || false,
      marketing: consentData.marketing || false,
      timestamp: new Date().toISOString()
    };
    
    CookieManager.set('cookieConsent', JSON.stringify(consent), {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      secure: true,
      sameSite: 'strict'
    });
  }
  
  static showConsentBanner() {
    if (!this.hasConsent('functional')) {
      this.displayBanner();
    }
  }
  
  static displayBanner() {
    // Create consent banner HTML
    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <div class="cookie-banner">
        <p>We use cookies to enhance your experience. Please choose your preferences:</p>
        <div class="cookie-options">
          <label>
            <input type="checkbox" id="functional" checked> Functional Cookies
          </label>
          <label>
            <input type="checkbox" id="analytics"> Analytics Cookies
          </label>
          <label>
            <input type="checkbox" id="marketing"> Marketing Cookies
          </label>
        </div>
        <div class="cookie-buttons">
          <button id="accept-all">Accept All</button>
          <button id="accept-selected">Accept Selected</button>
          <button id="reject-all">Reject All</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);
    
    // Add event listeners
    document.getElementById('accept-all').addEventListener('click', () => {
      this.setConsent({ functional: true, analytics: true, marketing: true });
      this.hideBanner();
    });
    
    document.getElementById('accept-selected').addEventListener('click', () => {
      const consent = {
        functional: document.getElementById('functional').checked,
        analytics: document.getElementById('analytics').checked,
        marketing: document.getElementById('marketing').checked
      };
      this.setConsent(consent);
      this.hideBanner();
    });
    
    document.getElementById('reject-all').addEventListener('click', () => {
      this.setConsent({ functional: false, analytics: false, marketing: false });
      this.hideBanner();
    });
  }
  
  static hideBanner() {
    const banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.remove();
    }
  }
  
  static canSetCookie(type) {
    return this.hasConsent(type);
  }
}

// Usage
if (!CookieConsent.hasConsent('functional')) {
  CookieConsent.showConsentBanner();
}

// Check before setting cookies
if (CookieConsent.canSetCookie('analytics')) {
  // Set analytics cookie
  CookieManager.set('analyticsId', generateAnalyticsId());
}
```

--------------------------------------------------------------------------------

8. Cookie Validation and Sanitization

```javascript
class CookieValidator {
  static sanitizeValue(value) {
    // Remove potentially dangerous characters
    return value.replace(/[<>\"'&]/g, '');
  }
  
  static isValidCookieName(name) {
    // Cookie names should only contain alphanumeric and some special chars
    return /^[a-zA-Z0-9_-]+$/.test(name);
  }
  
  static isValidCookieValue(value) {
    // Check for reasonable length and content
    if (value.length > 4000) return false; // 4KB limit
    if (/[<>\"']/.test(value)) return false; // No HTML/script tags
    return true;
  }
  
  static setValidatedCookie(name, value, options = {}) {
    if (!this.isValidCookieName(name)) {
      throw new Error('Invalid cookie name');
    }
    
    if (!this.isValidCookieValue(value)) {
      throw new Error('Invalid cookie value');
    }
    
    const sanitizedValue = this.sanitizeValue(value);
    CookieManager.set(name, sanitizedValue, options);
  }
  
  static validateExistingCookies() {
    const cookies = CookieManager.getAll();
    const invalidCookies = [];
    
    for (const [name, value] of Object.entries(cookies)) {
      if (!this.isValidCookieName(name)) {
        invalidCookies.push({ name, reason: 'Invalid name' });
      }
      
      if (!this.isValidCookieValue(value)) {
        invalidCookies.push({ name, reason: 'Invalid value' });
      }
    }
    
    return invalidCookies;
  }
  
  static cleanupInvalidCookies() {
    const invalidCookies = this.validateExistingCookies();
    
    invalidCookies.forEach(cookie => {
      CookieManager.delete(cookie.name);
      console.warn(`Removed invalid cookie: ${cookie.name} (${cookie.reason})`);
    });
    
    return invalidCookies.length;
  }
}

// Usage
try {
  CookieValidator.setValidatedCookie('userData', JSON.stringify({name: 'John'}));
} catch (error) {
  console.error('Cookie validation failed:', error.message);
}

// Cleanup existing cookies
const removedCount = CookieValidator.cleanupInvalidCookies();
console.log(`Removed ${removedCount} invalid cookies`);
```

--------------------------------------------------------------------------------

9. Cookie Performance Monitoring

```javascript
class CookiePerformanceMonitor {
  constructor() {
    this.metrics = {
      totalCookies: 0,
      totalSize: 0,
      largestCookie: { name: '', size: 0 },
      domainCookies: {}
    };
  }
  
  analyzeCookies() {
    const cookies = CookieManager.getAll();
    this.metrics.totalCookies = Object.keys(cookies).length;
    this.metrics.totalSize = CookieManager.getTotalSize();
    
    // Find largest cookie
    for (const [name, value] of Object.entries(cookies)) {
      const size = CookieManager.getSize(name);
      if (size > this.metrics.largestCookie.size) {
        this.metrics.largestCookie = { name, size };
      }
    }
    
    // Analyze by domain
    this.analyzeDomainCookies();
    
    return this.metrics;
  }
  
  analyzeDomainCookies() {
    const cookies = document.cookie.split(';');
    
    cookies.forEach(cookie => {
      const [nameValue, ...attributes] = cookie.trim().split(';');
      const [name, value] = nameValue.split('=');
      
      // Extract domain from attributes
      let domain = window.location.hostname;
      attributes.forEach(attr => {
        if (attr.trim().startsWith('domain=')) {
          domain = attr.trim().substring(7);
        }
      });
      
      if (!this.metrics.domainCookies[domain]) {
        this.metrics.domainCookies[domain] = {
          count: 0,
          size: 0,
          cookies: []
        };
      }
      
      this.metrics.domainCookies[domain].count++;
      this.metrics.domainCookies[domain].size += (name + value).length;
      this.metrics.domainCookies[domain].cookies.push(name);
    });
  }
  
  getRecommendations() {
    const recommendations = [];
    
    if (this.metrics.totalSize > 4000) {
      recommendations.push('Total cookie size exceeds 4KB limit');
    }
    
    if (this.metrics.totalCookies > 20) {
      recommendations.push('Too many cookies (>20), consider consolidation');
    }
    
    if (this.metrics.largestCookie.size > 1000) {
      recommendations.push(`Largest cookie "${this.metrics.largestCookie.name}" is very large`);
    }
    
    return recommendations;
  }
  
  logReport() {
    console.log('Cookie Performance Report:');
    console.log(`Total cookies: ${this.metrics.totalCookies}`);
    console.log(`Total size: ${this.metrics.totalSize} bytes`);
    console.log(`Largest cookie: ${this.metrics.largestCookie.name} (${this.metrics.largestCookie.size} bytes)`);
    console.log('Domain breakdown:', this.metrics.domainCookies);
    
    const recommendations = this.getRecommendations();
    if (recommendations.length > 0) {
      console.log('Recommendations:');
      recommendations.forEach(rec => console.log(`- ${rec}`));
    }
  }
}

// Usage
const monitor = new CookiePerformanceMonitor();
monitor.analyzeCookies();
monitor.logReport();
```

--------------------------------------------------------------------------------

10. Advanced Cookie Patterns

```javascript
// Cookie-based session management
class SessionManager {
  constructor() {
    this.sessionKey = 'sessionData';
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
  }
  
  createSession(userId, userData) {
    const sessionData = {
      userId: userId,
      userData: userData,
      createdAt: Date.now(),
      lastActivity: Date.now()
    };
    
    SecureCookie.setSecureCookie(this.sessionKey, JSON.stringify(sessionData), {
      maxAge: this.sessionTimeout / 1000,
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });
  }
  
  getSession() {
    const sessionCookie = CookieManager.get(this.sessionKey);
    if (!sessionCookie) return null;
    
    try {
      const sessionData = JSON.parse(sessionCookie);
      
      // Check if session is expired
      if (Date.now() - sessionData.lastActivity > this.sessionTimeout) {
        this.destroySession();
        return null;
      }
      
      // Update last activity
      this.updateLastActivity();
      
      return sessionData;
    } catch (error) {
      console.error('Invalid session data:', error);
      this.destroySession();
      return null;
    }
  }
  
  updateLastActivity() {
    const session = this.getSession();
    if (session) {
      session.lastActivity = Date.now();
      SecureCookie.setSecureCookie(this.sessionKey, JSON.stringify(session), {
        maxAge: this.sessionTimeout / 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
    }
  }
  
  destroySession() {
    CookieManager.delete(this.sessionKey);
  }
  
  isSessionValid() {
    return this.getSession() !== null;
  }
}

// Cookie-based feature flags
class FeatureFlags {
  constructor() {
    this.flagsKey = 'featureFlags';
  }
  
  setFlag(flagName, value) {
    const flags = this.getAllFlags();
    flags[flagName] = value;
    
    CookieManager.set(this.flagsKey, JSON.stringify(flags), {
      maxAge: 86400 * 7, // 7 days
      secure: true,
      sameSite: 'lax'
    });
  }
  
  getFlag(flagName, defaultValue = false) {
    const flags = this.getAllFlags();
    return flags[flagName] !== undefined ? flags[flagName] : defaultValue;
  }
  
  getAllFlags() {
    const flagsCookie = CookieManager.get(this.flagsKey);
    if (!flagsCookie) return {};
    
    try {
      return JSON.parse(flagsCookie);
    } catch (error) {
      console.error('Invalid feature flags data:', error);
      return {};
    }
  }
  
  removeFlag(flagName) {
    const flags = this.getAllFlags();
    delete flags[flagName];
    
    if (Object.keys(flags).length === 0) {
      CookieManager.delete(this.flagsKey);
    } else {
      CookieManager.set(this.flagsKey, JSON.stringify(flags), {
        maxAge: 86400 * 7,
        secure: true,
        sameSite: 'lax'
      });
    }
  }
}

// Cookie-based A/B testing
class ABTestManager {
  constructor() {
    this.testKey = 'abTests';
  }
  
  assignTest(testName, variants) {
    const tests = this.getAllTests();
    
    if (!tests[testName]) {
      const randomIndex = Math.floor(Math.random() * variants.length);
      tests[testName] = {
        variant: variants[randomIndex],
        assignedAt: Date.now()
      };
      
      this.saveTests(tests);
    }
    
    return tests[testName].variant;
  }
  
  getTestVariant(testName) {
    const tests = this.getAllTests();
    return tests[testName] ? tests[testName].variant : null;
  }
  
  getAllTests() {
    const testsCookie = CookieManager.get(this.testKey);
    if (!testsCookie) return {};
    
    try {
      return JSON.parse(testsCookie);
    } catch (error) {
      console.error('Invalid A/B test data:', error);
      return {};
    }
  }
  
  saveTests(tests) {
    CookieManager.set(this.testKey, JSON.stringify(tests), {
      maxAge: 86400 * 30, // 30 days
      secure: true,
      sameSite: 'lax'
    });
  }
}

// Usage examples
const sessionManager = new SessionManager();
const featureFlags = new FeatureFlags();
const abTestManager = new ABTestManager();

// Session management
sessionManager.createSession('user123', { name: 'John', role: 'admin' });
const session = sessionManager.getSession();

// Feature flags
featureFlags.setFlag('newCheckout', true);
const useNewCheckout = featureFlags.getFlag('newCheckout');

// A/B testing
const buttonColor = abTestManager.assignTest('buttonColor', ['red', 'blue', 'green']);
console.log('User assigned to:', buttonColor);
```
