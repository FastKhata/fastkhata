import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

const QUICK_CHIPS = {
  JAMA: ['Sales', 'Udhaar Paid', 'Other'],
  KHARCHA: ['Chai/Snacks', 'Wholesale Stock', 'Rent', 'Delivery', 'Misc']
};

export default function QuickAddModal({ type, onClose, onSave }) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(type === 'JAMA' ? 'Sales' : 'Chai/Snacks');
  const [paymentMethod, setPaymentMethod] = useState('CASH');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;
    onSave(type, amount, category, paymentMethod);
    onClose();
  };

  const isJama = type === 'JAMA';

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isJama ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <h3 className="font-extrabold text-lg text-slate-800">
              {isJama ? 'Got Money (+)' : 'Spent Money (-)'}
            </h3>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Large Amount Input */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1">Enter Amount (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
              <input
                type="number"
                pattern="[0-9]*"
                inputMode="decimal"
                autoFocus
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-3xl font-black bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
              />
            </div>
          </div>

          {/* Payment Method Toggle */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Payment Mode</label>
            <div className="grid grid-cols-2 gap-2">
              {['CASH', 'UPI'].map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPaymentMethod(mode)}
                  className={`py-2.5 rounded-xl font-bold text-xs transition-all ${
                    paymentMethod === mode
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {mode === 'CASH' ? '💵 Cash Drawer' : '📱 UPI / GPay'}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Tag Chips */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Quick Category</label>
            <div className="flex flex-wrap gap-2">
              {QUICK_CHIPS[type].map((chip) => (
                <button
                  type="button"
                  key={chip}
                  onClick={() => setCategory(chip)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    category === chip
                      ? isJama ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg active:scale-98 transition-all ${
              isJama ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
            }`}
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Save Entry</span>
          </button>
        </form>
      </div>
    </div>
  );
}
