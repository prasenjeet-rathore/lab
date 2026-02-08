import React, { useEffect, useState } from 'react';
import { Clock, ShieldAlert, CheckCircle, MoreHorizontal } from 'lucide-react';
import { CaseData } from '../types';

interface HeaderProps {
  caseData: CaseData;
}

const Header: React.FC<HeaderProps> = ({ caseData }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [urgencyColor, setUrgencyColor] = useState('text-ing-slate');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const deadline = new Date(caseData.slaDeadline).getTime();
      const now = new Date().getTime();
      const difference = deadline - now;

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        
        if (hours < 1) setUrgencyColor('text-red-600');
        else if (hours < 4) setUrgencyColor('text-ing-orange');
        else setUrgencyColor('text-emerald-600');

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        return "00:00:00 - OVERDUE";
      }
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [caseData.slaDeadline]);

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-6">
        <div>
          <h1 className="text-2xl font-bold text-ing-slate tracking-tight">Case {caseData.id}</h1>
          <div className="flex items-center space-x-2 mt-1">
             <span className="text-sm text-ing-lightSlate font-medium">Entity:</span>
             <span className="text-sm text-ing-slate font-semibold bg-slate-100 px-2 py-0.5 rounded">{caseData.entityName}</span>
          </div>
        </div>
        
        <div className="h-10 w-px bg-slate-200 mx-4"></div>

        <div className="flex items-center space-x-3">
            <div className={`flex items-center px-3 py-1.5 rounded-full border ${caseData.riskLevel === 'HIGH' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                <ShieldAlert size={16} className="mr-2" />
                <span className="text-sm font-bold">{caseData.riskLevel} RISK</span>
            </div>
            <div className="flex items-center px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-ing-slate">
                <span className="text-xs font-semibold uppercase mr-2 text-ing-lightSlate">Risk Score</span>
                <span className="text-sm font-bold">{caseData.riskScore}/100</span>
            </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 text-xs font-semibold text-ing-lightSlate uppercase tracking-wide">
                <Clock size={14} />
                <span>Time to SLA</span>
            </div>
            <span className={`text-xl font-mono font-bold ${urgencyColor}`}>{timeLeft}</span>
        </div>
        
        <div className="flex items-center space-x-3">
             <button className="px-4 py-2 bg-white border border-slate-300 text-ing-slate text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center shadow-sm">
                <MoreHorizontal size={16} />
             </button>
             <button className="px-5 py-2 bg-ing-orange text-white text-sm font-semibold rounded-lg hover:bg-ing-orangeHover transition-colors shadow-md flex items-center">
                <CheckCircle size={16} className="mr-2" />
                Approve Case
             </button>
        </div>
      </div>
    </header>
  );
};

export default Header;