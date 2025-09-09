/*--------------------------------------------------------------------------------------------------------------------*/

import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

/*--------------------------------------------------------------------------------------------------------------------*/

import vuePlugin from '@vitejs/plugin-vue';
import eslintPlugin from 'vite-plugin-eslint';

/*--------------------------------------------------------------------------------------------------------------------*/

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    plugins: [vuePlugin(), eslintPlugin()],
    base: './',
    build: {
        chunkSizeWarningLimit: 1500,
        minify: true,
        rollupOptions: {
            output: {
                entryFileNames: 'assistant.js',
                chunkFileNames: 'chunks/[hash].js',
                assetFileNames: 'assets/[hash].[ext]',
            }
        }
    },
    esbuild: {
        legalComments: 'none'
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

/*--------------------------------------------------------------------------------------------------------------------*/
