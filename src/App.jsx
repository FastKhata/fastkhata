import React, { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';
import { db } from './firebase';
import { ArrowUpRight, ArrowDownLeft, Trash2, Wallet, PlusCircle } from 'lucide-react';

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('IN');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(docs);
      setLoading(false);
    }, (error) => {
      console.error("Firestore read error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;

    try {
      await addDoc(collection(db, 'transactions'), {
        description: description.trim() || (type === 'IN' ? 'Cash Received' : 'Cash Paid'),
        amount: parseFloat(amount),
        type,
        createdAt: serverTimestamp()
      });
      setDescription('');
      setAmount('');
    } catch (error) {
      console.error("Firestore write error:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error("Firestore delete error:", error);
    }
  };

  const totalIn = transactions
    .filter(t => t.type === 'IN')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const totalOut = transactions
    .filter(t => t.type === 'OUT')
    .reduce((acc, t) => acc + (t.amount || 0), 0);

  const netBalance = totalIn - totalOut;

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen flex flex-col justify-between">
      <div>
        {/* Top App Header */}
        <div className="flex items-center justify-between py-3 border-b border-gray-800 mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight">FastKhata</h1>
          </div>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium">
            Live Sync
          </span>
        </div>

        {/* Dynamic Balance Overview Card */}
        <div className="bg-gray-800/80 border border-gray-700/60 rounded-2xl p-5 mb-5 shadow-xl backdrop-blur-sm">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Net Balance</p>
          <div className={`text-3xl font-extrabold mb-4 ${netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            ₹{netBalance.toLocaleString('en-IN')}
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700/50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                <ArrowDownLeft className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Cash In</p>
                <p className="text-sm font-semibold text-emerald-400">₹{totalIn.toLocaleString('en-IN')}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
                <ArrowUpRight className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase">Cash Out</p>
                <p className="text-sm font-semibold text-rose-400">₹{totalOut.toLocaleString('en-IN')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction Entry Form */}
        <form onSubmit={handleAddTransaction} className="bg-gray-800/40 border border-gray-800 rounded-xl p-4 mb-5 space-y-3">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-900 rounded-lg border border-gray-800">
            <button
              type="button"
              onClick={() => setType('IN')}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                type === 'IN' 
                  ? 'bg-emerald-500 text-gray-950 shadow-md' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              + CASH IN
            </button>
            <button
              type="button"
              onClick={() => setType('OUT')}
              className={`py-2 text-xs font-semibold rounded-md transition-all ${
                type === 'OUT' 
                  ? 'bg-rose-500 text-gray-950 shadow-md' 
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              - CASH OUT
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Note (e.g. Tea, Milk, Customer)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-700/80 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
            <input
              type="number"
              placeholder="Amount (₹)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-28 bg-gray-900 border border-gray-700/80 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-opacity ${
              type === 'IN' ? 'bg-emerald-500 hover:bg-emerald-400 text-gray-950' : 'bg-rose-500 hover:bg-rose-400 text-gray-950'
            }`}
          >
            <PlusCircle className="w-4 h-4" /> Save {type === 'IN' ? 'Entry' : 'Expense'}
          </button>
        </form>

        {/* Realtime History List */}
        <div className="space-y-2">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent Transactions</h2>
          {loading ? (
            <p className="text-xs text-gray-500 text-center py-4">Loading ledger...</p>
          ) : transactions.length === 0 ? (
            <p className="text-xs text-gray-500 text-center py-6 border border-dashed border-gray-800 rounded-xl">
              No entries recorded yet.
            </p>
          ) : (
            transactions.map((t) => (
              <div 
                key={t.id} 
                className="flex items-center justify-between p-3 bg-gray-800/30 border border-gray-800/80 rounded-xl hover:border-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-xs font-bold ${
                    t.type === 'IN' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                  }`}>
                    {t.type === 'IN' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200">{t.description}</p>
                    <p className="text-[10px] text-gray-500">
                      {t.createdAt?.toDate ? t.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold ${t.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {t.type === 'IN' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </span>
                  <button 
                    onClick={() => handleDelete(t.id)} 
                    className="text-gray-600 hover:text-rose-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
            }
