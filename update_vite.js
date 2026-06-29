const fs = require('fs');
let c = fs.readFileSync('vite.config.ts', 'utf8');

const idx = c.indexOf('workbox:');
if (idx === -1) { console.log('workbox not found'); process.exit(1); }

const newWorkbox = '      workbox: {\n' +
'        runtimeCaching: [\n' +
'          {\n' +
'            urlPattern: /^\/api\/push$/i,\n' +
'            handler: "NetworkOnly",\n' +
'            options: {\n' +
'              cacheName: "sync-api",\n' +
'              backgroundSync: {\n' +
'                name: "sync-queue",\n' +
'                options: { maxRetentionTime: 24 * 60 },\n' +
'              },\n' +
'            },\n' +
'          },\n' +
'          {\n' +
'            urlPattern: /^\/api\/.*/i,\n' +
'            handler: "StaleWhileRevalidate",\n' +
'            options: {\n' +
'              cacheName: "api-cache",\n' +
'              expiration: {\n' +
'                maxEntries: 200,\n' +
'                maxAgeSeconds: 60 * 60 * 24 * 7,\n' +
'              },\n' +
'              cacheableResponse: {\n' +
'                statuses: [0, 200],\n' +
'              },\n' +
'            },\n' +
'          },\n' +
'          {\n' +
'            urlPattern: /^https:\/\/fonts\..*/i,\n' +
'            handler: "CacheFirst",\n' +
'            options: {\n' +
'              cacheName: "google-fonts-cache",\n' +
'              expiration: {\n' +
'                maxEntries: 10,\n' +
'                maxAgeSeconds: 60 * 60 * 24 * 30,\n' +
'              },\n' +
'            },\n' +
'          },\n' +
'          {\n' +
'            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,\n' +
'            handler: "CacheFirst",\n' +
'            options: {\n' +
'              cacheName: "image-cache",\n' +
'              expiration: {\n' +
'                maxEntries: 100,\n' +
'                maxAgeSeconds: 60 * 60 * 24 * 30,\n' +
'              },\n' +
'            },\n' +
'          },\n' +
'        ],\n' +
'      },';

// Find the start of the workbox block
const startBrace = c.indexOf('{', idx);
// Count braces to find the matching closing brace
let depth = 1;
let endIdx = startBrace + 1;
while (depth > 0 && endIdx < c.length) {
  if (c[endIdx] === '{') depth++;
  else if (c[endIdx] === '}') depth--;
  endIdx++;
}
// Move past the close brace

// Find the closing of the VitePWA call (next ) after the workbox)
const closeParen = c.indexOf(')', endIdx);
if (closeParen === -1) process.exit(1);

const fullOld = c.substring(idx, closeParen + 1);
if (!fullOld) process.exit(1);

c = c.replace(fullOld, newWorkbox);
fs.writeFileSync('vite.config.ts', c, 'utf8');
console.log('OK');
