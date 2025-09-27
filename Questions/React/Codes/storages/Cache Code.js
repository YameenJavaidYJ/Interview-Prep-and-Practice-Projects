// Cache - Complete Code Examples

//--------------------------------------------------------------------------------

//1. Service Worker Cache API - Basic Operations

// Open cache and add resources
caches.open("v1").then((cache) => {
    return cache.addAll(["/styles/main.css", "/scripts/app.js", "/images/logo.png", "/api/users"]);
});

// Add single resource
caches.open("v1").then((cache) => {
    return cache.add("/data.json");
});

// Add with custom request
caches.open("v1").then((cache) => {
    return cache.add(
        new Request("/api/data", {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer token123"
            })
        })
    );
});

///--------------------------------------------------------------------------------

//2. Advanced Cache Management

async function setupCache() {
    const cacheName = "my-app-v1";
    const cache = await caches.open(cacheName);

    // Add single resource
    await cache.add("/data.json");

    // Add with custom request
    await cache.add(
        new Request("/api/data", {
            method: "GET",
            headers: new Headers({
                Authorization: "Bearer token123"
            })
        })
    );

    // Add multiple resources
    await cache.addAll(["/images/banner.jpg", "/scripts/utils.js"]);

    console.log("Cache setup complete");
}

// Initialize cache
setupCache().catch((error) => {
    console.error("Cache setup failed:", error);
});

//--------------------------------------------------------------------------------

//3. Cache Retrieval and Matching

async function getFromCache(request) {
    const cache = await caches.open("v1");
    const response = await cache.match(request);

    if (response) {
        console.log("Found in cache:", response);
        return response;
    }

    console.log("Not in cache, fetching...");
    const networkResponse = await fetch(request);

    // Store in cache for future use
    cache.put(request, networkResponse.clone());
    return networkResponse;
}

// Match with different strategies
async function matchWithOptions() {
    const cache = await caches.open("v1");

    // Exact match
    const exactMatch = await cache.match("/api/data");

    // Match with ignoreSearch
    const ignoreSearchMatch = await cache.match("/api/data", {
        ignoreSearch: true
    });

    // Match with ignoreMethod
    const ignoreMethodMatch = await cache.match("/api/data", {
        ignoreMethod: true
    });

    // Match with ignoreVary
    const ignoreVaryMatch = await cache.match("/api/data", {
        ignoreVary: true
    });

    return {exactMatch, ignoreSearchMatch, ignoreMethodMatch, ignoreVaryMatch};
}

//--------------------------------------------------------------------------------

//4. Cache Strategies Implementation

// Cache First Strategy
async function cacheFirst(request) {
    const cache = await caches.open("v1");
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.error("Network error:", error);
        throw error;
    }
}

// Network First Strategy
async function networkFirst(request) {
    const cache = await caches.open("v1");

    try {
        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.log("Network failed, trying cache...");
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        throw error;
    }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
    const cache = await caches.open("v1");
    const cachedResponse = await cache.match(request);

    // Fetch from network in background
    const fetchPromise = fetch(request).then((networkResponse) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });

    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }

    // Otherwise wait for network
    return fetchPromise;
}

// Cache Only Strategy
async function cacheOnly(request) {
    const cache = await caches.open("v1");
    const cachedResponse = await cache.match(request);

    if (!cachedResponse) {
        throw new Error("Resource not in cache");
    }

    return cachedResponse;
}

// Network Only Strategy
async function networkOnly(request) {
    return fetch(request);
}

//--------------------------------------------------------------------------------

//5. Cache Invalidation and Updates

async function updateCache() {
    const cacheName = "my-app-v2";
    const oldCacheName = "my-app-v1";

    // Delete old cache
    await caches.delete(oldCacheName);

    // Create new cache
    const cache = await caches.open(cacheName);
    await cache.addAll(["/styles/main-v2.css", "/scripts/app-v2.js"]);

    console.log("Cache updated to v2");
}

// Incremental cache updates
async function incrementalCacheUpdate() {
    const cache = await caches.open("v1");
    const requests = await cache.keys();

    for (const request of requests) {
        try {
            const networkResponse = await fetch(request);

            // Check if response changed
            const cachedResponse = await cache.match(request);
            const networkETag = networkResponse.headers.get("ETag");
            const cachedETag = cachedResponse.headers.get("ETag");

            if (networkETag !== cachedETag) {
                await cache.put(request, networkResponse.clone());
                console.log(`Updated: ${request.url}`);
            }
        } catch (error) {
            console.error(`Failed to update ${request.url}:`, error);
        }
    }
}

// Cache versioning
class CacheVersionManager {
    constructor(prefix = "app-cache") {
        this.prefix = prefix;
        this.currentVersion = "1";
    }

    getCacheName() {
        return `${this.prefix}-v${this.currentVersion}`;
    }

    async upgradeCache(newVersion) {
        const oldCacheName = this.getCacheName();
        this.currentVersion = newVersion;
        const newCacheName = this.getCacheName();

        const oldCache = await caches.open(oldCacheName);
        const newCache = await caches.open(newCacheName);

        // Copy important resources
        const importantRequests = await oldCache.keys();
        for (const request of importantRequests) {
            const response = await oldCache.match(request);
            if (response) {
                await newCache.put(request, response.clone());
            }
        }

        // Delete old cache
        await caches.delete(oldCacheName);

        console.log(`Cache upgraded from ${oldCacheName} to ${newCacheName}`);
    }
}

// --------------------------------------------------------------------------------

//6. Cache Size Management

async function manageCacheSize() {
    const cacheNames = await caches.keys();
    const maxCacheSize = 50 * 1024 * 1024; // 50MB

    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        let totalSize = 0;
        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        }

        if (totalSize > maxCacheSize) {
            console.log(`Cache ${cacheName} exceeds size limit: ${totalSize} bytes`);
            await cleanupOldCacheEntries(cache, maxCacheSize);
        }
    }
}

async function cleanupOldCacheEntries(cache, maxSize) {
    const requests = await cache.keys();
    const entries = [];

    // Get all entries with metadata
    for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
            const blob = await response.blob();
            entries.push({
                request,
                response,
                size: blob.size,
                lastModified: response.headers.get("last-modified") || new Date().toISOString()
            });
        }
    }

    // Sort by last modified (oldest first)
    entries.sort((a, b) => new Date(a.lastModified) - new Date(b.lastModified));

    let currentSize = entries.reduce((total, entry) => total + entry.size, 0);

    // Remove oldest entries until under limit
    while (currentSize > maxSize && entries.length > 0) {
        const entry = entries.shift();
        await cache.delete(entry.request);
        currentSize -= entry.size;
        console.log(`Removed: ${entry.request.url}`);
    }
}

// Cache quota monitoring
async function monitorCacheQuota() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const used = estimate.usage;
        const quota = estimate.quota;
        const percentage = (used / quota) * 100;

        console.log(`Storage used: ${(used / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Storage quota: ${(quota / 1024 / 1024).toFixed(2)} MB`);
        console.log(`Usage percentage: ${percentage.toFixed(2)}%`);

        if (percentage > 80) {
            console.warn("Storage quota almost full, consider cleanup");
        }
    }
}

//--------------------------------------------------------------------------------

//7. HTTP Cache Headers (Server-side Examples)

// Express.js cache headers
const express = require("express");
const app = express();

// Set cache headers for static resources
app.get("/api/data", (req, res) => {
    // Cache for 1 hour
    res.set({
        "Cache-Control": "public, max-age=3600",
        ETag: '"abc123"',
        "Last-Modified": new Date().toUTCString()
    });

    res.json({data: "cached response"});
});

// Conditional requests with ETag
app.get("/api/users/:id", (req, res) => {
    const userId = req.params.id;
    const user = getUserById(userId);
    const etag = generateETag(user);

    // Check if client has current version
    if (req.headers["if-none-match"] === etag) {
        return res.status(304).end(); // Not Modified
    }

    res.set({
        ETag: etag,
        "Cache-Control": "private, max-age=1800"
    });

    res.json(user);
});

// Cache-Control headers explained
function setCacheHeaders(res, options = {}) {
    const {
        maxAge = 3600,
        public = false,
        private = false,
        noCache = false,
        noStore = false,
        mustRevalidate = false,
        proxyRevalidate = false,
        immutable = false
    } = options;

    let cacheControl = "";

    if (noStore) {
        cacheControl = "no-store";
    } else if (noCache) {
        cacheControl = "no-cache";
    } else {
        const directives = [];

        if (public) directives.push("public");
        if (private) directives.push("private");
        if (maxAge !== undefined) directives.push(`max-age=${maxAge}`);
        if (mustRevalidate) directives.push("must-revalidate");
        if (proxyRevalidate) directives.push("proxy-revalidate");
        if (immutable) directives.push("immutable");

        cacheControl = directives.join(", ");
    }

    res.set("Cache-Control", cacheControl);
}

// Usage examples
app.get("/static/:file", (req, res) => {
    // Cache static files for 1 year
    setCacheHeaders(res, {
        maxAge: 31536000, // 1 year
        public: true,
        immutable: true
    });

    res.sendFile(path.join(__dirname, "static", req.params.file));
});

app.get("/api/dynamic", (req, res) => {
    // Cache dynamic content for 5 minutes
    setCacheHeaders(res, {
        maxAge: 300, // 5 minutes
        private: true,
        mustRevalidate: true
    });

    res.json({data: "dynamic content"});
});

//--------------------------------------------------------------------------------

//8. Service Worker Cache Implementation

// Complete service worker with cache strategies
const CACHE_NAME = "my-app-v1";
const STATIC_CACHE = "static-v1";
const DYNAMIC_CACHE = "dynamic-v1";

const STATIC_ASSETS = ["/", "/styles/main.css", "/scripts/app.js", "/images/logo.png", "/manifest.json"];

// Install event - cache static assets
self.addEventListener("install", (event) => {
    console.log("Service Worker installing...");

    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => {
                console.log("Caching static assets");
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log("Static assets cached");
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error("Cache installation failed:", error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    console.log("Service Worker activating...");

    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log("Deleting old cache:", cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log("Service Worker activated");
                return self.clients.claim();
            })
    );
});

// Fetch event - implement caching strategies
self.addEventListener("fetch", (event) => {
    const {request} = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== "GET") {
        return;
    }

    // Handle different types of requests
    if (isStaticAsset(request)) {
        event.respondWith(cacheFirst(request, STATIC_CACHE));
    } else if (isApiRequest(request)) {
        event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    } else {
        event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE));
    }
});

// Helper functions
function isStaticAsset(request) {
    const url = new URL(request.url);
    return url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/);
}

function isApiRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith("/api/");
}

async function cacheFirst(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
        return cachedResponse;
    }

    try {
        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone());
        return networkResponse;
    } catch (error) {
        console.error("Network request failed:", error);
        throw error;
    }
}

async function networkFirst(request, cacheName) {
    const cache = await caches.open(cacheName);

    try {
        const networkResponse = await fetch(request);

        // Only cache successful responses
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        console.log("Network failed, trying cache...");
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
            return cachedResponse;
        }

        // Return offline page for navigation requests
        if (request.mode === "navigate") {
            return cache.match("/offline.html");
        }

        throw error;
    }
}

async function staleWhileRevalidate(request, cacheName) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);

    // Fetch from network in background
    const fetchPromise = fetch(request).then((networkResponse) => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
    });

    // Return cached version immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }

    // Otherwise wait for network
    return fetchPromise;
}

//--------------------------------------------------------------------------------

//9. Cache Performance Monitoring

class CachePerformanceMonitor {
    constructor() {
        this.metrics = {
            hits: 0,
            misses: 0,
            errors: 0,
            totalRequests: 0
        };
    }

    async recordCacheAccess(request, fromCache) {
        this.metrics.totalRequests++;

        if (fromCache) {
            this.metrics.hits++;
        } else {
            this.metrics.misses++;
        }

        // Calculate hit rate
        const hitRate = this.metrics.hits / this.metrics.totalRequests;

        console.log(`Cache Hit Rate: ${(hitRate * 100).toFixed(2)}%`);

        // Log performance metrics
        if (this.metrics.totalRequests % 10 === 0) {
            this.logMetrics();
        }
    }

    logMetrics() {
        console.log("Cache Performance Metrics:", {
            totalRequests: this.metrics.totalRequests,
            hits: this.metrics.hits,
            misses: this.metrics.misses,
            errors: this.metrics.errors,
            hitRate: `${((this.metrics.hits / this.metrics.totalRequests) * 100).toFixed(2)}%`
        });
    }

    async measureCacheSize(cacheName) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();

        let totalSize = 0;
        const resourceSizes = [];

        for (const request of requests) {
            try {
                const response = await cache.match(request);
                if (response) {
                    const blob = await response.blob();
                    const size = blob.size;
                    totalSize += size;

                    resourceSizes.push({
                        url: request.url,
                        size: size,
                        sizeFormatted: this.formatBytes(size)
                    });
                }
            } catch (error) {
                console.error("Error measuring cache entry:", error);
            }
        }

        return {
            totalSize: totalSize,
            totalSizeFormatted: this.formatBytes(totalSize),
            resourceCount: requests.length,
            resources: resourceSizes.sort((a, b) => b.size - a.size)
        };
    }

    formatBytes(bytes) {
        if (bytes === 0) return "0 Bytes";

        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }
}

// Usage
const cacheMonitor = new CachePerformanceMonitor();

// Enhanced cache function with monitoring
async function monitoredCacheFirst(request, cacheName) {
    const startTime = performance.now();

    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);

        const endTime = performance.now();
        const duration = endTime - startTime;

        if (cachedResponse) {
            cacheMonitor.recordCacheAccess(request, true);
            console.log(`Cache hit for ${request.url} in ${duration.toFixed(2)}ms`);
            return cachedResponse;
        }

        const networkResponse = await fetch(request);
        cache.put(request, networkResponse.clone());

        cacheMonitor.recordCacheAccess(request, false);
        console.log(`Network fetch for ${request.url} in ${duration.toFixed(2)}ms`);

        return networkResponse;
    } catch (error) {
        cacheMonitor.metrics.errors++;
        console.error("Cache error:", error);
        throw error;
    }
}
//--------------------------------------------------------------------------------

//10. Advanced Cache Patterns

// Cache warming - preload important resources
async function warmCache() {
    const cache = await caches.open("preload-cache");
    const importantUrls = ["/api/user/profile", "/api/settings", "/api/notifications"];

    const warmPromises = importantUrls.map(async (url) => {
        try {
            const response = await fetch(url);
            if (response.ok) {
                await cache.put(url, response.clone());
                console.log(`Warmed cache for: ${url}`);
            }
        } catch (error) {
            console.error(`Failed to warm cache for ${url}:`, error);
        }
    });

    await Promise.allSettled(warmPromises);
}

// Cache partitioning by user
class UserCacheManager {
    constructor() {
        this.userCaches = new Map();
    }

    getCacheName(userId) {
        return `user-cache-${userId}`;
    }

    async getUserCache(userId) {
        if (!this.userCaches.has(userId)) {
            const cacheName = this.getCacheName(userId);
            const cache = await caches.open(cacheName);
            this.userCaches.set(userId, cache);
        }

        return this.userCaches.get(userId);
    }

    async setUserData(userId, key, data) {
        const cache = await this.getUserCache(userId);
        const request = new Request(`/user/${userId}/${key}`);
        const response = new Response(JSON.stringify(data));

        await cache.put(request, response);
    }

    async getUserData(userId, key) {
        const cache = await this.getUserCache(userId);
        const request = new Request(`/user/${userId}/${key}`);
        const response = await cache.match(request);

        if (response) {
            return response.json();
        }

        return null;
    }

    async clearUserCache(userId) {
        const cacheName = this.getCacheName(userId);
        await caches.delete(cacheName);
        this.userCaches.delete(userId);
    }
}

// Cache with TTL (Time To Live)
class TTLCache {
    constructor(defaultTTL = 3600000) {
        // 1 hour default
        this.defaultTTL = defaultTTL;
    }

    async set(key, value, ttl = this.defaultTTL) {
        const cache = await caches.open("ttl-cache");
        const expiresAt = Date.now() + ttl;

        const data = {
            value: value,
            expiresAt: expiresAt
        };

        const request = new Request(key);
        const response = new Response(JSON.stringify(data));

        await cache.put(request, response);
    }

    async get(key) {
        const cache = await caches.open("ttl-cache");
        const request = new Request(key);
        const response = await cache.match(request);

        if (!response) {
            return null;
        }

        const data = await response.json();

        if (Date.now() > data.expiresAt) {
            await cache.delete(request);
            return null;
        }

        return data.value;
    }

    async cleanup() {
        const cache = await caches.open("ttl-cache");
        const requests = await cache.keys();

        for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
                const data = await response.json();

                if (Date.now() > data.expiresAt) {
                    await cache.delete(request);
                }
            }
        }
    }
}

// Usage
const ttlCache = new TTLCache(1800000); // 30 minutes TTL
await ttlCache.set("user-data", {name: "John"}, 600000); // 10 minutes
const userData = await ttlCache.get("user-data");
