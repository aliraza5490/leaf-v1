import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

function cssInjectedByJs(): Plugin {
  return {
    name: 'css-injected-by-js',
    enforce: 'post',
    generateBundle(_, bundle) {
      const cssAssetNames = Object.keys(bundle).filter((k) => k.endsWith('.css'));
      if (cssAssetNames.length === 0) return;

      const cssContent = cssAssetNames
        .map((name) => {
          const source = (bundle[name] as any).source;
          return typeof source === 'string' ? source : '';
        })
        .join('\n');

      cssAssetNames.forEach((name) => delete bundle[name]);

      const jsAssetName = Object.keys(bundle).find((k) => k.endsWith('.js'));
      if (!jsAssetName) return;

      const jsAsset = bundle[jsAssetName] as any;
      if (jsAsset.type !== 'chunk') return;

      const injectionCode = `(function(){try{var s=document.createElement('style');s.setAttribute('data-leaf-widget','');s.textContent=${JSON.stringify(cssContent)};document.head.appendChild(s)}catch(e){console.error('Leaf widget CSS injection failed',e)}})();`;

      jsAsset.code = injectionCode + '\n' + jsAsset.code;
    },
  };
}

export default defineConfig({
  plugins: [react(), cssInjectedByJs()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    target: 'es2022',
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'Leaf',
      fileName: () => 'leaf-widget.js',
      formats: ['iife'],
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    cssCodeSplit: false,
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  esbuild: {
    target: 'es2022',
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022',
    },
  },
  server: {
    port: 5174,
    cors: true,
  },
});
