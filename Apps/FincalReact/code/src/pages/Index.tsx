import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RetirementPlanner from '@/components/RetirementPlan/RetirementPlanner';
import SavingTools from '@/components/SavingTools/SavingTools';

const Index = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="bg-white">
            <RetirementPlanner />
          </div>
        } />
        <Route path="/saving-tools" element={
          <div className="bg-white">
            <SavingTools />
          </div>
        } />
      </Routes>
    </Router>
  );
};

export default Index;