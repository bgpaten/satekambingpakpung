import { useStoreStatus } from '../hooks/useStoreStatus';
import { Clock, MapPin, Phone, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function HeroSection({ onOrderClick }: { onOrderClick: () => void }) {
  const { statusText } = useStoreStatus();

  return (
    <section className="relative w-full h-[88vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Smoky Overlays */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero_sate_kambing.png" 
          alt="Sate Kambing Pak Pung" 
          className="w-full h-full object-cover"
        />
        {/* Deep Green/Black Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/95 via-brand-primary/60 to-brand-dark/90"></div>
        {/* Subtle Smoke/Grain Layer */}
        <div className="absolute inset-0 grain-overlay opacity-5"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl"
        >
          {/* Status Badge - Refined */}
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-10 shadow-2xl">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-accent"></span>
            </span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-brand-cream/60">{statusText}</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black mb-6 text-brand-cream leading-[0.95] uppercase">
            Sate Kambing<br/>
            <span className="text-brand-accent text-glow font-heading italic">Pak Pung</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-brand-cream/70 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
            <span className="text-brand-accent font-semibold italic">Resep Turun Temurun.</span> Nikmati sensasi kuliner legendaris dengan daging pilihan yang dibakar sempurna di atas bara api.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(212, 175, 55, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center gap-3 px-10 py-5 rounded-full bg-brand-accent text-brand-dark font-black text-xl transition-all shadow-2xl"
              onClick={onOrderClick}
            >
              <Phone className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Pesan Sekarang
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-brand-cream/50 text-sm font-medium">
             <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-accent" />
                <span>15.30 – 22.30 WIB</span>
             </div>
             <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-accent" />
                <span>Kampar Kiri Tengah</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded border border-brand-accent/30 text-[10px] text-brand-accent uppercase font-bold">24 Jam</span>
                <span>Pesan Kapan Saja</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 opacity-40"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Scroll Down</span>
        <ChevronDown className="w-5 h-5 text-brand-accent" />
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-brand-dark to-transparent z-0"></div>
    </section>
  );
}
