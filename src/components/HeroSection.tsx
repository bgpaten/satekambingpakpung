import { useStoreStatus } from '../hooks/useStoreStatus';
import { Clock, MapPin, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function HeroSection() {
  const { isOpen, statusText } = useStoreStatus();

  return (
    <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/images/hero_sate_kambing.png" 
          alt="Sate Kambing" 
          className="w-full h-full object-cover filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-brand-dark/80 bg-gradient-to-t from-brand-dark via-brand-primary/40 to-brand-dark/90"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 glass-card mb-6">
            <span className="relative flex h-3 w-3">
              <span className={cn("animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", isOpen ? "bg-green-400" : "bg-red-400")}></span>
              <span className={cn("relative inline-flex rounded-full h-3 w-3", isOpen ? "bg-green-500" : "bg-red-500")}></span>
            </span>
            <span className="text-sm font-medium tracking-wide">{statusText}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-white drop-shadow-lg uppercase">
            Sate Kambing<br/>
            <span className="text-brand-accent text-glow">Pak Pung</span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-200 mb-8 font-light">
            Dibakar fresh saat dipesan. Nikmati sensasi premium street food dengan cita rasa legendaris.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 text-gray-300 bg-black/40 px-4 py-2 rounded-full">
              <Clock className="w-5 h-5 text-brand-accent" />
              <span>15.30 – 22.30</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300 bg-black/40 px-4 py-2 rounded-full">
              <MapPin className="w-5 h-5 text-brand-highlight" />
              <span>Bina Baru, Kampar Kiri Tengah</span>
            </div>
          </div>

          <motion.a
            href="#order"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "inline-flex items-center gap-2 px-8 py-4 rounded-full text-brand-dark font-bold text-lg transition-all box-glow",
              isOpen ? "bg-brand-accent hover:bg-brand-accent-hover" : "bg-gray-500 cursor-not-allowed opacity-80"
            )}
            onClick={(e) => {
              if (!isOpen) e.preventDefault();
            }}
          >
            <Phone className="w-5 h-5" />
            {isOpen ? "Pesan Sekarang via WhatsApp" : "Toko Sedang Tutup"}
          </motion.a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-brand-dark to-transparent"></div>
    </section>
  );
}
