localStorage - Complete Code Examples

--------------------------------------------------------------------------------

1. Basic localStorage Operations

```javascript
// Store data
localStorage.setItem('userTheme', 'dark');
localStorage.setItem('userData', JSON.stringify({name: 'John', age: 30}));
localStorage.setItem('lastVisit', new Date().toISOString());

// Retrieve data
const theme = localStorage.getItem('userTheme');
const user = JSON.parse(localStorage.getItem('userData') || '{}');
const lastVisit = localStorage.getItem('lastVisit');

// Check if key exists
if (localStorage.getItem('userData')) {
  console.log('User data exists');
}

// Remove specific data
localStorage.removeItem('userTheme');

// Clear all localStorage data
localStorage.clear();
```

--------------------------------------------------------------------------------

2. localStorage with Error Handling

```javascript
function setLocalStorageItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('localStorage error:', error);
    return false;
  }
}

function getLocalStorageItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('localStorage error:', error);
    return null;
  }
}

// Usage with error handling
const success = setLocalStorageItem('userPrefs', {theme: 'dark', lang: 'en'});
if (success) {
  console.log('Data saved successfully');
} else {
  console.log('Failed to save data');
}
```

--------------------------------------------------------------------------------

3. localStorage Storage Management

```javascript
function getLocalStorageSize() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length + key.length;
    }
  }
  return total;
}

function getLocalStorageUsage() {
  const size = getLocalStorageSize();
  const sizeKB = (size / 1024).toFixed(2);
  const sizeMB = (size / (1024 * 1024)).toFixed(2);
  
  return {
    bytes: size,
    kilobytes: sizeKB,
    megabytes: sizeMB
  };
}

// Check storage quota
function checkStorageQuota() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    navigator.storage.estimate().then(estimate => {
      const used = (estimate.usage / (1024 * 1024)).toFixed(2);
      const quota = (estimate.quota / (1024 * 1024)).toFixed(2);
      const percentage = ((estimate.usage / estimate.quota) * 100).toFixed(2);
      
      console.log(`Used: ${used} MB`);
      console.log(`Available: ${quota} MB`);
      console.log(`Usage: ${percentage}%`);
    });
  }
}

// Usage
console.log('Current usage:', getLocalStorageUsage());
checkStorageQuota();
```

--------------------------------------------------------------------------------

4. localStorage with Expiration

```javascript
function setWithExpiry(key, value, expiryMinutes) {
  const now = new Date();
  const item = {
    value: value,
    expiry: now.getTime() + (expiryMinutes * 60 * 1000)
  };
  localStorage.setItem(key, JSON.stringify(item));
}

function getWithExpiry(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error parsing localStorage item:', error);
    return null;
  }
}

function isExpired(key) {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return true;
  
  try {
    const item = JSON.parse(itemStr);
    const now = new Date();
    return now.getTime() > item.expiry;
  } catch (error) {
    return true;
  }
}

// Usage
setWithExpiry('tempData', {temp: 'value'}, 30); // Expires in 30 minutes
const tempData = getWithExpiry('tempData');

// Check if expired
if (isExpired('tempData')) {
  console.log('Data has expired');
}
```

--------------------------------------------------------------------------------

5. localStorage Utility Class

```javascript
class LocalStorageManager {
  constructor(prefix = '') {
    this.prefix = prefix;
  }
  
  set(key, value, expiryMinutes = null) {
    try {
      const finalKey = this.prefix + key;
      
      if (expiryMinutes) {
        const now = new Date();
        const item = {
          value: value,
          expiry: now.getTime() + (expiryMinutes * 60 * 1000)
        };
        localStorage.setItem(finalKey, JSON.stringify(item));
      } else {
        localStorage.setItem(finalKey, JSON.stringify(value));
      }
      return true;
    } catch (error) {
      console.error('localStorage set error:', error);
      return false;
    }
  }
  
  get(key) {
    try {
      const finalKey = this.prefix + key;
      const itemStr = localStorage.getItem(finalKey);
      
      if (!itemStr) return null;
      
      const item = JSON.parse(itemStr);
      
      // Check if item has expiry
      if (item.expiry && new Date().getTime() > item.expiry) {
        localStorage.removeItem(finalKey);
        return null;
      }
      
      return item.value !== undefined ? item.value : item;
    } catch (error) {
      console.error('localStorage get error:', error);
      return null;
    }
  }
  
  remove(key) {
    try {
      const finalKey = this.prefix + key;
      localStorage.removeItem(finalKey);
      return true;
    } catch (error) {
      console.error('localStorage remove error:', error);
      return false;
    }
  }
  
  clear() {
    try {
      if (this.prefix) {
        // Clear only items with this prefix
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith(this.prefix)) {
            localStorage.removeItem(key);
          }
        });
      } else {
        localStorage.clear();
      }
      return true;
    } catch (error) {
      console.error('localStorage clear error:', error);
      return false;
    }
  }
  
  getAll() {
    const result = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!this.prefix || key.startsWith(this.prefix)) {
          const value = this.get(key.replace(this.prefix, ''));
          if (value !== null) {
            result[key.replace(this.prefix, '')] = value;
          }
        }
      }
    } catch (error) {
      console.error('localStorage getAll error:', error);
    }
    return result;
  }
  
  exists(key) {
    const finalKey = this.prefix + key;
    return localStorage.getItem(finalKey) !== null;
  }
  
  getSize() {
    let total = 0;
    try {
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          if (!this.prefix || key.startsWith(this.prefix)) {
            total += localStorage[key].length + key.length;
          }
        }
      }
    } catch (error) {
      console.error('localStorage getSize error:', error);
    }
    return total;
  }
}

// Usage
const userStorage = new LocalStorageManager('user_');
const appStorage = new LocalStorageManager('app_');

// Set user data with expiry
userStorage.set('preferences', {theme: 'dark', lang: 'en'}, 60); // 1 hour

// Set app data without expiry
appStorage.set('settings', {debug: true, version: '1.0'});

// Get data
const userPrefs = userStorage.get('preferences');
const appSettings = appStorage.get('settings');

// Check if exists
if (userStorage.exists('preferences')) {
  console.log('User preferences exist');
}

// Get all data
const allUserData = userStorage.getAll();
const allAppData = appStorage.getAll();

// Get storage size
console.log('User storage size:', userStorage.getSize(), 'bytes');
```

--------------------------------------------------------------------------------

6. localStorage with Encryption (Basic)

```javascript
class SecureLocalStorage {
  constructor(secretKey = 'default-key') {
    this.secretKey = secretKey;
  }
  
  // Simple XOR encryption (not for production use)
  encrypt(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(
        text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
      );
    }
    return btoa(result);
  }
  
  decrypt(encryptedText) {
    try {
      const text = atob(encryptedText);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(
          text.charCodeAt(i) ^ this.secretKey.charCodeAt(i % this.secretKey.length)
        );
      }
      return result;
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }
  
  set(key, value) {
    try {
      const encryptedValue = this.encrypt(JSON.stringify(value));
      localStorage.setItem(key, encryptedValue);
      return true;
    } catch (error) {
      console.error('Secure storage set error:', error);
      return false;
    }
  }
  
  get(key) {
    try {
      const encryptedValue = localStorage.getItem(key);
      if (!encryptedValue) return null;
      
      const decryptedValue = this.decrypt(encryptedValue);
      if (!decryptedValue) return null;
      
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }
}

// Usage
const secureStorage = new SecureLocalStorage('my-secret-key');
secureStorage.set('sensitiveData', {token: 'abc123', user: 'john'});
const data = secureStorage.get('sensitiveData');
```

--------------------------------------------------------------------------------

7. localStorage Event Handling

```javascript
// Listen for storage changes
window.addEventListener('storage', (event) => {
  console.log('Storage changed:');
  console.log('Key:', event.key);
  console.log('Old value:', event.oldValue);
  console.log('New value:', event.newValue);
  console.log('URL:', event.url);
  
  // Handle specific key changes
  if (event.key === 'userTheme') {
    updateTheme(event.newValue);
  }
  
  if (event.key === 'userData') {
    updateUserInterface(JSON.parse(event.newValue));
  }
});

// Custom storage event for same-tab changes
function triggerStorageEvent(key, newValue, oldValue) {
  const event = new StorageEvent('storage', {
    key: key,
    newValue: newValue,
    oldValue: oldValue,
    url: window.location.href
  });
  window.dispatchEvent(event);
}

// Enhanced setItem that triggers events
function setItemWithEvent(key, value) {
  const oldValue = localStorage.getItem(key);
  localStorage.setItem(key, JSON.stringify(value));
  triggerStorageEvent(key, JSON.stringify(value), oldValue);
}

function updateTheme(theme) {
  document.body.className = theme;
  console.log('Theme updated to:', theme);
}

function updateUserInterface(userData) {
  if (userData.name) {
    document.getElementById('userName').textContent = userData.name;
  }
  console.log('User interface updated');
}
```

--------------------------------------------------------------------------------

8. localStorage with Data Validation

```javascript
class ValidatedLocalStorage {
  constructor(schema = {}) {
    this.schema = schema;
  }
  
  validate(key, value) {
    if (this.schema[key]) {
      const rules = this.schema[key];
      
      // Type validation
      if (rules.type && typeof value !== rules.type) {
        throw new Error(`Value for ${key} must be of type ${rules.type}`);
      }
      
      // Required validation
      if (rules.required && (value === null || value === undefined)) {
        throw new Error(`${key} is required`);
      }
      
      // Custom validation
      if (rules.validate && !rules.validate(value)) {
        throw new Error(`Validation failed for ${key}`);
      }
      
      // Max length validation
      if (rules.maxLength && value.length > rules.maxLength) {
        throw new Error(`${key} exceeds maximum length of ${rules.maxLength}`);
      }
    }
    
    return true;
  }
  
  set(key, value) {
    try {
      this.validate(key, value);
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Validation error:', error.message);
      return false;
    }
  }
  
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Parse error:', error);
      return null;
    }
  }
}

// Define schema
const schema = {
  userData: {
    type: 'object',
    required: true,
    validate: (value) => value && value.name && value.email
  },
  theme: {
    type: 'string',
    required: true,
    validate: (value) => ['light', 'dark', 'auto'].includes(value)
  },
  preferences: {
    type: 'object',
    validate: (value) => value && typeof value === 'object'
  }
};

// Usage
const validatedStorage = new ValidatedLocalStorage(schema);

// This will succeed
validatedStorage.set('userData', {
  name: 'John Doe',
  email: 'john@example.com'
});

validatedStorage.set('theme', 'dark');

// This will fail validation
validatedStorage.set('theme', 'invalid'); // Will fail
validatedStorage.set('userData', {name: 'John'}); // Will fail (missing email)
```

--------------------------------------------------------------------------------

9. localStorage Performance Optimization

```javascript
class PerformanceLocalStorage {
  constructor() {
    this.cache = new Map();
    this.batchOperations = [];
    this.isProcessingBatch = false;
  }
  
  // Batch operations for better performance
  batchSet(operations) {
    this.batchOperations = this.batchOperations.concat(operations);
    this.processBatch();
  }
  
  async processBatch() {
    if (this.isProcessingBatch || this.batchOperations.length === 0) {
      return;
    }
    
    this.isProcessingBatch = true;
    
    try {
      // Process all operations at once
      while (this.batchOperations.length > 0) {
        const operation = this.batchOperations.shift();
        
        if (operation.type === 'set') {
          localStorage.setItem(operation.key, JSON.stringify(operation.value));
          this.cache.set(operation.key, operation.value);
        } else if (operation.type === 'remove') {
          localStorage.removeItem(operation.key);
          this.cache.delete(operation.key);
        }
      }
    } catch (error) {
      console.error('Batch operation error:', error);
    } finally {
      this.isProcessingBatch = false;
    }
  }
  
  // Cache frequently accessed data
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.cache.set(key, value);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  }
  
  get(key) {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }
    
    try {
      const item = localStorage.getItem(key);
      const value = item ? JSON.parse(item) : null;
      
      if (value !== null) {
        this.cache.set(key, value);
      }
      
      return value;
    } catch (error) {
      console.error('Storage error:', error);
      return null;
    }
  }
  
  // Preload frequently used data
  preload(keys) {
    keys.forEach(key => {
      if (!this.cache.has(key)) {
        this.get(key); // This will cache the result
      }
    });
  }
  
  // Clear cache
  clearCache() {
    this.cache.clear();
  }
  
  // Get cache stats
  getCacheStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Usage
const perfStorage = new PerformanceLocalStorage();

// Batch operations
perfStorage.batchSet([
  { type: 'set', key: 'user1', value: { name: 'John' } },
  { type: 'set', key: 'user2', value: { name: 'Jane' } },
  { type: 'set', key: 'user3', value: { name: 'Bob' } }
]);

// Preload data
perfStorage.preload(['user1', 'user2', 'user3']);

// Fast access (from cache)
const user1 = perfStorage.get('user1'); // Fast - from cache
```
