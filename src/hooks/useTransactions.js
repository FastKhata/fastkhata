import { useState, useEffect } from 'react';
import { db } from '../firebase';
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

export function useTransactions(userId) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync with Firestore if logged in, fallback to LocalStorage if offline/guest
  useEffect(() => {
    if (!userId) {
      const localData = localStorage.getItem('fastkhata_local_tx');
      setTransactions(localData ? JSON.parse(localData) : []);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'users', userId, 'transactions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format timestamp for local display safely
        dateStr: doc.data().timestamp?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'
      }));
      setTransactions(docs);
      setLoading(false);
    }, (err) => {
      console.warn("Firestore access error, falling back to local:", err);
      const localData = localStorage.getItem('fastkhata_local_tx');
      setTransactions(localData ? JSON.parse(localData) : []);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const addTransaction = async (type, amount, category, paymentMethod) => {
    const newTx = {
      type, // 'JAMA' (+ Money In) or 'KHARCHA' (- Money Out)
      amount: parseFloat(amount),
      category: category || (type === 'JAMA' ? 'Sales' : 'Misc'),
      paymentMethod: paymentMethod || 'CASH', // 'CASH' or 'UPI'
      timestamp: new Date().toISOString(),
      dateStr: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic UI Update
    setTransactions(prev => [ { id: 'temp_' + Date.now(), ...newTx }, ...prev ]);

    if (userId) {
      try {
        await addDoc(collection(db, 'users', userId, 'transactions'), {
          ...newTx,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        console.error("Failed to sync to cloud:", err);
      }
    } else {
      const currentLocal = JSON.parse(localStorage.getItem('fastkhata_local_tx') || '[]');
      const updated = [ { id: 'loc_' + Date.now(), ...newTx }, ...currentLocal ];
      localStorage.setItem('fastkhata_local_tx', JSON.stringify(updated));
    }
  };

  const removeTransaction = async (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (userId && !id.startsWith('temp_') && !id.startsWith('loc_')) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'transactions', id));
      } catch (err) {
        console.error("Error deleting document:", err);
      }
    } else {
      const currentLocal = JSON.parse(localStorage.getItem('fastkhata_local_tx') || '[]');
      const updated = currentLocal.filter(t => t.id !== id);
      localStorage.setItem('fastkhata_local_tx', JSON.stringify(updated));
    }
  };

  return { transactions, loading, addTransaction, removeTransaction };
  }
