import { useState, useEffect } from 'react';
import { Download, Smartphone, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InstallApp() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // If no prompt, maybe show instructions for iOS or other browsers
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        setShowIOSInstructions(true);
      }
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstalled(true);
    }
  };

  if (isInstalled) return null;

  return (
    <section className="py-16 bg-brand-dark-card/30 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative glass-card p-1 rounded-[32px] box-glow border-white/5"
        >
          <div className="bg-[#111] rounded-[28px] p-8 md:p-12 overflow-hidden relative">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-4">
                    PWA Ready
                  </span>
                  <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                    Pasang Aplikasi <br/>
                    <span className="text-brand-accent">Pak Pung</span>
                  </h2>
                </div>
                
                <p className="text-gray-400 text-lg">
                  Dapatkan pengalaman pemesanan yang lebih cepat, mudah, dan hemat kuota dengan memasang aplikasi di layar utama Anda.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Smartphone className="w-5 h-5 text-brand-accent" />
                    <span className="text-sm font-medium">Akses langsung dari Home Screen</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Download className="w-5 h-5 text-brand-accent" />
                    <span className="text-sm font-medium">Loading lebih cepat & ringan</span>
                  </div>
                </div>

                <button 
                  onClick={handleInstallClick}
                  className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-brand-accent text-brand-dark font-black text-lg transition-all hover:scale-[1.03] shadow-[0_15px_30px_-10px_rgba(212,175,55,0.4)]"
                >
                  <Download className="w-6 h-6 group-hover:animate-bounce" />
                  Download Aplikasi
                </button>
              </div>

              <div className="flex justify-center md:justify-end">
                <div className="relative">
                  {/* Smartphone Mockup */}
                  <div className="w-64 h-[480px] bg-black rounded-[40px] border-[8px] border-zinc-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-zinc-800 rounded-b-2xl"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-brand-dark to-[#1a1a1a]">
                      <div className="w-20 h-20 rounded-2xl bg-brand-dark shadow-xl border border-white/10 flex items-center justify-center mb-6">
                        <img src="/icons/icon-192.png" alt="App Icon" className="w-16 h-16 rounded-xl" />
                      </div>
                      <div className="w-32 h-2 bg-white/20 rounded-full mb-2"></div>
                      <div className="w-20 h-2 bg-white/10 rounded-full"></div>
                    </div>
                  </div>
                  
                  {/* Floating elements */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-6 -right-6 w-24 h-24 bg-brand-accent/20 rounded-3xl blur-2xl"
                  ></motion.div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {showIOSInstructions && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-8 p-4 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-start gap-4"
                >
                  <Info className="w-6 h-6 text-brand-accent flex-shrink-0 mt-1" />
                  <div className="text-sm text-gray-300">
                    <p className="font-bold text-white mb-2">Instruksi untuk iPhone/iPad:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Buka link ini di browser <span className="text-brand-accent font-bold">Safari</span></li>
                      <li>Ketuk tombol <span className="inline-block p-1 bg-white/10 rounded flex-shrink-0">Bagikan (Share)</span> di bar navigasi</li>
                      <li>Scroll ke bawah dan pilih <span className="text-brand-accent font-bold">"Tambah ke Layar Utama"</span></li>
                    </ol>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
