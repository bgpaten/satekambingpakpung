import React, { useState } from 'react';
import { useMenus } from '../hooks/useMenus';
import { useStoreStatus } from '../hooks/useStoreStatus';
import { supabase } from '../lib/supabase';
import { Send, AlertCircle, ShoppingCart, Clock as ClockIcon, User, Plus, Minus } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function OrderForm() {
  const { menus } = useMenus();
  const { isOpen } = useStoreStatus();
  
  const [formData, setFormData] = useState({
    name: '',
    quantities: {} as Record<string, number>,
    time: '',
    notes: ''
  });

  const updateQuantity = (menuId: string, delta: number) => {
    setFormData(prev => ({
      ...prev,
      quantities: {
        ...prev.quantities,
        [menuId]: Math.max(0, (prev.quantities[menuId] || 0) + delta)
      }
    }));
  };

  const selectedCount = Object.values(formData.quantities).reduce((a, b) => a + b, 0);
  const totalAmount = menus.reduce((sum, m) => sum + (m.price * (formData.quantities[m.id] || 0)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOpen) return;
    
    const selectedItems = menus
      .filter(m => (formData.quantities[m.id] || 0) > 0)
      .map(m => ({
        id: m.id,
        name: m.name,
        quantity: formData.quantities[m.id],
        price: m.price
      }));

    if (selectedItems.length === 0) {
      alert("Silakan pilih minimal satu menu!");
      return;
    }

    // Save to Supabase
    try {
      const { error } = await supabase
        .from('orders')
        .insert([{
          customer_name: formData.name,
          items: selectedItems,
          total_price: totalAmount,
          pickup_time: formData.time,
          status: 'pending',
          notes: formData.notes,
          menu_name: selectedItems.map(i => `${i.name} x${i.quantity}`).join(', '),
          quantity: selectedItems.reduce((sum, i) => sum + i.quantity, 0)
        }]);

      if (error) throw error;
    } catch (err) {
      console.error("Gagal menyimpan pesanan ke database:", err);
    }

    const date = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const itemsList = selectedItems.map(item => `- ${item.name} x ${item.quantity} (Rp ${(item.price * item.quantity).toLocaleString('id-ID')})`).join('\n');

    const message = `🧾 *STRUK PEMESANAN - SATE KAMBING PAK PUNG* 🧾\n` +
      `------------------------------------------\n` +
      `📅 Tanggal: ${date}\n` +
      `👤 Nama: ${formData.name}\n` +
      `------------------------------------------\n` +
      `🛒 *PESANAN:*\n` +
      `${itemsList}\n\n` +
      `💰 *TOTAL BAYAR:*\n` +
      `*Rp ${totalAmount.toLocaleString('id-ID')}*\n` +
      `------------------------------------------\n` +
      `⏰ Jam Ambil: ${formData.time}\n` +
      `📝 Keterangan: ${formData.notes || '-'}\n\n` +
      `Mohon konfirmasi ketersediaannya. Terima kasih!`;
    
    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "6285117425840";
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  return (
    <section className="py-24 relative bg-[#0a0a0a] overflow-hidden" id="order">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Header Section */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-accent/10 border border-brand-accent/20 text-brand-accent text-xs font-bold uppercase tracking-widest mb-4">
                Pemesanan Mudah
              </span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                Siap <span className="text-brand-accent italic">Manjakan</span><br/>Lidah Anda?
              </h2>
              <p className="text-gray-400 text-lg mt-6 leading-relaxed max-w-md">
                Isi detail pesanan Anda di samping, dan kami akan menyiapkan hidangan terbaik tepat waktu.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-brand-accent/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-accent/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <ClockIcon className="text-brand-accent w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Ambil Sesuai Jadwal</h4>
                  <p className="text-sm text-gray-400">Pilih jam pengambilan agar hidangan tetap hangat.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 group hover:border-brand-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <AlertCircle className="text-brand-primary w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Status Ketersediaan</h4>
                  <p className="text-sm text-gray-400">Menu akan otomatis terkunci jika stok habis.</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass-card rounded-[32px] p-1 md:p-2 relative overflow-hidden box-glow border-white/10"
            >
              <div className="bg-brand-dark-card/50 backdrop-blur-xl rounded-[28px] p-6 md:p-10">
                {!isOpen && (
                  <div className="absolute inset-2 z-50 bg-brand-dark/95 backdrop-blur-md rounded-[24px] flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                      <AlertCircle className="text-red-500 w-10 h-10" />
                    </div>
                    <h3 className="text-3xl font-bold mb-3 text-white">Pak Pung Sedang Tutup</h3>
                    <p className="text-gray-400 mb-8 max-w-xs text-lg">Kami melayani pesanan setiap hari pada jam <strong>15:30 - 22:30</strong>.</p>
                    <button className="px-8 py-3 rounded-full bg-white/10 border border-white/10 text-white font-bold hover:bg-white/20 transition-all">Hubungi Customer Service</button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Customer Info Group */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 ml-1">
                      <User className="w-4 h-4" /> INFORMASI PEMESAN
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Masukkan nama Anda..."
                      className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-transparent transition-all text-lg"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  {/* Menu Items Grid */}
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">
                      <ShoppingCart className="w-4 h-4" /> Daftar Menu
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {menus.map(menu => {
                        const qty = formData.quantities[menu.id] || 0;
                        const isSelected = qty > 0;
                        
                        return (
                          <div 
                            key={menu.id} 
                            className={cn(
                              "relative group p-4 rounded-3xl border transition-all duration-300 flex flex-col justify-between h-32 overflow-hidden",
                              isSelected 
                                ? "bg-brand-accent/10 border-brand-accent/30 ring-1 ring-brand-accent/20" 
                                : "bg-white/5 border-white/10 hover:border-white/20"
                            )}
                          >
                            <div className="flex justify-between items-start mb-2 relative z-10">
                              <div>
                                <h4 className={cn("font-bold text-base transition-colors", isSelected ? "text-brand-accent" : "text-white")}>
                                  {menu.name}
                                </h4>
                                <p className="text-gray-500 text-xs font-medium mt-0.5">Rp {menu.price.toLocaleString('id-ID')}</p>
                              </div>
                              {menu.stock === 0 && (
                                <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-2 py-1 rounded-full border border-red-500/20 uppercase">Habis</span>
                              )}
                            </div>

                            <div className="flex items-center justify-between relative z-10">
                              <div className="flex items-center gap-1 bg-black/20 backdrop-blur-sm rounded-2xl p-1 border border-white/5">
                                <button 
                                  type="button"
                                  onClick={() => updateQuantity(menu.id, -1)}
                                  className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                    isSelected ? "text-brand-accent hover:bg-brand-accent/20" : "text-gray-600 cursor-default"
                                  )}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className={cn("inline-block w-8 text-center text-sm font-black", isSelected ? "text-white" : "text-gray-600")}>
                                  {qty}
                                </span>
                                <button 
                                  type="button"
                                  onClick={() => updateQuantity(menu.id, 1)}
                                  disabled={menu.stock === 0}
                                  className={cn(
                                    "w-8 h-8 rounded-xl flex items-center justify-center transition-all",
                                    menu.stock > 0 ? "text-brand-accent hover:bg-brand-accent/20" : "text-gray-700 cursor-not-allowed"
                                  )}
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Pickup & Notes Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        <ClockIcon className="w-4 h-4" /> Waktu Ambil
                      </label>
                      <input 
                        type="time" 
                        required
                        min="15:30"
                        max="22:30"
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-lg appearance-none"
                        value={formData.time}
                        onChange={e => setFormData({...formData, time: e.target.value})}
                      />
                    </div>
                    <div className="space-y-4">
                       <label className="flex items-center gap-2 text-sm font-bold text-gray-400 ml-1 uppercase tracking-wider">
                        Keterangan
                      </label>
                      <input 
                        className="w-full bg-brand-dark/50 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent transition-all text-sm"
                        placeholder="Titip pesan (opsional)..."
                        value={formData.notes}
                        onChange={e => setFormData({...formData, notes: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Order Summary & Submit */}
                  <div className="pt-8 border-t border-white/10">
                    <AnimatePresence>
                      {selectedCount > 0 && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-6 p-6 rounded-3xl bg-brand-accent/5 border border-brand-accent/20 flex items-center justify-between"
                        >
                          <div>
                            <p className="text-gray-400 text-sm font-medium">Total Pesanan ({selectedCount} Porsi)</p>
                            <p className="text-3xl font-black text-white mt-1">
                              Rp {totalAmount.toLocaleString('id-ID')}
                            </p>
                          </div>
                          <div className="hidden md:block text-right">
                             <p className="text-brand-accent text-xs font-bold uppercase tracking-widest italic">Best Choice</p>
                             <p className="text-gray-500 text-[10px] mt-1 italic">Harga sudah termasuk pajak</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button 
                      type="submit" 
                      disabled={!isOpen}
                      className={cn(
                        "w-full group relative flex items-center justify-center gap-3 py-5 rounded-[20px] font-black text-xl transition-all duration-500 overflow-hidden",
                        isOpen 
                          ? "bg-brand-accent text-brand-dark hover:scale-[1.02] shadow-[0_20px_40px_-15px_rgba(212,175,55,0.4)]" 
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      )}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <Send className={cn("w-6 h-6 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1", isOpen && "text-brand-dark")} />
                      {isOpen ? "Konfirmasi via WhatsApp" : "Toko Sedang Tutup"}
                    </button>
                    
                    <p className="text-center text-gray-500 text-[10px] mt-4 uppercase tracking-[0.2em] font-bold">
                      Klik tombol di atas untuk membuat pesanan ke WhatsApp
                    </p>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
