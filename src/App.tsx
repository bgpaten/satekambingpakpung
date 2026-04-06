import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { SocialProof } from './components/SocialProof';
import { AdminDashboard } from './components/AdminDashboard';
import AboutUs from './components/AboutUs';
import TermsSection from './components/TermsSection';
import OrderModal from './components/OrderModal';
import AppInstallPopup from './components/AppInstallPopup';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Toaster } from 'sonner';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    // Simple hash routing
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-dark selection:bg-brand-accent selection:text-brand-dark">
      <Toaster position="top-center" richColors />
      {/* Global Grain Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] grain-overlay opacity-10"></div>
      <AnnouncementBanner />
      
      {isAdmin ? (
        <AdminDashboard />
      ) : (
        <main className="relative overflow-x-hidden text-brand-cream/90 w-full flex flex-col">
          <HeroSection onOrderClick={() => setIsOrderModalOpen(true)} />
          
          <div className="relative z-10 bg-brand-dark">
            {/* Subtle Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent"></div>
            <AboutUs />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent"></div>
            <MenuSection />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent"></div>
            <TermsSection />
            
            <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-accent/10 to-transparent"></div>
            <SocialProof />
          </div>
          
          <OrderModal 
            isOpen={isOrderModalOpen} 
            onClose={() => setIsOrderModalOpen(false)} 
          />
          <AppInstallPopup />
          
          <footer className="bg-brand-dark py-24 relative overflow-hidden mt-auto">
            {/* Footer Divider */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-accent/20 to-transparent"></div>
            
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-black mb-2 text-brand-accent italic font-heading tracking-widest uppercase">Pak Pung</h2>
              <p className="text-brand-cream/30 text-sm mb-12 uppercase tracking-[0.4em] font-bold">Cita Rasa Legendaris</p>
              
              <p className="mb-2 text-brand-cream/40 text-xs font-light">© {new Date().getFullYear()} Sate Kambing Pak Pung. Semua Hak Dilindungi.</p>
              <p className="mb-10 text-brand-accent/50 text-[10px] uppercase tracking-[0.2em] font-bold">Terima Kasih Telah Menjadi Bagian Dari Sejarah Kami</p>
              
              <a 
                href="#admin" 
                className="inline-block px-6 py-2 rounded-full border border-white/5 text-[10px] text-brand-cream/20 hover:text-brand-accent hover:border-brand-accent/30 uppercase tracking-[0.3em] transition-all font-black"
              >
                Portal Admin
              </a>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}

export default App;
