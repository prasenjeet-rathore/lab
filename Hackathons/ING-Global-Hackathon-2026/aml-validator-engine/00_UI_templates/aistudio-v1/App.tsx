import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import RiskDrivers from './components/RiskDrivers';
import NetworkGraph from './components/NetworkGraph';
import GeminiCopilot from './components/GeminiCopilot';
import TransactionTable from './components/TransactionTable';
import CasesPage from './components/CasesPage';
import { MOCK_CASE, MOCK_GRAPH_DATA, MOCK_CASES_LIST } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'cases'>('dashboard');

  return (
    <div className="min-h-screen bg-[#F4F6F8] text-slate-800 font-sans pl-16">
      <Sidebar activeView={currentView} onNavigate={setCurrentView} />
      <div className="flex flex-col h-screen overflow-hidden">
        
        {/* Render Dashboard View */}
        {currentView === 'dashboard' && (
          <>
            <Header caseData={MOCK_CASE} />
            <main className="flex-1 p-4 overflow-y-auto overflow-x-hidden grid grid-cols-12 gap-4 h-full">
                {/* Top Row: Risk + Network + AI */}
                <div className="col-span-12 lg:col-span-3 h-[400px]">
                    <RiskDrivers drivers={MOCK_CASE.topRiskDrivers} />
                </div>
                
                <div className="col-span-12 lg:col-span-6 h-[400px]">
                    <NetworkGraph data={MOCK_GRAPH_DATA} />
                </div>

                <div className="col-span-12 lg:col-span-3 h-[400px]">
                    <GeminiCopilot caseData={MOCK_CASE} />
                </div>

                {/* Bottom Row: Transactions */}
                <div className="col-span-12 h-[350px] pb-4">
                    <TransactionTable transactions={MOCK_CASE.transactions} />
                </div>
            </main>
          </>
        )}

        {/* Render Cases View */}
        {currentView === 'cases' && (
          <main className="flex-1 h-full overflow-hidden">
            <CasesPage cases={MOCK_CASES_LIST} />
          </main>
        )}

      </div>
    </div>
  );
};

export default App;