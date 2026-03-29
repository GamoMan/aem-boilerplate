import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProductionOrUat = mode === "production" || mode === "uat";
  const base = isProductionOrUat ? "/apps/" : "./";
  // Support building a single project (retirement/tax/saving) by setting the
  // PROJECT env var. When PROJECT is provided we build only that entry and
  // emit a self-contained bundle (no shared runtime/vendor files) into a
  // project-specific outDir so deployments can copy only that project's
  // JS/CSS without touching other projects.
  const projectEnv = (process.env.PROJECT || "").toLowerCase();
  const allInputs: Record<'main' | 'tax' | 'saving', string> = {
    main: path.resolve(__dirname, "index.html"),
    tax: path.resolve(__dirname, "tax.html"),
    saving: path.resolve(__dirname, "saving.html"),
  };

  // Map friendly project names to the input keys above.
  const projectMap: Record<string, keyof typeof allInputs> = {
    retirement: 'main',
    tax: 'tax',
    saving: 'saving',
  };

  const isSingleProject = !!projectEnv && !!projectMap[projectEnv];
  const projectKey = projectMap[projectEnv] as keyof typeof allInputs;
  const selectedInput: Record<string, string> = isSingleProject
    ? { [projectKey]: allInputs[projectKey] }
    : allInputs;

  // Always write to the same dist folder (no per-project subfolders). We keep
  // single-entry builds as self-contained bundles so deployments can pick
  // files for a specific project (assets are named by entry key).
  const outDir = "../../../MobileServices/FincalReact/";

  // When building a single entry, disable code-splitting of dynamic imports so
  // the build emits one self-contained JS bundle for that page (no shared
  // vendor/runtime chunks). For multi-entry builds, keep default behaviour.
  const singleOutputOverrides: {
    inlineDynamicImports?: boolean;
    chunkFileNames: string | ((chunkInfo: any) => string);
    assetFileNames: string | ((assetInfo: any) => string);
    entryFileNames: string | ((entryInfo: any) => string);
  } = isSingleProject
    ? {
        // Prevent code-splitting for dynamic imports in single-entry builds
        inlineDynamicImports: true,
        // Prefix filenames with entry name so different projects don't overwrite
        // each other's assets when writing to the same dist folder.
        chunkFileNames: (chunk: unknown) => {
          // Single bundle name for chunks
          return `assets/${projectEnv}.js`;
        },
        assetFileNames: (asset: unknown) => {
          const a = asset as { name?: string; fileName?: string };
          const fname = (a.fileName || a.name || '').toString();
          const lower = fname.toLowerCase();
          if (lower.endsWith('.css')) {
            return `assets/${projectEnv}.css`;
          }
          if (lower.endsWith('.map')) {
            // map for the JS bundle
            return `assets/${projectEnv}.js.map`;
          }
          // For other assets (images/fonts), keep original filename to avoid collisions
          return `assets/${fname}`;
        },
        entryFileNames: (entry: unknown) => {
          // Single entry bundle name (e.g. retirement.js)
          return `assets/${projectEnv}.js`;
        },
      }
    : {
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
        entryFileNames: `assets/[name].js`,
      };

  return {
    server: {
      host: "::",
      port: 5173,
    },
    base: base, // Dynamically set base path
    build: {
  outDir,
  // When building a single project sequentially into the same outDir,
  // avoid emptying the directory so previous project assets are not deleted.
  emptyOutDir: !isSingleProject,
      sourcemap: mode === "development",
      chunkSizeWarningLimit: 1000,
      cssCodeSplit: true,
      rollupOptions: {
        treeshake: true,
        input: selectedInput,
        output: singleOutputOverrides,
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
