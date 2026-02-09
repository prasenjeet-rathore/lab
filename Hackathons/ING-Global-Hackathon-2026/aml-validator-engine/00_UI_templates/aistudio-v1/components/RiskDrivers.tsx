import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CaseData } from '../types';

interface RiskDriversProps {
  drivers: CaseData['topRiskDrivers'];
}

const RiskDrivers: React.FC<RiskDriversProps> = ({ drivers }) => {
  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-ing-slate uppercase tracking-wider flex items-center">
          <span className="w-2 h-2 bg-ing-orange rounded-full mr-2"></span>
          Key Risk Drivers
        </h3>
        <span className="text-xs text-ing-lightSlate bg-slate-100 px-2 py-1 rounded">Model: XGBoost v4.2</span>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={drivers}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide />
            <YAxis 
                dataKey="name" 
                type="category" 
                width={120} 
                tick={{fontSize: 11, fill: '#525151', fontWeight: 500}} 
                axisLine={false}
                tickLine={false}
            />
            <Tooltip 
                cursor={{fill: '#f4f6f8'}}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Bar dataKey="value" barSize={12} radius={[0, 4, 4, 0]}>
              {drivers.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#FF6200' : '#94A3B8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskDrivers;