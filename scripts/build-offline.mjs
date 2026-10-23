// Gera um cache versionado a partir dos arquivos efetivamente exportados pelo Expo.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
const root = path.resolve('dist');
async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => entry.isDirectory() ? walk(path.join(directory, entry.name)) : [path.join(directory, entry.name)]));
  return nested.flat();
}
const files = (await walk(root)).filter(file => !['sw.js', 'metadata.json'].includes(path.basename(file))).sort();
const hash = createHash('sha256');
for (const file of files) hash.update(await readFile(file));
const cache = `eletricalc-shell-${hash.digest('hex').slice(0, 16)}`;
const urls = files.map(file => './' + path.relative(root, file).split(path.sep).join('/'));
const worker = `const CACHE = ${JSON.stringify(cache)};
const ASSETS = ${JSON.stringify(urls)};
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('eletricalc-shell-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.open(CACHE).then(cache => cache.match(new URL('./index.html', self.registration.scope).href))));
    return;
  }
  event.respondWith(caches.open(CACHE).then(async cache => (await cache.match(request)) || fetch(request)));
});
`;
await writeFile(path.join(root, 'sw.js'), worker);
console.log(`Offline web: ${urls.length} arquivos no cache ${cache}.`);
