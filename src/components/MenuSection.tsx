import { useMenus } from '../hooks/useMenus';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { Info, Star, Flame } from 'lucide-react';

export function MenuSection() {
  const { menus, loading } = useMenus();

  return (
    <section className="py-32 relative bg-brand-dark overflow-hidden" id="menu">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-[10px] font-bold uppercase tracking-[0.3em] mb-4">
            Menu Pilihan
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-brand-cream mb-6 leading-tight">
            Cita Rasa <span className="text-brand-accent italic">Legendaris</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-brand-accent to-transparent mx-auto"></div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse glass-card rounded-[32px] h-[450px]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {menus.map((item, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                key={item.id} 
                className={cn(
                  "relative flex flex-col glass-card rounded-[32px] overflow-hidden group hover:border-brand-accent/40 transition-all duration-500",
                  item.name.toLowerCase().includes('gulai') && "border-brand-accent/30 bg-brand-accent/[0.02]"
                )}
              >
                {/* Image Section */}
                <div className="h-64 relative overflow-hidden">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-90 group-hover:brightness-100" />
                  
                  {/* Badge Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  <div className="absolute top-5 left-5 flex flex-col gap-2">
                    {item.name.toLowerCase().includes('gulai') ? (
                      <div className="bg-brand-accent text-brand-dark text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 uppercase tracking-wider">
                        <Star className="w-3 h-3 fill-brand-dark" /> Spesial Sabtu
                      </div>
                    ) : item.price >= 40000 ? (
                      <div className="bg-brand-accent text-brand-dark text-[10px] font-black px-3 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 uppercase tracking-wider">
                        <Flame className="w-3 h-3 fill-brand-dark" /> Terlaris
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-brand-cream group-hover:text-brand-accent transition-colors">
                        {item.name}
                    </h3>
                  </div>
                  
                  <p className="text-brand-cream/50 text-sm mb-8 flex-grow leading-relaxed font-light italic">
                    "{item.description}"
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-brand-cream/30 uppercase font-black tracking-widest mb-1">Harga Mulai</span>
                        <span className="text-2xl font-black text-brand-accent tracking-tight">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>

                    {/* Stock Status */}
                    <div className="flex items-center gap-2">
                        {item.stock > 0 ? (
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-green-500 font-black uppercase tracking-widest">Tersedia</span>
                                <div className="flex gap-1 mt-1">
                                    {[1, 2, 3].map(dot => (
                                        <div key={dot} className={cn("w-1 h-1 rounded-full", item.stock < 10 && dot === 3 ? "bg-white/10" : "bg-green-500")}></div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-brand-highlight/60">
                                <span className="text-[10px] font-black uppercase tracking-widest">Habis</span>
                                <Info className="w-4 h-4" />
                            </div>
                        )}
                    </div>
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
