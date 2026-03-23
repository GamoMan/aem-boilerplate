import { createRoot } from 'react-dom/client'
import './index.css'
import RetirementPlanner from './pages/RetirementPlan/RetirementPlanner.tsx';
import TaxSavingsPlanner from './pages/TaxSavingsPlan/TaxSavingsPlanner.tsx';
import SavingTools from './pages/SavingTools/SavingTools.tsx';

const mountApp = (selector, Component) => {
  // Check if mounting in shadow root (AEM block) or document (legacy)
  const root = window.fincalShadow || document;
  root.querySelectorAll(selector).forEach((container) => {
    if (container && !container.dataset.fincalMounted) {
      createRoot(container).render(<Component />);
      container.dataset.fincalMounted = 'true';
    }
  });
};

// Legacy mounts (standalone app pages)
mountApp('#root-retirement', RetirementPlanner);
mountApp('#root-tax-saving', TaxSavingsPlanner);
mountApp('#root-saving-tools', SavingTools);

// Block mounts (AEM integration)
mountApp('.fincalreact-root--retirement', RetirementPlanner);
mountApp('.fincalreact-root--tax', TaxSavingsPlanner);
mountApp('.fincalreact-root--saving', SavingTools);
