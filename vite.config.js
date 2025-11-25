import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import resolve from '@rollup/plugin-node-resolve';
import inject from '@rollup/plugin-inject'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: "./",
    define: {
      'global': 'globalThis',
      'process.env': {},
    },
    build:
      mode === 'production'
        ? {
          rollupOptions: {
            plugins: [
              inject({ 
                Buffer: ['buffer', 'Buffer'],
                process: 'process'
              })
            ],
          },
        }
        : undefined,

    optimizeDeps: {
      include: ['@emotion/styled', 'buffer', 'process'],
      esbuildOptions: {
        // Node.js global to browser globalThis
        define: {
          global: 'globalThis'
        },
        // Enable esbuild polyfill plugins
        plugins: [
          NodeGlobalsPolyfillPlugin({
            buffer: true,
            process: true
          })
        ]
      }
    },
    resolve: {
      alias: {
        crypto: 'crypto-browserify',
        stream: 'stream-browserify',
        http: 'stream-http',
        https: 'https-browserify',
        buffer: 'buffer'
      }
    },
    plugins:
      [
        react(),
        resolve({
          browser: true,
          preferBuiltins: false,
        })
      ],
  }
})
