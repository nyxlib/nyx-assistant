import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: './',
    build: {
        chunkSizeWarningLimit: 1250,
        minify: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assistant.js',
                chunkFileNames: 'chunks/[hash].js',
                assetFileNames: 'assets/[hash].[ext]',
            }
        }
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    server: {
        fs: {
            allow: ['../..']
        }
    }
});
