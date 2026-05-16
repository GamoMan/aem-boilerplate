const appConfig = {
  retirement: {
    rootClass: 'fincalreact-root--retirement',
    script: '/MobileServices/Fincal/assets/retirement.js',
    css: '/MobileServices/Fincal/assets/retirement.css',
  },
  tax: {
    rootClass: 'fincalreact-root--tax',
    script: '/MobileServices/Fincal/assets/tax.js',
    css: '/MobileServices/Fincal/assets/tax.css',
  },
  saving: {
    rootClass: 'fincalreact-root--saving',
    script: '/MobileServices/Fincal/assets/saving.js',
    css: '/MobileServices/Fincal/assets/saving.css',
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
  // 1. วิธีดึงค่าด่วน: ตรวจสอบจาก classList ของ block 
  // (ปกติ AEM จะเอาชื่อตารางด้านล่างมาใส่เป็น class ให้ที่ตัว block container เสมอ เช่น class="retirement block")
  let type = 'tax'; // default
  
  if (block.classList.contains('retirement')) {
    type = 'retirement';
  } else if (block.classList.contains('tax')) {
    type = 'tax';
  } else if (block.classList.contains('saving')) {
    type = 'saving';
  } else {
    // 2. วิธีสำรอง: ดึงจาก library-metadata table ถ้ามี
    const metaRow = Array.from(block.querySelectorAll('div')).find(el => el.textContent.trim().toLowerCase() === 'name');
    if (metaRow && metaRow.nextElementSibling) {
      type = metaRow.nextElementSibling.textContent.trim().toLowerCase();
    }
  }

  const config = appConfig[type] || appConfig.retirement;

  block.classList.add('fincalreact');

  // Create shadow root for CSS isolation
  const shadow = block.attachShadow({ mode: 'open' });
  const root = document.createElement('div');
  root.className = 'fincalreact-root ' + config.rootClass;
  // แนะนำให้ใส่ id หรือสร้างจุดยึดที่ชัดเจนให้ React มารู้จัก
  root.id = 'fincalreact-app-root'; 
  shadow.appendChild(root);

  // Load Tokens and CSS into shadow root
  const tokensLink = document.createElement('link');
  tokensLink.rel = 'stylesheet';
  tokensLink.href = '/styles/tokens.css';
  shadow.appendChild(tokensLink);

  if (config.css) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = config.css;
    shadow.appendChild(link);
  }

  // Set global reference ให้ React App สามารถวิ่งเข้ามาเกาะที่ div นี้ใน Shadow DOM ได้
  window.fincalShadow = shadow;
  window.fincalRootElement = root;

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
