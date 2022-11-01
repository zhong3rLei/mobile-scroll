import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim,setCacheNameDetails } from 'workbox-core'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import {
    NetworkFirst,
    NetworkOnly,
    Strategy,
    StrategyHandler,
    StaleWhileRevalidate
  } from 'workbox-strategies'
import { CacheExpiration, ExpirationPlugin, ExpirationPluginOptions } from 'workbox-expiration'
cleanupOutdatedCaches()

var name = location.pathname + '-';
var suffix = '0.83';
var pathname = location.pathname.split('service-worker.js')[0];

// 设置相应缓存的名字的前缀和后缀
setCacheNameDetails({
    prefix: name,
    suffix: 'v' + suffix,
});

// 让我们的service worker尽快的得到更新和获取页面的控制权
self.skipWaiting()
clientsClaim()


precacheAndRoute(self.__WB_MANIFEST)

registerRoute(
    new NavigationRoute(new RegExp('.*'+ pathname +'.*/service-worker\.js')),
    new StaleWhileRevalidate({
        cacheName: name + 'sw',
        plugins: [
            new ExpirationPlugin({
                // 超过30天自动删除.
                maxAgeSeconds: 30 * 24 * 60 * 60,
                // 超出配额自动删除
                purgeOnQuotaError: true
            })
        ]
    })
);

registerRoute(
    new NavigationRoute(new RegExp('https://db.wenhua.com.cn/.*.(?:png|gif|jpg|jpeg|svg)')),
    new NetworkFirst({
        cacheName: name + 'pop',
        plugins: [
            new ExpirationPlugin({
                // 超过30天自动删除.
                maxAgeSeconds: 30 * 24 * 60 * 60,
                // 超出配额自动删除
                purgeOnQuotaError: true
            })
        ]
    })
);

// 对我们请求的数据进行缓存，这里采用 networkFirst 策略
registerRoute(
    new NavigationRoute(new RegExp('.*'+ pathname +'.*.(?:js|css|png|gif|jpg|jpeg|svg)')),
    new StaleWhileRevalidate({
        cacheName: name + 'static' + suffix,
        plugins: [
            new ExpirationPlugin({
                // 超过30天自动删除.
                maxAgeSeconds: 30 * 24 * 60 * 60,
                // 超出配额自动删除
                purgeOnQuotaError: true
            })
        ]
    })
);