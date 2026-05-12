'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, MapPin, Sparkles, Navigation, History, 
  Utensils, Hotel, ShoppingBag, CheckCircle, XCircle, 
  Plane, DollarSign, Calendar, MessageSquare, Info, TrendingUp, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCityContent, CityContent } from '@/lib/gemini';
import ReviewsSection from '@/components/ReviewsSection';
import ItinerarySection from '@/components/ItinerarySection';

export default function CityPage({ params }: { params: Promise<{ name: string }> }) {
  const { name: cityNameRaw } = use(params);
  const cityName = decodeURIComponent(cityNameRaw);
  const [cityData, setCityData] = useState<CityContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('guide'); 
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getCityContent(cityName);
        setCityData(data);
      } catch (err) {
        console.error(err);
        setError('Ocorreu um erro ao buscar informações. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [cityName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-4xl font-black uppercase tracking-[0.5em] text-indigo-600 mb-4"
        >
          {cityName}
        </motion.div>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Compilando seu guia bento...</p>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-16 h-16 text-rose-500 mb-6" />
        <h2 className="text-4xl font-black uppercase tracking-tight mb-4">Ops! Desvio no caminho</h2>
        <button onClick={() => router.push('/')} className="px-8 py-3 bg-indigo-600 text-white font-bold uppercase text-xs rounded-full">Recomeçar Busca</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <button 
             onClick={() => router.push('/')}
             className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors group text-[10px] font-black uppercase tracking-widest"
           >
             <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
             Início
           </button>
           <div className="flex-1 text-center">
              <h1 className="text-xl font-black uppercase tracking-widest">{cityName}</h1>
           </div>
           <div className="w-10 h-10 bg-indigo-600 rounded flex items-center justify-center text-white font-black">V</div>
        </div>
      </header>

      <div className="container mx-auto px-6 pt-32 pb-24">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[100px] md:auto-rows-[120px]">
          
          {/* Main Card: Image & Headline */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-8 md:row-span-4 bg-indigo-900/20 border border-indigo-500/30 rounded-[40px] p-10 relative overflow-hidden"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
               <div>
                  <span className="px-4 py-1 bg-indigo-600/30 text-indigo-300 text-[10px] font-black rounded-full uppercase tracking-widest">Explorando Agora</span>
                  <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none mt-6 mb-4">{cityName}</h2>
                  <p className="text-slate-300 text-lg md:text-xl font-light italic max-w-xl leading-relaxed">
                    {cityData.history.substring(0, 150)}...
                  </p>
               </div>
               <div className="flex gap-4 items-center">
                  <div className="px-6 py-3 bg-slate-950/50 backdrop-blur-md rounded-2xl border border-white/5 flex items-center gap-3">
                     <Clock className="w-4 h-4 text-indigo-400" />
                     <span className="text-xs font-bold uppercase tracking-widest">Melhor época: Mar — Jun</span>
                  </div>
               </div>
            </div>
            <img 
              src={`https://picsum.photos/seed/${cityName}/1200/800`} 
              alt={cityName}
              className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale hover:grayscale-0 transition-all duration-1000"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Itinerary Tab Trigger */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             onClick={() => setActiveTab('itinerary')}
             className={`md:col-span-4 md:row-span-5 rounded-[40px] p-8 cursor-pointer transition-all ${
               activeTab === 'itinerary' ? 'bg-indigo-600 border-indigo-400' : 'bg-slate-900 border border-slate-800'
             }`}
          >
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-black uppercase">Roteiros</h3>
                <Calendar className={`w-6 h-6 ${activeTab === 'itinerary' ? 'text-white' : 'text-indigo-400'}`} />
             </div>
             <div className="space-y-4">
                {[1, 3, 7].map(d => (
                   <div key={d} className={`p-4 rounded-2xl border ${activeTab === 'itinerary' ? 'bg-white/10 border-white/20' : 'bg-slate-800/50 border-slate-700/50'}`}>
                      <div className="flex justify-between items-center mb-1">
                         <span className="font-bold uppercase text-xs tracking-widest">{d} {d === 1 ? 'Dia' : 'Dias'}</span>
                         {d === 3 && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded tracking-tighter uppercase font-black">Popular</span>}
                      </div>
                      <p className="text-[10px] opacity-60 font-light truncate">Curadoria IA para {d} {d === 1 ? 'dia' : 'dias'} intensos em {cityName}.</p>
                   </div>
                ))}
             </div>
             <div className="mt-8">
                <button className={`w-full py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  activeTab === 'itinerary' ? 'bg-white text-indigo-600' : 'bg-indigo-600 text-white'
                }`}>
                  Visualizar Detalhes
                </button>
             </div>
          </motion.div>

          {/* Pros & Cons Card */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="md:col-span-4 md:row-span-4 bg-slate-900 border border-slate-800 rounded-[40px] p-8 flex flex-col"
          >
             <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Veredito
             </h3>
             <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 block">+ Fortes</span>
                    <ul className="space-y-2">
                        {cityData.positives.slice(0, 3).map((p, i) => (
                           <li key={i} className="text-[10px] font-light leading-relaxed opacity-60">• {p}</li>
                        ))}
                    </ul>
                </div>
                <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 block">- Fracos</span>
                    <ul className="space-y-2">
                        {cityData.negatives.slice(0, 3).map((n, i) => (
                           <li key={i} className="text-[10px] font-light leading-relaxed opacity-60">• {n}</li>
                        ))}
                    </ul>
                </div>
             </div>
          </motion.div>

          {/* Budget Card */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="md:col-span-4 md:row-span-4 bg-slate-900 border border-slate-800 rounded-[40px] p-8 flex flex-col"
          >
             <h3 className="text-xl font-black uppercase mb-6">Finanças</h3>
             <div className="space-y-4">
                {[
                  { icon: Plane, label: 'Passagem (Média)', val: cityData.prices.flightEstimation },
                  { icon: Hotel, label: 'Hotelaria (Noite)', val: cityData.prices.hotelAverage },
                  { icon: DollarSign, label: 'Gasto Diário', val: cityData.prices.dailyExpense },
                ].map((item, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                      <div className="flex items-center gap-3">
                         <item.icon className="w-4 h-4 text-indigo-400 opacity-50" />
                         <span className="text-[10px] font-bold uppercase tracking-tight text-slate-400">{item.label}</span>
                      </div>
                      <span className="text-xs font-black uppercase tracking-tighter">{item.val}</span>
                   </div>
                ))}
             </div>
             <p className="mt-auto text-[10px] opacity-20 text-center font-bold italic tracking-widest">Baseado em dados Beta IA</p>
          </motion.div>

          {/* Reviews Preview/Tab Card */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             onClick={() => setActiveTab('reviews')}
             className={`md:col-span-4 md:row-span-3 rounded-[40px] p-8 flex flex-col justify-between cursor-pointer transition-all ${
               activeTab === 'reviews' ? 'bg-indigo-500 border-indigo-400 text-white' : 'bg-slate-900 border border-slate-800'
             }`}
          >
             <div className="flex items-end gap-2">
                <span className="text-6xl font-black leading-none">4.9</span>
                <span className={`text-[10px] font-bold uppercase pb-1 ${activeTab === 'reviews' ? 'text-indigo-100' : 'text-slate-600'}`}>/ 5.0</span>
             </div>
             <p className={`text-[10px] font-medium leading-relaxed mt-4 ${activeTab === 'reviews' ? 'text-indigo-100' : 'text-slate-400'}`}>
                Nível de satisfação média de viajantes que consultaram {cityName} esta semana.
             </p>
             <div className="flex -space-x-3 mt-6">
                {[1, 2, 3].map(avatar => (
                   <div key={avatar} className="w-10 h-10 rounded-full border-2 border-slate-950 bg-slate-700 flex items-center justify-center text-[10px] font-bold">UA</div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-900 flex items-center justify-center text-[8px] font-black">+4k</div>
             </div>
          </motion.div>

          {/* History/Curiosities Expansion (Full Width Bottom Bento) */}
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="md:col-span-12 md:row-span-4 bg-slate-950 border border-slate-900 rounded-[40px] p-12 overflow-y-auto"
          >
             <AnimatePresence mode="wait">
                {activeTab === 'guide' && (
                   <motion.div key="guide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                         <div>
                            <h4 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
                               <History className="w-6 h-6 text-indigo-400" /> Passado & Cultura
                            </h4>
                            <p className="text-lg text-slate-400 font-light leading-relaxed italic">{cityData.history}</p>
                         </div>
                         <div className="bg-slate-900/50 p-8 rounded-[32px] border border-slate-800">
                            <h4 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                               <Info className="w-5 h-5 text-indigo-400" /> Curiosidades
                            </h4>
                            <ul className="space-y-4">
                                {cityData.curiosities.map((c, i) => (
                                   <li key={i} className="flex gap-4 text-sm text-slate-300 font-light leading-snug group">
                                      <span className="text-indigo-600 font-black">0{i+1}</span>
                                      {c}
                                   </li>
                                ))}
                            </ul>
                         </div>
                      </div>

                      {/* Attractions Horizontal Bento */}
                      <div>
                         <h4 className="text-3xl font-black uppercase mb-10 text-center">Top Destinos Locais</h4>
                         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {cityData.attractions.map((attr, i) => (
                               <div key={i} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl group cursor-pointer overflow-hidden relative aspect-square flex flex-col justify-end">
                                  <img 
                                    src={`https://picsum.photos/seed/${attr.name}/400/400`} 
                                    alt={attr.name} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale group-hover:opacity-60 transition-opacity"
                                    referrerPolicy="no-referrer"
                                  />
                                  <span className="relative z-10 text-[10px] font-black uppercase tracking-tighter leading-tight bg-slate-950/80 p-2 rounded-lg">{attr.name}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                   </motion.div>
                )}

                {activeTab === 'itinerary' && (
                   <motion.div key="itinerary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <ItinerarySection cityName={cityName} />
                        <div className="text-center mt-12">
                           <button onClick={() => setActiveTab('guide')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Voltar ao Guia</button>
                        </div>
                   </motion.div>
                )}

                {activeTab === 'reviews' && (
                   <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <ReviewsSection cityId={cityName} />
                        <div className="text-center mt-12">
                           <button onClick={() => setActiveTab('guide')} className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Voltar ao Guia</button>
                        </div>
                   </motion.div>
                )}
             </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
