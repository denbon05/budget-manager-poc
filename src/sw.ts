/// <reference lib="webworker" />

import Dexie from 'dexie';
import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

import { INDEX_DB_VERSION } from './constants';
import type { Tables } from './types/indexed-db';

declare let self: ServiceWorkerGlobalScope;

// remove old cached items and cache new ones
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// ! for dev only
self.skipWaiting();
clientsClaim();

const db = new Dexie('expenses') as Tables.Expenses;

const v = db.version(INDEX_DB_VERSION).stores({
  expenses: '++id,name,budget,wasted,balance',
});
console.log('v', v);

const expense = {
  name: 'Test',
  budget: 3000,
  wasted: 0,
  balance: 3000,
};

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));
// registerRoute(new NavigationRoute({
//   handle: () => {

// }}));

// ------------

// Service Worker implementation
const CACHE_NAME = 'v1';
const urlsToCache: string[] = [
  // '/',
  // '/index.html',
  // '/styles.css',
  // '/main.js',
  // '/favicon.ico',
];
// console.log('hi from sw!!!!');

// Install the Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(urlsToCache);
    }),
  );
});

// Activate the Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// self.addEventListener('fetch', (event) => {
//   console.log('EVENT', event);

//   if (event.request.url.endsWith('/expenses')) {
//     event.respondWith(async () => {
//       const expenses = db.expenses.toArray();
//       return new Response(JSON.stringify(expenses), {
//         headers: { 'Content-Type': 'application/json' },
//       });
//     });
//   }
// });

// self.addEventListener('fetch', (event) => {
//   console.log('Fetching:', event.request.url);
//   if (event.request.url.endsWith('/expenses')) {
//     db.expenses
//       .add(expense)
//       .then(() => {
//         event.respondWith(new Response('Added expense to the db'));
//       })
//       .catch((err) => {
//         console.error('Failed add the expense to the DB', err);
//       });
//   }
// });

// Fetch event to serve cached assets
// self.addEventListener('fetch', (event) => {
//   console.log('Fetching:', event.request.url);
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return the cached response if found, else fetch from network
//       return response || fetch(event.request);
//     }),
//   );
// });

// // TypeError: Failed to execute 'showNotification' on 'ServiceWorkerRegistration':
// // No notification permission has been granted for this origin.
// self.addEventListener('push', (event) => {
//   const title = 'This is the title!';
//   const body = 'This is a push message!';
//   const tag = 'simple-tag';

//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body,
//       tag,
//     }),
//   );
// });
