import { useState, useEffect } from 'react';
import { HeroSection } from './components/HeroSection';
import { MenuSection } from './components/MenuSection';
import { OrderForm } from './components/OrderForm';
import { SocialProof } from './components/SocialProof';
import { InstallApp } from './components/InstallApp';
import { AdminDashboard } from './components/AdminDashboard';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Simple hash routing
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return <AdminDashboard />;
  }

  return (
    <main className="min-h-screen bg-brand-dark overflow-x-hidden text-white w-full">
      <HeroSection />
      <MenuSection />
      <OrderForm />
      <InstallApp />
      <SocialProof />
      
      <footer className="bg-black py-12 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p className="mb-2">© {new Date().getFullYear()} Sate Kambing Pak Pung. All rights reserved.</p>
          <p className="mb-6 text-brand-accent font-bold">Resep Asli, Rasa Melegenda</p>
          
          <a 
            href="#admin" 
            className="text-[10px] text-gray-700 hover:text-gray-500 uppercase tracking-widest transition-colors font-medium"
          >
            Panel Penjual
          </a>
        </div>
      </footer>
    </main>
  );
}

export default App;
