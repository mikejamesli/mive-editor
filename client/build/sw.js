if ("function" === typeof importScripts) {
  importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/3.5.0/workbox-sw.js"
  );
  /* global workbox */
  if (workbox) {
    console.log("Workbox is loaded");

    /* injection point for manifest files.  */
    workbox.precaching.precacheAndRoute([
  {
    "url": "img/icons/logo-lg.png",
    "revision": "322d70756685963f061a29a1482abc94"
  },
  {
    "url": "img/icons/logo.png",
    "revision": "dde8292c851eb92d969af222721505e2"
  },
  {
    "url": "index.html",
    "revision": "0b7953ebd6c1e49345339175e958345a"
  },
  {
    "url": "precache-manifest.c8dbf4fe24e39734541ec934387b7599.js",
    "revision": "c8dbf4fe24e39734541ec934387b7599"
  },
  {
    "url": "service-worker.js",
    "revision": "f7818790e230a4e832724d9fa7b0c5a6"
  },
  {
    "url": "static/css/main.627c13a9.chunk.css",
    "revision": "3fa07bcc971272eef3efee5084f31c91"
  },
  {
    "url": "static/js/2.5d5384f6.chunk.js",
    "revision": "873c98447fa6bb8617bd235cd801c576"
  },
  {
    "url": "static/js/main.1e041dfc.chunk.js",
    "revision": "37d20bac24eb18d9c0dddab2e6cc6529"
  },
  {
    "url": "static/js/runtime~main.a8a9905a.js",
    "revision": "238c9148d722c1b6291779bd879837a1"
  },
  {
    "url": "touch-icon-ipad.png",
    "revision": "322d70756685963f061a29a1482abc94"
  },
  {
    "url": "touch-icon-iphone-retina.png",
    "revision": "322d70756685963f061a29a1482abc94"
  },
  {
    "url": "touch-icon-iphone.png",
    "revision": "322d70756685963f061a29a1482abc94"
  }
]);

    /* custom cache rules*/
    workbox.routing.registerNavigationRoute("/index.html", {
      blacklist: [/^\/_/, /\/[^\/]+\.[^\/]+$/]
    });

    workbox.routing.registerRoute(
      /\.(?:png|gif|jpg|jpeg)$/,
      workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          })
        ]
      })
    );

    workbox.routing.registerRoute(
      /^https:\/\/mivechat.herokuapp.com\/user/,
      workbox.strategies.cacheFirst({
        cacheName: "users",
        plugins: [
          new workbox.expiration.Plugin({
            maxEntries: 60,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 Days
          })
        ]
      })
    );
  } else {
    console.log("Workbox could not be loaded. No Offline support");
  }
}
