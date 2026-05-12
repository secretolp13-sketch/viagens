'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, User, Send, Trash2, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { db, auth, signIn, logout, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';

interface Review {
  id: string;
  cityId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export default function ReviewsSection({ cityId }: { cityId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(auth?.currentUser || null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!db) {
        const timer = setTimeout(() => setIsLoading(false), 0);
        return () => clearTimeout(timer);
    }

    const q = query(
      collection(db, 'reviews'),
      where('cityId', '==', cityId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Review[];
      setReviews(docs);
      setIsLoading(false);
    }, (error) => {
      console.error(error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [cityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !db || isSubmitting || !comment.trim()) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        cityId,
        userId: user.uid,
        userName: user.displayName || 'Viajante',
        rating,
        comment,
        createdAt: serverTimestamp()
      });
      setComment('');
      setRating(5);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, userId: string) => {
    if (!user || user.uid !== userId || !db) return;
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`);
    }
  };

  if (!db) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-slate-500">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest">Reviews Offline</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Auth / Form */}
      <div className="mb-12">
        {user ? (
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center font-black">
                  {user.displayName?.[0] || 'U'}
                </div>
                <div>
                  <p className="text-sm font-black uppercase tracking-widest">{user.displayName || 'Viajante'}</p>
                  <button onClick={logout} className="text-[10px] text-slate-500 hover:text-white transition-colors uppercase font-bold tracking-widest">Sair</button>
                </div>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)}>
                    <Star className={`w-5 h-5 ${rating >= star ? 'text-indigo-500 fill-indigo-500' : 'text-slate-700'}`} />
                  </button>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="relative">
              <textarea 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Como foi sua experiência?"
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-6 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-all min-h-[120px] resize-none"
              />
              <button 
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                className="absolute bottom-6 right-6 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-full font-black uppercase text-[10px] tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Postar
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-12 text-center">
            <h3 className="text-xl font-black uppercase mb-6">Entre na Comunidade</h3>
            <button 
              onClick={signIn}
              className="px-10 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-[0.2em] transform hover:scale-105 transition-all"
            >
              Entrar com Google
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-slate-900 border border-slate-800 p-6 rounded-3xl relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">{rev.userName?.[0] || 'U'}</div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">{rev.userName}</h4>
                    <div className="flex gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-2 h-2 ${i < rev.rating ? 'text-indigo-500 fill-indigo-500' : 'text-slate-800'}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {user?.uid === rev.userId && (
                  <button onClick={() => handleDelete(rev.id, rev.userId)} className="text-slate-600 hover:text-rose-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-slate-400 text-xs font-light leading-relaxed italic">"{rev.comment}"</p>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-700 uppercase text-[10px] font-black tracking-widest border border-dashed border-slate-900 rounded-[32px]">
            Sem avaliações ainda.
          </div>
        )}
      </div>
    </div>
  );
}
