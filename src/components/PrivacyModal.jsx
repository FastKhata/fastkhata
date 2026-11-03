import React from 'react';
import { ShieldCheck, X, Trash2, Download } from 'lucide-react';

export default function PrivacyModal({ onClose, transactions, onClearAll }) {
  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FastKhata_Data_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-extrabold text-base text-slate-800">DPDP Data Rights & Privacy</h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Under India's Digital Personal Data Protection (DPDP) Act:
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li><strong>Purpose Limitation:</strong> We only store cash flow figures to generate your daily net balance.</li>
            <li><strong>No Data Selling:</strong> Your ledger is private and strictly tied to your account.</li>
            <li><strong>Right to Data Portability:</strong> You can download a complete backup of all logged entries anytime.</li>
            <li><strong>Right to Erasure:</strong> You have full rights to wipe your entire database history permanently.</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 space-y-2">
          <button
            onClick={exportData}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export My Full Data (JSON)</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to permanently delete all local & cloud transactions?")) {
                onClearAll();
                onClose();
              }
            }}
            className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 border border-rose-200"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All My Data (Erasure)</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 pt-2 border-t border-slate-100">
          FastKhata MVP v1.0 • Built with Privacy by Design
        </p>
      </div>
    </div>
  );
}
