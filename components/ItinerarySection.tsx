'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Clock, MapPin, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { getItinerary, Itinerary } from '@/lib/gemini';

export default function ItinerarySection({ cityName }: { cityName: string }) {
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadItinerary() {
      setIsLoading(true);
      try {
        const data = await getItinerary(cityName, days);
        setItinerary(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadItinerary();
  }, [cityName, days]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Day Selector */}
      <div className="flex justify-center gap-2 mb-12">
        {[1, 3, 7].map((d) => (
          <button
            key={d}
            onClick={() => setDays(d)}
            className={`px-8 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${
              days === d 
              ? 'bg-indigo-600 text-white' 
              : 'bg-slate-900 text-slate-500 hover:bg-slate-800'
            }`}
          >
            {d} {d === 1 ? 'Dia' : 'Dias'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <div className="flex flex-col items-center py-12">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-600 uppercase text-[9px] font-black tracking-widest">IA Planejando...</p>
          </div>
        ) : itinerary ? (
          <div className="space-y-12">
            {itinerary.schedule.map((day, dIdx) => (
              <div key={dIdx} className="bg-slate-900 border border-slate-800 rounded-[32px] p-8">
                <h3 className="text-2xl font-black uppercase tracking-tight mb-8 text-indigo-400">Dia {day.day}</h3>
                
                <div className="space-y-4">
                  {day.activities.map((act, aIdx) => (
                    <div 
                      key={aIdx}
                      className="group bg-slate-950/50 p-6 rounded-2xl border border-slate-800/50 flex gap-6 items-start hover:border-indigo-500/30 transition-all"
                    >
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <Clock className="w-4 h-4 text-indigo-500 opacity-50" />
                        <span className="text-[9px] font-black text-slate-600 uppercase">{act.time}</span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold uppercase mb-1 tracking-tight">{act.activity}</h4>
                        <p className="text-slate-500 text-xs font-light leading-relaxed">{act.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
