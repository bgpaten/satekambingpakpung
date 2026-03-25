import { useMenus } from '../hooks/useMenus';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';

export function MenuSection() {
  const { menus, loading } = useMenus();

  return (
    <section className="py-20 bg-brand-dark" id="menu">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Menu Pilihan</h2>
          <p className="text-gray-400">Pilihan menu terbaik dari Sate Kambing Pak Pung.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse glass-card rounded-2xl h-96"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menus.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={item.id} 
                className={cn(
                  "relative flex flex-col glass-card rounded-2xl overflow-hidden group hover:box-glow transition-all duration-300",
                  item.is_special && "border-brand-accent/50 box-glow" // Highlight Gulai
                )}
              >
                {/* Image */}
                <div className="h-56 relative overflow-hidden">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark-card to-transparent" />
                  
                  {item.is_special && (
                    <div className="absolute top-4 right-4 bg-brand-highlight text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      🔥 LIMITED - Rabu Only
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow relative bg-brand-dark-card/90">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="text-brand-accent font-bold">Rp {item.price.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4 flex-grow">{item.description}</p>
                  
                  {/* Stock Tracking */}
                  <div className="mt-auto">
                    {item.stock > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", item.stock < 10 ? "bg-orange-500 animate-pulse" : "bg-green-500")}></div>
                        <span className="text-sm text-gray-300">
                          {item.stock < 10 ? `Sisa sedikit (${item.stock} porsi)` : `Tersedia`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-brand-highlight">
                        <Info className="w-4 h-4" />
                        <span className="text-sm font-bold">Habis Terjual</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
