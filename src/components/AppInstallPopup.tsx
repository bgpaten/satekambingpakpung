import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const AppInstallPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    // Check if already shown in this session or visited before
    const isFirstVisit = !localStorage.getItem('visited_before');
    const hasBeenDismissed = localStorage.getItem('install_popup_dismissed');

    if (isFirstVisit && !hasBeenDismissed) {
      // Show after a short delay
      const timer = setTimeout(() => setShow(true), 3000);
      localStorage.setItem('visited_before', 'true');
      return () => clearTimeout(timer);
    }

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // We could show the popup here instead of on first visit if preferred
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('install_popup_dismissed', 'true');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      setDeferredPrompt(null);
    } else {
      // Fallback for browsers that don't support beforeinstallprompt or already installed
      toast.info("Aplikasi siap diinstal melalui menu browser Anda (Add to Home Screen).");
    }
    handleDismiss();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[110]"
        >
          <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={handleDismiss} className="text-gray-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-4 items-center mb-6">
              <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Smartphone className="text-black w-8 h-8" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight">Instal Aplikasi Pak Pung</h3>
                <p className="text-gray-400 text-sm">Pesan lebih cepat langsung dari layar utama Anda.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleInstall}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Download className="w-4 h-4" /> Instal Sekarang
              </button>
              <button 
                onClick={handleDismiss}
                className="px-6 py-3 rounded-xl border border-white/10 text-white font-medium hover:bg-white/5 transition-all text-sm"
              >
                Nanti
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppInstallPopup;
