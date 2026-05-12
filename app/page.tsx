'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Sparkles, Navigation, History, Utensils, Hotel, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/city/${encodeURIComponent(search.trim().toLowerCase())}`);
  };

  const featured = [
    { city: 'Lisboa', country: 'Portugal', img: 'lisbon', span: 'col-span-8 row-span-3' },
    { city: 'Tóquio', country: 'Japão', img: 'tokyo', span: 'col-span-4 row-span-2' },
    { city: 'Paris', country: 'França', img: 'paris', span: 'col-span-4 row-span-2' },
    { city: 'Rio de Janeiro', country: 'Brasil', img: 'rio', span: 'col-span-4 row-span-2' },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center font-black text-xl text-white">V</div>
            <h1 className="text-2xl font-black tracking-tight">Vibe<span className="text-indigo-400">Travel</span></h1>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md px-10">
            <form onSubmit={handleSearch} className="relative w-full flex items-center gap-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Para onde vamos agora?" 
                  className="w-full bg-slate-900 border border-slate-800 rounded-full py-3 px-6 pl-12 focus:outline-none focus:border-indigo-500 text-sm transition-all text-white"
                />
                <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-500" />
              </div>
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shrink-0"
              >
                Explorar
              </button>
            </form>
          </div>

          <div className="flex gap-6 items-center">
            <span className="text-xs uppercase font-bold tracking-widest text-slate-500 cursor-pointer hover:text-white transition-colors">Sobre</span>
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
                <Navigation className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
        </header>

        {/* Hero Section - Bento-style Search */}
        <div className="mb-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-indigo-900/20 border border-indigo-500/30 rounded-[40px] p-12 text-center relative overflow-hidden"
           >
              <div className="relative z-10">
                <span className="inline-block px-4 py-1.5 bg-indigo-600/30 text-indigo-300 text-[10px] font-black rounded-full uppercase tracking-[0.3em] mb-6">Explore o mundo com IA</span>
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none">
                   Descubra sua <br /> próxima grande história.
                </h2>
                
                <div className="max-w-2xl mx-auto md:hidden mt-8">
                    <form onSubmit={handleSearch} className="relative w-full flex flex-col gap-4">
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Ex: Londres, Roma..." 
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 px-6 focus:outline-none focus:border-indigo-500 text-lg text-white"
                        />
                        <button 
                          type="submit" 
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-4 rounded-2xl font-black uppercase text-sm tracking-widest transition-all"
                        >
                          Explorar Destino
                        </button>
                    </form>
                </div>
              </div>
              <div className="absolute -right-24 -bottom-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full"></div>
              <div className="absolute -left-24 -top-24 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full"></div>
           </motion.div>
        </div>

        {/* Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-6 min-h-[400px]">
             {/* Large Main Card */}
             <motion.div 
               whileHover={{ scale: 1.01 }}
               onClick={() => router.push('/city/lisboa')}
               className="md:col-span-8 md:row-span-2 bg-slate-900 border border-slate-800 rounded-[32px] p-8 relative overflow-hidden group cursor-pointer"
             >
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full uppercase tracking-widest">Destaque</span>
                        <h3 className="text-6xl font-black mt-4 group-hover:text-indigo-400 transition-colors">Lisboa</h3>
                        <p className="text-slate-400 max-w-sm mt-4 text-sm font-light leading-relaxed">
                            Caminhe pelas ladeiras históricas e sinta a brisa do Tejo em uma das capitais mais charmosas da Europa.
                        </p>
                    </div>
                    <div className="flex gap-4 mt-8">
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
                            <Utensils className="w-3 h-3" /> Gastronomia
                         </div>
                         <div className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-full text-xs font-bold text-slate-300">
                            <History className="w-3 h-3" /> História
                         </div>
                    </div>
                </div>
                <div className="absolute right-[-10%] bottom-[-10%] w-[60%] h-[120%] opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-700 pointer-events-none">
                    <img src="https://picsum.photos/seed/lisbon/800/1200" alt="Lisbon" className="w-full h-full object-cover" />
                </div>
             </motion.div>

             {/* Smaller Cards */}
             <div className="md:col-span-4 bg-indigo-600 rounded-[32px] p-8 flex flex-col justify-between text-white group cursor-pointer hover:bg-indigo-500 transition-colors">
                <Sparkles className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight leading-tight">Dicas Inteligentes</h4>
                    <p className="text-indigo-100/70 text-xs mt-2 font-medium">Nossa IA seleciona os melhores pontos com base em dados em tempo real.</p>
                </div>
             </div>

             <div className="md:col-span-4 bg-slate-900 border border-slate-800 rounded-[32px] p-8 flex flex-col justify-between group cursor-pointer hover:border-slate-700 transition-colors">
                <Navigation className="w-8 h-8 text-indigo-400" />
                <div>
                    <h4 className="text-2xl font-black uppercase tracking-tight leading-tight">Roteiros Prontos</h4>
                    <p className="text-slate-500 text-xs mt-2 font-light italic">Planeje 1, 3 ou 7 dias com cronogramas precisos.</p>
                </div>
             </div>
        </div>

        {/* Footer info */}
        <footer className="mt-24 pb-12 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-slate-900 pt-12">
            <div className="text-center md:text-left">
                <h5 className="text-lg font-black uppercase tracking-widest text-slate-600 mb-2">VibeTravel</h5>
                <p className="text-slate-500 text-xs font-light">Transformando buscas em memórias. AI powered travel guide.</p>
            </div>
            <div className="flex gap-4">
                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center"><Navigation className="w-4 h-4 text-slate-500" /></div>
                <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center"><Search className="w-4 h-4 text-slate-500" /></div>
            </div>
        </footer>
      </div>
    </main>
  );
}
