/// <reference lib="webworker" />
declare let self: ServiceWorkerGlobalScope;

import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

import mapToURIController from './service-worker/fetch-router';
import { SW_CACHE_NAME } from './constants';

// remove old cached items and cache new ones
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

if (import.meta.env.DEV) {
  // for dev mode only
  self.skipWaiting();
  clientsClaim();
}

// Intercept fetch events - remember to keep controller sync
self.addEventListener('fetch', mapToURIController);

// registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// ------------

// Service Worker implementation
// const urlsToCache: string[] = [
//   // '/',
//   // '/index.html',
//   // '/styles.css',
//   // '/main.js',
//   // '/favicon.ico',
// ];
// // console.log('hi from sw!!!!');

// // Install the Service Worker
// self.addEventListener('install', (event) => {
//   console.log('Service Worker installing.');
//   event.waitUntil(
//     caches.open(SW_CACHE_NAME).then((cache) => {
//       console.log('Opened cache');
//       return cache.addAll(urlsToCache);
//     }),
//   );
// });

// Activate the Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== SW_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

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
