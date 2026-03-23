const appConfig = {
  retirement: {
    rootClass: 'fincalreact-root--retirement',
    script: '/apps/assets/retirement.js',
    css: '/apps/assets/retirement.css',
  },
  tax: {
    rootClass: 'fincalreact-root--tax',
    script: '/apps/assets/tax.js',
    css: '/apps/assets/tax.css',
  },
  saving: {
    rootClass: 'fincalreact-root--saving',
    script: '/apps/assets/saving.js',
    css: '/apps/assets/saving.css',
  },
};

const loadCSS = (href) => new Promise((resolve, reject) => {
  if (!document.querySelector(`link[href="${href}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = resolve;
    link.onerror = reject;
    document.head.appendChild(link);
  } else {
    resolve();
  }
});

const loadScript = (src) => new Promise((resolve, reject) => {
  if (!document.querySelector(`script[src="${src}"]`)) {
    const script = document.createElement('script');
    script.src = src;
    script.type = 'module';
    script.crossOrigin = 'anonymous';
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  } else {
    resolve();
  }
});

async function loadAppAssets({ script, css }) {
  if (css) await loadCSS(css);
  if (script) await loadScript(script);
}

export default async function decorate(block) {
  const type = (block.dataset.project || block.textContent.trim() || 'retirement').trim().toLowerCase();
  const config = appConfig[type] || appConfig.retirement;

  block.classList.add('fincalreact');

  // Create shadow root for CSS isolation
  const shadow = block.attachShadow({ mode: 'open' });
  const root = document.createElement('div');
  root.className = 'fincalreact-root ' + config.rootClass;
  shadow.appendChild(root);

  // Load CSS into shadow root
  if (config.css) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.css;
    shadow.appendChild(link);
  }

  // Set global reference for React mounting
  window.fincalShadow = shadow;

  try {
    // Load JS globally
    if (config.script) {
      await loadScript(config.script);
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('FincalReact block: failed to load app assets', error);
  }
}
