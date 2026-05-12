'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Search, MapPin, Sparkles, Navigation, History, 
  Utensils, Hotel, ShoppingBag, CheckCircle, XCircle, 
  Plane, DollarSign, Calendar, MessageSquare, Info, Quote,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getCityContent, getItinerary, CityContent, Itinerary } from '@/lib/gemini';
import ReviewsSection from '@/components/ReviewsSection';
import ItinerarySection from '@/components/ItinerarySection';

export default function CityPage({ params }: { params: Promise<{ name: string }> }) {
  const { name: cityNameRaw } = use(params);
  const cityName = decodeURIComponent(cityNameRaw);
  const [cityData, setCityData] = useState<CityContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('guide'); // 'guide', 'itinerary', 'reviews'
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        const data = await getCityContent(cityName);
        setCityData(data);
      } catch (err) {
        console.error(err);
        setError('Ocorreu um erro ao buscar informações desta cidade. Tente novamente.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [cityName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-16 h-16 border-t-2 border-orange-600 rounded-full mb-8"
        />
        <h2 className="text-2xl font-black uppercase tracking-widest animate-pulse">Viajando para {cityName}...</h2>
        <p className="text-gray-500 mt-2 font-light">Preparando seu guia personalizado com IA</p>
      </div>
    );
  }

  if (error || !cityData) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white p-6 text-center">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-3xl font-black uppercase mb-4">Ops! Desvio no caminho</h2>
        <p className="text-gray-400 mb-8 max-w-md">{error || 'Cidade não encontrada.'}</p>
        <button onClick={() => router.push('/')} className="px-8 py-4 bg-white text-black font-bold uppercase text-sm rounded-full">Voltar ao Início</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-orange-500/30">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${cityName}/1920/1080`} 
          alt={cityName}
          className="absolute inset-0 w-full h-full object-cover brightness-[0.3] scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button 
              onClick={() => router.push('/')}
              className="group flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 uppercase text-xs font-bold tracking-widest"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
              Voltar
            </button>
            <span className="text-orange-500 font-bold uppercase tracking-[0.4em] text-sm mb-2 block">Explorando</span>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none mb-6">
              {cityName}
            </h1>
            <div className="flex flex-wrap gap-6 text-sm text-gray-300 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500" /> Guia Local</span>
              <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-orange-500" /> IA Powered</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <div className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-xl border-y border-white/5">
        <div className="container mx-auto px-6 flex justify-center">
          {[
            { id: 'guide', label: 'Guia Completo', icon: Navigation },
            { id: 'itinerary', label: 'Roteiros', icon: Calendar },
            { id: 'reviews', label: 'Avaliações', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-8 py-6 text-xs font-bold uppercase tracking-[0.2em] relative flex items-center gap-2 transition-all ${
                activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-orange-500' : ''}`} />
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-orange-600"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeTab === 'guide' && (
            <motion.div
              key="guide"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-24 max-w-6xl mx-auto"
            >
              {/* History & Curiosities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <History className="w-8 h-8 text-orange-500" />
                    <h2 className="text-3xl font-black uppercase tracking-tight">História</h2>
                  </div>
                  <p className="text-gray-400 text-lg leading-relaxed font-light first-letter:text-6xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:text-orange-600">
                    {cityData.history}
                  </p>
                </div>
                <div className="bg-white/5 p-10 rounded-3xl border border-white/10">
                  <div className="flex items-center gap-3 mb-8">
                    <Info className="w-8 h-8 text-orange-500" />
                    <h2 className="text-3xl font-black uppercase tracking-tight">Curiosidades</h2>
                  </div>
                  <ul className="space-y-6">
                    {cityData.curiosities.map((c, i) => (
                      <li key={i} className="flex gap-4 group">
                        <span className="text-orange-500 font-black text-xl opacity-30 group-hover:opacity-100 transition-opacity">0{i+1}</span>
                        <p className="text-gray-300 font-light leading-snug">{c}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tourism Blocks */}
              <div className="space-y-16">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Sparkles className="w-10 h-10 text-orange-600" />
                      <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">O que visitar</h2>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cityData.attractions.map((attr, i) => (
                      <motion.div 
                        key={i}
                        whileHover={{ y: -10 }}
                        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden group"
                      >
                        <div className="h-48 bg-gray-900 relative overflow-hidden">
                          <img 
                            src={`https://picsum.photos/seed/${attr.name}/600/400`} 
                            alt={attr.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-60"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                          <span className="absolute bottom-4 left-4 font-black uppercase text-lg tracking-tight">{attr.name}</span>
                        </div>
                        <div className="p-6">
                          <p className="text-gray-500 text-sm font-light leading-relaxed">{attr.description}</p>
                        </div>
                      </motion.div>
                    ))}
                 </div>
              </div>

              {/* Food & Hotel Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <section>
                  <div className="flex items-center gap-3 mb-10">
                    <Utensils className="w-8 h-8 text-orange-500" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Gastronomia</h2>
                  </div>
                  <div className="space-y-6">
                    {cityData.restaurants.map((r, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold uppercase">{r.name}</h4>
                          <span className="text-[10px] px-2 py-1 bg-white/10 rounded uppercase font-bold tracking-widest text-gray-400">{r.type}</span>
                        </div>
                        <p className="text-gray-500 text-sm font-light">{r.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <div className="flex items-center gap-3 mb-10">
                    <Hotel className="w-8 h-8 text-orange-500" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Onde ficar</h2>
                  </div>
                  <div className="space-y-6">
                    {cityData.hotels.map((h, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-xl font-bold uppercase">{h.name}</h4>
                          <span className="text-[10px] px-2 py-1 bg-orange-500/20 text-orange-500 rounded uppercase font-bold tracking-widest">{h.range}</span>
                        </div>
                        <p className="text-gray-500 text-sm font-light">{h.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Commerce & Budget */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-10">
                    <ShoppingBag className="w-8 h-8 text-orange-500" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Compras</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cityData.commerce.map((c, i) => (
                      <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5">
                        <h4 className="text-lg font-bold uppercase mb-2">{c.name}</h4>
                        <p className="text-gray-500 text-sm font-light">{c.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-600 rounded-[40px] p-10 flex flex-col justify-between overflow-hidden relative">
                   <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-10 text-black">
                      <TrendingUp className="w-8 h-8" />
                      <h2 className="text-4xl font-black uppercase tracking-tighter">Orçamento</h2>
                    </div>
                    <div className="space-y-8">
                       <div className="flex items-center gap-4">
                        <Plane className="w-6 h-6 text-black/50" />
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">Estimativa de Passagem</p>
                          <p className="text-xl font-bold text-black">{cityData.prices.flightEstimation}</p>
                        </div>
                       </div>
                       <div className="flex items-center gap-4">
                        <Hotel className="w-6 h-6 text-black/50" />
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">Média Hotel / Noite</p>
                          <p className="text-xl font-bold text-black">{cityData.prices.hotelAverage}</p>
                        </div>
                       </div>
                       <div className="flex items-center gap-4">
                        <DollarSign className="w-6 h-6 text-black/50" />
                        <div>
                          <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-black/40">Gasto Diário Sugerido</p>
                          <p className="text-xl font-bold text-black">{cityData.prices.dailyExpense}</p>
                        </div>
                       </div>
                    </div>
                   </div>
                   <DollarSign className="absolute -bottom-10 -right-10 w-48 h-48 text-black/10 rotate-12" />
                </div>
              </div>

               {/* Pros & Cons */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Pontos Positivos</h2>
                  </div>
                  <ul className="space-y-4">
                    {cityData.positives.map((p, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-xl bg-green-500/5 border border-green-500/10">
                        <p className="text-gray-300 font-light">{p}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <XCircle className="w-8 h-8 text-red-500" />
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Pontos Negativos</h2>
                  </div>
                  <ul className="space-y-4">
                    {cityData.negatives.map((n, i) => (
                      <li key={i} className="flex gap-4 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
                        <p className="text-gray-300 font-light">{n}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </motion.div>
          )}

          {activeTab === 'itinerary' && (
            <motion.div
              key="itinerary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ItinerarySection cityName={cityName} />
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ReviewsSection cityId={cityName} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer CTA */}
      <footer className="py-24 border-t border-white/5 text-center">
         <p className="text-gray-600 text-xs font-bold uppercase tracking-[0.5em] mb-4">VibeTravel - Seu próximo destino</p>
         <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">Pronto para a aventura?</h2>
         <button onClick={() => router.push('/')} className="px-12 py-6 border border-white/20 rounded-full font-black uppercase text-sm tracking-widest hover:border-white hover:bg-white hover:text-black transition-all">Ver outra cidade</button>
      </footer>
    </div>
  );
}
