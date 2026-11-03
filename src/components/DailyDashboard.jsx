import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, Trash2, ShieldCheck, Wallet } from 'lucide-react';

export default function DailyDashboard({ transactions, onRemove, onOpenPrivacy }) {
  // Calculate Totals
  const todayJama = transactions
    .filter(t => t.type === 'JAMA')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayKharcha = transactions
    .filter(t => t.type === 'KHARCHA')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = todayJama - todayKharcha;

  const cashSales = transactions
    .filter(t => t.type === 'JAMA' && t.paymentMethod === 'CASH')
    .reduce((sum, t) => sum + t.amount, 0);

  const upiSales = transactions
    .filter(t => t.type === 'JAMA' && t.paymentMethod === 'UPI')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-2xl shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center font-bold text-lg text-slate-950">
            ₹
          </div>
          <div>
            <h1 className="font-bold text-base leading-tight">FastKhata</h1>
            <p className="text-xs text-slate-400">Daily Cashflow Ledger</p>
          </div>
        </div>
        <button 
          onClick={onOpenPrivacy}
          className="text-slate-400 hover:text-emerald-400 p-2 rounded-lg flex items-center gap-1 text-xs bg-slate-800"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>DPDP Safe</span>
        </button>
      </div>

      {/* Hero Net Card */}
      <div className={`p-5 rounded-2xl shadow-lg border text-white transition-all ${
        netBalance >= 0 ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-500' : 'bg-gradient-to-br from-rose-600 to-red-700 border-rose-500'
      }`}>
        <p className="text-xs font-medium uppercase tracking-wider text-emerald-100 opacity-90">Today's Net Cashflow</p>
        <div className="text-3xl font-black mt-1">
          ₹{netBalance.toLocaleString('en-IN')}
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/20 text-xs">
          <div>
            <span className="opacity-80 block">Cash Earned</span>
            <span className="font-bold text-sm">₹{cashSales.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <span className="opacity-80 block">UPI/Online</span>
            <span className="font-bold text-sm">₹{upiSales.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-center gap-3">
          <ArrowUpCircle className="w-7 h-7 text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-emerald-800">Total Money IN</p>
            <p className="text-lg font-bold text-emerald-950">₹{todayJama.toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-center gap-3">
          <ArrowDownCircle className="w-7 h-7 text-rose-600 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-rose-800">Total Spent</p>
            <p className="text-lg font-bold text-rose-950">₹{todayKharcha.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      {/* Transaction Feed */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <h2 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Wallet className="w-4 h-4 text-slate-500" />
            Today's Log ({transactions.length})
          </h2>
          <span className="text-xs text-slate-400">Tap trash icon to delete</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            No transactions logged today.<br/>Tap green or red buttons below to log in 3 seconds!
          </div>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {transactions.map((t) => (
              <div 
                key={t.id}
                className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${t.type === 'JAMA' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      {t.category} 
                      <span className="ml-2 text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-normal">
                        {t.paymentMethod}
                      </span>
                    </p>
                    <p className="text-[10px] text-slate-400">{t.dateStr}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${t.type === 'JAMA' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {t.type === 'JAMA' ? '+' : '-'}₹{t.amount}
                  </span>
                  <button 
                    onClick={() => onRemove(t.id)}
                    className="text-slate-300 hover:text-rose-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
            }
      
