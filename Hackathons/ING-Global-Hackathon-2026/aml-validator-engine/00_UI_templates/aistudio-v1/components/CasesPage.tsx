import React from 'react';
import { CaseSummary } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { FolderOpen, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface CasesPageProps {
  cases: CaseSummary[];
}

const CasesPage: React.FC<CasesPageProps> = ({ cases }) => {
  // Stats Calculation
  const totalCases = cases.length;
  const highRisk = cases.filter(c => c.riskLevel === 'HIGH').length;
  const inReview = cases.filter(c => c.status === 'IN_REVIEW' || c.status === 'OPEN').length;
  const closed = cases.filter(c => c.status === 'CLOSED').length;

  // Distribution Data
  const typeData = [
    { name: 'AML', value: cases.filter(c => c.type === 'AML').length },
    { name: 'KYC', value: cases.filter(c => c.type === 'KYC').length },
    { name: 'FRAUD', value: cases.filter(c => c.type === 'FRAUD').length },
  ];

  const statusData = [
    { name: 'Open', value: cases.filter(c => c.status === 'OPEN').length },
    { name: 'In Review', value: cases.filter(c => c.status === 'IN_REVIEW').length },
    { name: 'Closed', value: cases.filter(c => c.status === 'CLOSED').length },
  ];

  const COLORS = ['#FF6200', '#333333', '#94a3b8'];
  const STATUS_COLORS = ['#EF4444', '#F59E0B', '#10B981'];

  return (
    <div className="p-8 space-y-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ing-slate">Case Management</h1>
          <p className="text-ing-lightSlate text-sm">Overview of pending and completed validations.</p>
        </div>
        <button className="bg-ing-orange text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-ing-orangeHover transition-colors">
          + New Investigation
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <KPICard title="Total Cases" value={totalCases} icon={<FolderOpen className="text-blue-500" />} />
        <KPICard title="High Risk" value={highRisk} icon={<AlertTriangle className="text-red-500" />} />
        <KPICard title="Pending Review" value={inReview} icon={<Clock className="text-orange-500" />} />
        <KPICard title="Completed" value={closed} icon={<CheckCircle className="text-green-500" />} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-ing-slate text-sm mb-2">Case Type Distribution</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={typeData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
              <Tooltip cursor={{fill: 'transparent'}} />
              <Bar dataKey="value" barSize={20} radius={[0, 4, 4, 0]}>
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-ing-slate text-sm mb-2">Status Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="middle" align="right" layout="vertical" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cases Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-ing-slate text-sm">Active Investigations</h3>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-white text-xs text-ing-lightSlate uppercase font-semibold">
            <tr>
              <th className="px-6 py-3 border-b border-slate-100">Case ID</th>
              <th className="px-6 py-3 border-b border-slate-100">Entity</th>
              <th className="px-6 py-3 border-b border-slate-100">Type</th>
              <th className="px-6 py-3 border-b border-slate-100 text-center">Risk</th>
              <th className="px-6 py-3 border-b border-slate-100 text-center">Status</th>
              <th className="px-6 py-3 border-b border-slate-100">Analyst</th>
              <th className="px-6 py-3 border-b border-slate-100 text-right">Date Opened</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {cases.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium text-ing-slate">{c.id}</td>
                <td className="px-6 py-4">{c.entityName}</td>
                <td className="px-6 py-4">
                  <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold">{c.type}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    c.riskLevel === 'HIGH' ? 'bg-red-100 text-red-700' : 
                    c.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {c.riskLevel}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                   <div className="flex items-center justify-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${
                        c.status === 'OPEN' ? 'bg-red-500' :
                        c.status === 'IN_REVIEW' ? 'bg-orange-500' : 'bg-green-500'
                    }`}></span>
                    <span className="capitalize text-slate-600">{c.status.replace('_', ' ').toLowerCase()}</span>
                   </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{c.analyst}</td>
                <td className="px-6 py-4 text-right text-slate-500 font-mono text-xs">{c.dateOpened}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string; value: number; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-ing-lightSlate text-xs font-semibold uppercase tracking-wider mb-1">{title}</p>
      <p className="text-2xl font-bold text-ing-slate">{value}</p>
    </div>
    <div className="bg-slate-50 p-3 rounded-full border border-slate-100">
      {icon}
    </div>
  </div>
);

export default CasesPage;