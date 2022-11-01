import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig((params)=>{
    return {
        base: './',
        plugins: [
            vue(),
            VitePWA({
                srcDir: 'src',
                filename: 'service-worker.js',
                manifest: {
                    name: 'news',
                    themeColor: '#15161A',
                    short_name: 'news',
                    description: '随身行手机新闻界面',
                    // icons: [
                    //     {
                    //         src: 'icons/androud-chrome-192x192.png',
                    //         sizes: '192x192',
                    //         type: 'image/png',
                    //     },
                    //     {
                    //         src: 'icons/androud-chrome-512x512.png',
                    //         sizes: '512x512',
                    //         type: 'image/png',
                    //     },
                    //     {
                    //         src: 'icons/androud-chrome-512x512.png',
                    //         sizes: '512x512',
                    //         type: 'image/png',
                    //         purpose: 'any maskable',
                    //     }
                    // ]
                },
                strategies: 'injectManifest',
                devOptions: {
                    enabled: true,
                    type: 'module',
                    navigateFallback: 'index.html',
                },
                workbox: {
                    skipWaiting: true,
                    clientsClaim: true
                }
            })
        ],
        server: {
            open:true,//启动项目后自动开启浏览器
            host:'0.0.0.0',//对应的主机名
            port:6060,//端口号
            https:false,//是否开启协议名,如果开启会发出警告
            proxy: {
                //配置跨域
                '/static': { //配置跨域的名字
                    // target: 'http://172.16.8.203/api',//跨域的地址
                    target: 'https://bridge.wenhua.com.cn/static',//跨域的地址
                    changeOrigin: true, //是否跨域
                    rewrite: (path) => path.replace('^/static', '')
                },
                // /ccmp/api 222服务器使用
                '/ccmp/api':{
                    target:'http://172.16.8.207:8048/api/',
                    changeOrigin: true, //是否跨域
                    rewrite: (path) => path.replace('^/ccmp/api', '')
                },
                // /api 222服务器使用
                '/api':{
                    target:'http://10.10.10.47:803/api/',
                    changeOrigin: true, //是否跨域
                    rewrite: (path) => path.replace('^/api', '')
                }
            }
        },
        build: {
            target: 'esnext',
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: process.argv[4] == 'staging'
                }
            },
            sourcemap: true
        },
        esbuild: {
            jsxFactory: 'h',
            jsxFragment: 'Fragment'
        }
    }
})