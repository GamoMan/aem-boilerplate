# React Application Integration

This skill provides guidance on integrating React applications into AEM Edge Delivery Services environment as standalone built assets. The integration uses a **generic, metadata-driven** approach: authors specify the `.js` and `.css` asset paths directly in the block's content table, so a single block can load any React app without code changes.

## Directory Structure

- **React App Source Code**: Stored under `Apps/<react-app-folder>` (e.g., `Apps/<react-app-folder>/code`).
- **Build Output Target**: Outputted directly to `/MobileServices/<react-app-folder>` (e.g., `/MobileServices/<react-app-folder>`).

## Build Configuration

React apps are typically configured using Vite. The `vite.config.ts` (or `vite.config.js`) should set the `build.outDir` to output directly to the AEM-served directory:

```typescript
const outDir = "../../../MobileServices/<react-app-folder>/"; // Adjust path based on your react app folder
```

The build scripts in `package.json` should copy necessary environment-specific configurations (e.g., `env.json`) and run the build command.

## Local Development and Serving

1. **React Dev Server**: To develop locally with hot module replacement (HMR), run the dev server inside the React app source directory:
   ```bash
   cd Apps/<react-app-folder>/code
   npm install
   npm run dev
   ```
2. **AEM CLI Serving**: To preview the integrated React app served via AEM's local server:
   - Build the React app:
     ```bash
     npm run build:dev
     ```
     This compiles the assets into `/MobileServices/<react-app-folder>`.
   - Start the AEM CLI at the project root:
     ```bash
     npx -y @adobe/aem-cli up --no-open --forward-browser-logs
     ```
   - Access the React app at `http://localhost:3000/MobileServices/<react-app-folder>/`.

## Deployment and Environments

The built assets inside `/MobileServices/<react-app-folder>` must be committed to the repository so they are synced and served by AEM Edge Delivery Services across all environments.

## AEM Block Integration (Generic Metadata-Driven)

The `fincalreact` block is a **generic React app loader**. Authors specify which React app to load by providing the asset paths (`script`, `css`) in the block's content table. No code changes to the block are needed to load different React apps.

### Authoring Table Structure:

| Key    | Value                                          |
|--------|-------------------------------------------------|
| script | /MobileServices/MyApp/assets/app.js             |
| css    | /MobileServices/MyApp/assets/app.css            |
| class  | my-app-root (optional custom CSS class)         |
| id     | my-app-root (optional custom root element ID)   |

The block uses `readBlockConfig(block)` from `aem.js` to extract these key-value pairs from the authored content.

### Key Principles:

1. **Shadow DOM for CSS Isolation**: Uses `block.attachShadow({ mode: 'open' })` to prevent React app styles from leaking into the AEM page, and vice versa.
2. **Mounting Anchor**: Sets `window.reactAppShadow` and `window.reactAppRootElement` as generic global references for the React app to mount into (also retains `window.fincalShadow` for backward compatibility).
3. **Asset Loading**: Dynamically injects the CSS `<link>` and JS `<script>` assets specified in the block metadata into the shadow root and document head respectively.

### Block JS (`/blocks/reactapp/reactapp.js`):

```javascript
import { readBlockConfig } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Read authored key-value pairs from the block table
  const blockConfig = readBlockConfig(block);
  const scriptPath = blockConfig.script || blockConfig.js;
  const cssPath = blockConfig.css;
  const customClass = blockConfig.class || '';
  const customId = blockConfig.id || 'reactapp-app-root';

  // Create shadow root for CSS isolation
  const shadow = block.attachShadow({ mode: 'open' });
  const root = document.createElement('div');
  root.className = `rectapp-root ${customClass}`.trim();
  root.id = customId;
  shadow.appendChild(root);

  // Load AEM global tokens & React app specific CSS into shadow root
  const tokensLink = document.createElement('link');
  tokensLink.rel = 'stylesheet';
  tokensLink.href = '/styles/tokens.css';
  shadow.appendChild(tokensLink);

  if (cssPath) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = cssPath;
    shadow.appendChild(link);
  }

  // ---------------------------------------------------------------------------
  // Support for **multiple** React apps on the same page
  // ---------------------------------------------------------------------------
  // Generate a unique identifier for this block instance. This allows each block
  // to keep its own shadow root and root element without overwriting globals.
  const appId = `reactApp-${Math.random().toString(36).substr(2, 9)}`;
  // Store the shadow root in a map on the window so the React entry point can
  // locate the correct container. This also preserves backward compatibility by
  // keeping the legacy global references for existing single‑app setups.
  window.reactAppInstances = window.reactAppInstances || {};
  window.reactAppInstances[appId] = shadow;
  // Attach the identifier to the root element for easy lookup in the React code.
  root.dataset.reactAppId = appId;

  // Legacy globals (kept for compatibility with existing docs & code)
  window.reactAppShadow = shadow;
  window.reactAppRootElement = root;
  window.fincalShadow = shadow; // backward compatibility

  // Load React JS bundle – remains unchanged
  if (scriptPath) {
    const script = document.createElement('script');
    script.src = scriptPath;
    script.type = 'module';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }
}
```

### React Entry Point Example (`Apps/<react-app-folder>/code/src/index.tsx`):

```typescript
import { createRoot } from 'react-dom/client';

const mountApp = (selector: string, Component: React.FC) => {
  // Find all containers matching the selector
  document.querySelectorAll(selector).forEach((container) => {
    if (!container) return;
    // Determine the shadow root for this container
    const appId = (container as HTMLElement).dataset.reactAppId;
    const shadowRoot = appId && (window as any).reactAppInstances?.[appId];
    const root = shadowRoot || document;
    if (container && !container.dataset.appMounted) {
      createRoot(container as Element).render(<Component />);
      container.dataset.appMounted = 'true';
    }
  });
};

mountApp('.reactapp-root', App);
```