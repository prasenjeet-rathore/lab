import React from 'react';
import { FileText, Bell } from 'lucide-react';

interface SidebarProps {
  activeView: 'dashboard' | 'cases';
  onNavigate: (view: 'dashboard' | 'cases') => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate }) => {
  return (
    <div className="w-16 h-screen bg-ing-deepWhite border-r border-slate-200 flex flex-col items-center py-6 fixed left-0 top-0 z-50">
      <div className="mb-8">
        <div className="w-10 h-10 bg-ing-orange rounded-lg flex items-center justify-center shadow-md">
           <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
        </div>
      </div>
      
      <nav className="flex-1 flex flex-col space-y-6 w-full items-center">
        <NavItem 
          icon={<Bell size={20} />} 
          active={activeView === 'dashboard'} 
          onClick={() => onNavigate('dashboard')} 
        />
        <NavItem 
          icon={<FileText size={20} />} 
          active={activeView === 'cases'} 
          onClick={() => onNavigate('cases')} 
        />
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; active?: boolean; onClick: () => void }> = ({ icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all duration-200 ${active ? 'bg-orange-50 text-ing-orange shadow-sm border border-orange-100' : 'text-ing-lightSlate hover:bg-slate-100'}`}
  >
    {icon}
  </button>
);

export default Sidebar;