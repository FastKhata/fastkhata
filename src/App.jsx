import React, { useState } from 'react';
import DailyDashboard from './components/DailyDashboard';
import QuickAddModal from './components/QuickAddModal';
import PrivacyModal from './components/PrivacyModal';
import { useTransactions } from './hooks/useTransactions';
import { PlusCircle, MinusCircle } from 'lucide-react';

export default function App() {
  // In demo mode, userId is null (uses LocalStorage). Pass real auth UID when ready.rwfresh it
  const [userId] = useState(null); 
  const { transactions, loading, addTransaction, removeTransaction } = useTransactions(userId);
  
  const [activeModal, setActiveModal] = useState(null); // 'JAMA', 'KHARCHA', 'PRIVACY'

  const handleClearAll = () => {
    localStorage.removeItem('fastkhata_local_tx');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
        Loading FastKhata...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-28 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Main Screen */}
      <DailyDashboard 
        transactions={transactions} 
        onRemove={removeTransaction}
        onOpenPrivacy={() => setActiveModal('PRIVACY')}
      />

      {/* Fixed Sticky Bottom Action Bar (3-Second Entry Targets) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-3 z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          
          {/* Green "Got Money" Button */}
          <button
            onClick={() => setActiveModal('JAMA')}
            className="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all"
          >
            <PlusCircle className="w-5 h-5 stroke-[3]" />
            <span>GOT MONEY (+)</span>
          </button>

          {/* Red "Spent Money" Button */}
          <button
            onClick={() => setActiveModal('KHARCHA')}
            className="py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-sm rounded-2xl shadow-lg shadow-rose-200 flex items-center justify-center gap-2 transition-all"
          >
            <MinusCircle className="w-5 h-5 stroke-[3]" />
            <span>SPENT MONEY (-)</span>
          </button>

        </div>
      </div>

      {/* Modals */}
      {(activeModal === 'JAMA' || activeModal === 'KHARCHA') && (
        <QuickAddModal 
          type={activeModal} 
          onClose={() => setActiveModal(null)} 
          onSave={addTransaction}
        />
      )}

      {activeModal === 'PRIVACY' && (
        <PrivacyModal 
          onClose={() => setActiveModal(null)} 
          transactions={transactions}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  );
          }
