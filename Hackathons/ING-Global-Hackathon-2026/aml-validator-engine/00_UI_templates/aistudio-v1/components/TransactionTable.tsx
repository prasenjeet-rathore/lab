import React from 'react';
import { Transaction } from '../types';
import { Download, Filter, Search } from 'lucide-react';

interface TransactionTableProps {
  transactions: Transaction[];
}

const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-sm font-bold text-ing-slate uppercase tracking-wider flex items-center">
          <span className="w-2 h-2 bg-slate-800 rounded-full mr-2"></span>
          Transaction History
        </h3>
        <div className="flex items-center space-x-2">
            <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search ID..." 
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-ing-orange w-32 md:w-48"
                />
            </div>
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded">
                <Filter size={16} />
            </button>
            <button className="p-1.5 text-slate-500 hover:bg-slate-100 rounded">
                <Download size={16} />
            </button>
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200">Txn ID</th>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200">Date/Time</th>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200">Type</th>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200">Counterparty</th>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200 text-right">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200 text-center">Score</th>
              <th className="px-4 py-3 text-xs font-semibold text-ing-lightSlate uppercase tracking-wider border-b border-slate-200 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-orange-50/30 transition-colors group cursor-pointer">
                <td className="px-4 py-3 text-xs font-medium text-ing-slate">{txn.id}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{txn.date}</td>
                <td className="px-4 py-3 text-xs text-slate-600">
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-bold">{txn.type}</span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-700">
                    {txn.sender === 'Global Ventures Ltd' ? <span className="text-slate-400 mr-1">To:</span> : <span className="text-slate-400 mr-1">From:</span>}
                    <span className="font-medium">{txn.sender === 'Global Ventures Ltd' ? txn.receiver : txn.sender}</span>
                </td>
                <td className="px-4 py-3 text-xs font-mono font-medium text-ing-slate text-right">
                    {txn.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {txn.currency}
                </td>
                <td className="px-4 py-3 text-center">
                    <div className={`text-xs font-bold ${txn.riskScore > 80 ? 'text-red-600' : (txn.riskScore > 50 ? 'text-yellow-600' : 'text-green-600')}`}>
                        {txn.riskScore}
                    </div>
                </td>
                <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                        ${txn.status === 'FLAGGED' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {txn.status}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;