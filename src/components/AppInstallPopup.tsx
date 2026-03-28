import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AppInstallPopup: React.FC = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;

  useEffect(() => {
    const hasBeenDismissed = localStorage.getItem('install_popup_dismissed');
    if (hasBeenDismissed) return;

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show popup immediately when browser identifies it as installable
      setShow(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Fallback: Show after a short delay for branding/education if not already shown
    const isFirstVisit = !localStorage.getItem('visited_before');
    let timer: any;
    if (isFirstVisit) {
      timer = setTimeout(() => {
        setShow(true);
        localStorage.setItem('visited_before', 'true');
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      if (timer) clearTimeout(timer);
    };
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
        handleDismiss();
      }
      setDeferredPrompt(null);
    } else {
      // Show instructional view for iOS/Unsupported
      setShowInstructions(true);
    }
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

            {showInstructions ? (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 space-y-3">
                  <p className="text-sm text-gray-300">
                    Browser Anda tidak mendukung instalasi otomatis. Silakan instal secara manual:
                  </p>
                  <ol className="text-sm text-gray-400 space-y-2 list-decimal list-inside">
                    {isIOS ? (
                      <>
                        <li>Klik ikon <span className="text-blue-400 font-bold">Bagikan/Share</span> di bar bawah (kotak dengan panah)</li>
                        <li>Gulir ke bawah dan klik <span className="text-white font-bold">"Add to Home Screen"</span></li>
                      </>
                    ) : (
                      <>
                        <li>Klik ikon <span className="text-white font-bold">Titik Tiga</span> di pojok browser</li>
                        <li>Pilih <span className="text-white font-bold">"Instal Aplikasi"</span> atau <span className="text-white font-bold">"Tambahkan ke Layar Utama"</span></li>
                      </>
                    )}
                  </ol>
                </div>
                <button 
                  onClick={handleDismiss}
                  className="w-full py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 transition-all"
                >
                  Saya Mengerti
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AppInstallPopup;
