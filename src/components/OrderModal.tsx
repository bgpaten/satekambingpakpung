import React, { useState } from 'react';
import { useMenus } from '../hooks/useMenus';
import { useStoreStatus } from '../hooks/useStoreStatus';
import { supabase } from '../lib/supabase';
import { Send, AlertCircle, ShoppingCart, Clock as ClockIcon, Plus, Minus, X, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose }) => {
  const { menus } = useMenus();
  const { isOpen: isStoreOpen } = useStoreStatus();
  const [orderType, setOrderType] = useState<'menu' | 'quick'>('menu');
  
  const [formData, setFormData] = useState({
    name: '',
    quantities: {} as Record<string, number>,
    time: '',
    notes: '',
    quickOrderText: ''
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

  // Estimation logic
  const getEstimation = (count: number) => {
    if (count === 0) return null;
    if (count <= 3) return "15 Menit";
    if (count <= 5) return "30 Menit";
    return "45+ Menit";
  };

  const estimation = getEstimation(selectedCount);

  const handleWhatsAppOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const phoneNumber = "6285264191991";
    let message = "";

    if (orderType === 'menu') {
      const selectedItems = menus
        .filter(m => (formData.quantities[m.id] || 0) > 0)
        .map(m => ({
          id: m.id,
          name: m.name,
          quantity: formData.quantities[m.id],
          price: m.price
        }));

      if (selectedItems.length === 0) {
        toast.error("Silakan pilih minimal satu menu!");
        return;
      }

      // Save to Supabase
      try {
        await supabase.from('orders').insert([{
          customer_name: formData.name,
          items: selectedItems,
          total_price: totalAmount,
          pickup_time: formData.time,
          status: 'pending',
          notes: formData.notes,
          menu_name: selectedItems.map(i => `${i.name} x${i.quantity}`).join(', '),
          quantity: selectedItems.reduce((sum, i) => sum + i.quantity, 0)
        }]);
      } catch (err) {
        console.error("Gagal menyimpan pesanan:", err);
      }

      const itemsList = selectedItems.map(item => `- ${item.name} x ${item.quantity}`).join('\n');
      message = `🧾 *STRUK PEMESANAN - SATE KAMBING PAK PUNG* 🧾\n\n` +
        `👤 Nama: ${formData.name}\n` +
        `🛒 *PESANAN:*\n${itemsList}\n\n` +
        `💰 *TOTAL: Rp ${totalAmount.toLocaleString('id-ID')}*\n` +
        `⏰ Jam Ambil: ${formData.time}\n` +
        `⏳ Estimasi: ${estimation}\n` +
        `📝 Ket: ${formData.notes || '-'}\n\n` +
        (!isStoreOpen ? "_*Catatan: Toko saat ini tutup, pesanan akan diproses saat buka._" : "Mohon konfirmasi ketersediaannya.");
    } else {
      if (!formData.quickOrderText) {
        toast.error("Silakan isi detail pesanan cepat Anda!");
        return;
      }
      message = `⚡ *PESAN CEPAT - SATE KAMBING PAK PUNG* ⚡\n\n` +
        `👤 Nama: ${formData.name || 'Pelanggan'}\n` +
        `📝 *PESANAN:* \n${formData.quickOrderText}\n\n` +
        (formData.time ? `⏰ Jam Ambil: ${formData.time}\n` : "") +
        (!isStoreOpen ? "_*Catatan: Toko saat ini tutup, pesanan akan diproses saat buka._" : "Mohon konfirmasi pesanan saya.");
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-[#121212] w-full max-w-2xl rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShoppingCart className="text-amber-500 w-6 h-6" />
              Pesan Sekarang
            </h2>
            <p className="text-gray-400 text-sm">Pilih cara pemesanan yang Anda sukai</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="text-white w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex p-2 bg-white/5 mx-6 mt-6 rounded-2xl">
          <button 
            onClick={() => setOrderType('menu')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
              orderType === 'menu' ? "bg-amber-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
            )}
          >
            <ShoppingCart className="w-4 h-4" /> Pilih Menu
          </button>
          <button 
            onClick={() => setOrderType('quick')}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2",
              orderType === 'quick' ? "bg-amber-500 text-black shadow-lg" : "text-gray-400 hover:text-white"
            )}
          >
            <Zap className="w-4 h-4" /> Pesan Cepat
          </button>
        </div>

        <form onSubmit={handleWhatsAppOrder} className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isStoreOpen && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="text-amber-500 w-5 h-5 flex-shrink-0" />
              <p className="text-sm text-amber-200">
                <strong>Informasi:</strong> Toko saat ini sedang tutup. Anda tetap bisa memesan, dan kami akan memprosesnya segera setelah toko dibuka kembali (15:30).
              </p>
            </div>
          )}

          <div className="space-y-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Identitas</label>
            <input 
              type="text" 
              required
              placeholder="Masukkan Nama Anda..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {orderType === 'menu' ? (
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daftar Menu</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {menus.map(menu => {
                  const qty = formData.quantities[menu.id] || 0;
                  const isAvailable = menu.stock > 0;
                  return (
                    <div key={menu.id} className={cn(
                      "p-3 rounded-2xl border flex flex-col justify-between h-28 transition-all",
                      qty > 0 ? "bg-amber-500/10 border-amber-500/50" : "bg-white/5 border-white/10"
                    )}>
                      <div className="flex justify-between">
                        <span className="font-bold text-white text-sm">{menu.name}</span>
                        {!isAvailable && <span className="text-[10px] text-red-400 font-bold px-2 py-0.5 bg-red-400/10 rounded-full border border-red-400/20">HABIS</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Rp {menu.price.toLocaleString('id-ID')}</span>
                        <div className="flex items-center gap-3 bg-black/40 rounded-xl p-1">
                          <button type="button" onClick={() => updateQuantity(menu.id, -1)} className="p-1 hover:text-amber-500 text-gray-400"><Minus className="w-4 h-4" /></button>
                          <span className="text-sm font-bold text-white w-4 text-center">{qty}</span>
                          <button type="button" onClick={() => updateQuantity(menu.id, 1)} disabled={!isAvailable} className="p-1 hover:text-amber-500 text-gray-400 disabled:opacity-30"><Plus className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Detail Pesanan</label>
              <textarea 
                required={orderType === 'quick'}
                placeholder="Contoh: Sate kambing 3 porsi, tongseng 1 porsi, tanpa nasi..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-amber-500 h-32 resize-none"
                value={formData.quickOrderText}
                onChange={e => setFormData({...formData, quickOrderText: e.target.value})}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Jam Ambil</label>
              <input 
                type="time" 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={formData.time}
                onChange={e => setFormData({...formData, time: e.target.value})}
              />
            </div>
            {orderType === 'menu' && selectedCount > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Estimasi</label>
                <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 text-amber-500 font-bold flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" /> {estimation}
                </div>
              </div>
            )}
          </div>

          {orderType === 'menu' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Catatan (Porsi Besar, dll)</label>
              <input 
                type="text" 
                placeholder="Tambahkan catatan khusus..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-white focus:outline-none"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-[#1a1a1a]">
          {orderType === 'menu' && selectedCount > 0 && (
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total Pembayaran:</span>
              <span className="text-2xl font-black text-amber-500">Rp {totalAmount.toLocaleString('id-ID')}</span>
            </div>
          )}
          <button 
            type="submit"
            onClick={handleWhatsAppOrder}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <Send className="w-5 h-5" />
            Lanjutkan ke WhatsApp
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderModal;
