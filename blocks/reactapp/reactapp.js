import { readBlockConfig } from '../../scripts/aem.js';

// const appConfig = {
//   retirement: {
//     rootClass: 'reactapp-root--retirement',
//     script: '/MobileServices/reactapp/assets/retirement.js',
//     css: '/MobileServices/reactapp/assets/retirement.css',
//   },
//   tax: {
//     rootClass: 'reactapp-root--tax',
//     script: '/MobileServices/reactapp/assets/tax.js',
//     css: '/MobileServices/reactapp/assets/tax.css',
//   },
//   saving: {
//     rootClass: 'reactapp-root--saving',
//     script: '/MobileServices/reactapp/assets/saving.js',
//     css: '/MobileServices/reactapp/assets/saving.css',
//   },
// };

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

export default async function decorate(block) {
  // Read config from the block (authored key-values or Universal Editor fields)
  const blockConfig = readBlockConfig(block);

  // Extract metadata values
  const scriptPath = blockConfig.script || blockConfig.js;
  const cssPath = blockConfig.css;
  const customClass = blockConfig.class || blockConfig['root-class'] || '';
  // const customId = blockConfig.id || blockConfig['root-id'] || 'reactapp-app-root';

  let config = {};
  // let rootClass = customClass;

  // If script and css are provided in block metadata, use them
  if (scriptPath || cssPath) {
    config = {
      script: scriptPath,
      css: cssPath,
      rootClass: customClass,
    };
  } else {
    // Fallback to legacy behavior if not specified in metadata
    const getBlockMetadata = (name) => {
      // ดึง div แถวหลักทั้งหมดออกมา (มี 3 แถว)
      const rows = Array.from(block.querySelectorAll(':scope > div'));

      // ค้นหาแถวที่มีชื่อ (Key) ตรงกับที่ส่งเข้ามาใน parameter
      const foundRow = rows.find((row) => {
        const firstChild = row.children[0]; // div ตัวแรกที่เป็น Key เช่น <p>app-path</p>
        if (!firstChild) return false;

        return firstChild.textContent.trim().toLowerCase() === name.toLowerCase();
      });

      // ถ้าเจอแถวที่ใช่ ให้ไปดึงข้อความจาก div ตัวที่สอง (Value) ออกมาคืนค่า
      if (foundRow && foundRow.children[1]) {
        return foundRow.children[1].textContent.trim();
      }

      return null;
    };

    const appPath = getBlockMetadata('app-path');
    const appStyle = getBlockMetadata('app-style');
    const appRoot = getBlockMetadata('app-root');

    // if (block.classList.contains('retirement')) {
    //   type = 'retirement';
    // } else if (block.classList.contains('tax')) {
    //   type = 'tax';
    // } else if (block.classList.contains('saving')) {
    //   type = 'saving';
    // } else {
    //   const metaRow = Array.from(block.querySelectorAll('div')).find((el) => el.textContent.trim().toLowerCase() === 'name');
    //   if (metaRow && metaRow.nextElementSibling) {
    //     type = metaRow.nextElementSibling.textContent.trim().toLowerCase();
    //   }
    // }

    // const legacyConfig = appConfig[type] || appConfig.retirement;
    config.script = appPath;
    config.css = appStyle;
    config.rootClass = appRoot;
  }

  block.classList.add('reactapp');
  // Create shadow root for CSS isolation
  const shadow = block.attachShadow({ mode: 'open' });
  const root = document.createElement('div');
  root.className = config.rootClass;
  // แนะนำให้ใส่ id หรือสร้างจุดยึดที่ชัดเจนให้ React มารู้จัก
  root.id = config.rootClass; 
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
