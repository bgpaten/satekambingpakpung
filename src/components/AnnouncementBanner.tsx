import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { AlertCircle, CalendarClock, Speaker, X } from 'lucide-react';
import { cn } from '../lib/utils';

export function AnnouncementBanner() {
  const { announcements } = useAnnouncements();
  const [closedBanners, setClosedBanners] = useState<string[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, string> = {};
      announcements.forEach(ann => {
        if (ann.end_time) {
          const distance = new Date(ann.end_time).getTime() - Date.now();
          if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            if (days > 0) {
               newCountdowns[ann.id] = `${days}h ${hours}j ${minutes}m`;
            } else {
               newCountdowns[ann.id] = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
          } else {
            newCountdowns[ann.id] = 'Berakhir';
          }
        }
      });
      setTimeRemaining(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [announcements]);

  const handleClose = (id: string) => {
    setClosedBanners(prev => [...prev, id]);
  };

  const visibleAnnouncements = announcements.filter(a => !closedBanners.includes(a.id));

  return (
    <div className="fixed top-0 left-0 w-full z-[100] flex flex-col gap-2 px-4 pt-4 mt-safe-top pointer-events-none">
      <AnimatePresence>
        {visibleAnnouncements.map((ann) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
               "pointer-events-auto max-w-2xl mx-auto w-full rounded-2xl md:rounded-full p-1 shadow-2xl backdrop-blur-xl border flex items-center justify-between",
               ann.type === 'holiday' 
                ? "bg-red-500/10 border-red-500/30 text-white" 
                : "bg-brand-accent/20 border-brand-accent/40 text-brand-cream"
            )}
          >
            <div className={cn(
              "flex flex-col md:flex-row items-center gap-3 w-full pl-2 pr-4 md:px-2 py-1 md:py-0.5",
              ann.type === 'holiday' ? "text-red-100" : "text-brand-cream/90"
            )}>
              {/* Icon area */}
              <div className={cn(
                 "hidden md:flex ml-1 w-8 h-8 rounded-full items-center justify-center shrink-0",
                 ann.type === 'holiday' ? "bg-red-500/20 text-red-400" : "bg-brand-accent/30 text-brand-accent"
              )}>
                {ann.type === 'holiday' ? <AlertCircle className="w-4 h-4" /> : <Speaker className="w-4 h-4" />}
              </div>

              {/* Text Area */}
              <div className="flex flex-col md:flex-row items-center md:gap-4 w-full justify-center md:justify-start text-center md:text-left py-2 md:py-1">
                <div className="flex flex-col">
                  <span className={cn(
                     "text-[10px] uppercase font-black tracking-widest block mb-0.5 md:hidden text-center",
                     ann.type === 'holiday' ? "text-red-400" : "text-brand-accent"
                   )}>
                    {ann.title}
                  </span>
                  <span className="text-xs md:text-sm font-semibold">{ann.type === 'holiday' ? ann.title : ann.description}</span>
                  {ann.type === 'holiday' && ann.description && (
                     <span className="text-[10px] md:text-xs opacity-80 mt-0.5">{ann.description}</span>
                  )}
                </div>
                
                {/* Countdown Timer */}
                {ann.end_time && (
                  <div className={cn(
                     "mt-2 md:mt-0 flex items-center gap-1.5 px-3 py-1 md:py-1.5 rounded-full md:ml-auto shrink-0",
                     ann.type === 'holiday' ? "bg-red-500/20 border border-red-500/30" : "bg-brand-dark/40 border border-brand-accent/20"
                  )}>
                    <CalendarClock className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    <span className="text-[10px] md:text-xs font-mono font-bold tracking-wider">
                      {timeRemaining[ann.id] || "Loading..."}
                    </span>
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button 
                onClick={() => handleClose(ann.id)}
                className="absolute top-2 right-2 md:relative md:top-auto md:right-auto w-6 h-6 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors shrink-0"
              >
                <X className="w-3 h-3 md:w-4 md:h-4 opacity-70" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
