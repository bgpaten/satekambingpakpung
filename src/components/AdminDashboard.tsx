import React, { useState } from 'react';
import { useMenus } from '../hooks/useMenus';
import { useOrders } from '../hooks/useOrders';
import type { Order } from '../hooks/useOrders';
import { supabase } from '../lib/supabase';
import { Lock, LayoutDashboard, LogOut, Loader2, ClipboardList, Package, CheckCircle2, Circle, Clock, User, Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'framer-motion';

export function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'stok' | 'pesanan'>('pesanan');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  
  const { menus, loading: loadingMenus } = useMenus();
  const { orders, loading: loadingOrders } = useOrders();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '357911') {
      setIsLoggedIn(true);
    } else {
      alert('PIN salah!');
    }
  };

  const updateStock = async (id: string, newStock: number) => {
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('menus')
        .update({ stock: Math.max(0, newStock) })
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      console.error("Update failed", err);
      alert("Gagal update stok.");
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePrice = async (id: string, newPrice: number) => {
    const p = prompt("Masukkan harga baru:", newPrice.toString());
    if (p === null) return;
    const priceVal = parseInt(p);
    if (isNaN(priceVal)) return;
    try {
      setUpdatingId(id);
      const { error } = await supabase.from('menus').update({ price: priceVal }).eq('id', id);
      if (error) throw error;
    } catch (err) { console.error(err); } finally { setUpdatingId(null); }
  };

  const toggleOrderStatus = async (order: Order) => {
    try {
      setUpdatingId(order.id);
      const newStatus = order.status === 'pending' ? 'completed' : 'pending';
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);

      if (error) throw error;
    } catch (err) {
      console.error("Gagal update status pesanan", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Hapus data pesanan ini?")) return;
    try {
      await supabase.from('orders').delete().eq('id', id);
    } catch (err) { console.error(err); }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 rounded-2xl w-full max-w-md border-brand-accent/20">
          <div className="flex justify-center mb-6">
            <div className="bg-brand-accent/20 p-4 rounded-full"><Lock className="w-10 h-10 text-brand-accent" /></div>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6 text-white">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" autoFocus inputMode="numeric" className="w-full bg-brand-dark/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-brand-accent text-center tracking-[0.5em] text-2xl" placeholder="••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-brand-dark font-bold py-3 rounded-lg transition-all">Masuk ke Dashboard</button>
          </form>
          <p className="mt-6 text-center text-xs text-gray-500">Hint: 357911</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b border-white/10 pb-6">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="text-brand-accent w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Dashboard Penjual</h1>
              <p className="text-sm text-gray-400">Kelola menu dan pantau pesanan masuk.</p>
            </div>
          </div>
          
          <div className="flex bg-brand-dark-card p-1 rounded-xl border border-white/5">
            <button 
              onClick={() => setActiveTab('pesanan')}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-bold", activeTab === 'pesanan' ? "bg-brand-accent text-brand-dark shadow-lg" : "text-gray-400 hover:text-white")}
            >
              <ClipboardList className="w-4 h-4" />
              Pesanan ({orders.filter(o => o.status === 'pending').length})
            </button>
            <button 
              onClick={() => setActiveTab('stok')}
              className={cn("flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-bold", activeTab === 'stok' ? "bg-brand-accent text-brand-dark shadow-lg" : "text-gray-400 hover:text-white")}
            >
              <Package className="w-4 h-4" />
              Stok Menu
            </button>
          </div>

          <button onClick={() => setIsLoggedIn(false)} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all font-medium text-sm">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </header>

        <main>
          {activeTab === 'stok' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingMenus ? <div className="col-span-full py-20 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-brand-accent" /></div> : menus.map((item) => (
                <motion.div layout key={item.id} className={cn("bg-brand-dark-card border border-white/10 rounded-xl p-5 hover:border-brand-accent/30 transition-all relative overflow-hidden", item.stock === 0 && "opacity-80")}>
                  {updatingId === item.id && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center z-10"><Loader2 className="w-8 h-8 animate-spin text-brand-accent" /></div>}
                  <div className="flex gap-4 mb-4">
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-brand-accent text-sm font-semibold cursor-pointer" onClick={() => updatePrice(item.id, item.price)}>Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between text-sm text-gray-400"><span>Stok:</span><span className={cn("font-bold text-base", item.stock < 10 ? "text-orange-500" : "text-green-500")}>{item.stock} porsi</span></div>
                    <div className="flex gap-2">
                      <button onClick={() => updateStock(item.id, item.stock - 5)} className="flex-1 bg-white/5 py-2 rounded-lg border border-white/10">-5</button>
                      <button onClick={() => updateStock(item.id, item.stock - 1)} className="flex-1 bg-white/5 py-2 rounded-lg border border-white/10">-1</button>
                      <button onClick={() => updateStock(item.id, item.stock + 1)} className="flex-1 bg-brand-primary/20 text-green-400 py-2 rounded-lg border border-brand-primary/30">+1</button>
                    </div>
                    <button onClick={() => updateStock(item.id, item.stock === 0 ? 50 : 0)} className={cn("w-full mt-2 py-3 rounded-lg font-bold transition-all border", item.stock > 0 ? "bg-red-500/10 text-red-500 border-red-500/30" : "bg-green-500/10 text-green-500 border-green-500/30")}>
                      {item.stock > 0 ? "Set HABIS" : "Set TERSEDIA (50)"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold border-l-4 border-brand-accent pl-4">Pesanan Masuk</h3>
                <span className="text-xs text-gray-500 italic">* Khusus Gulai: Checklist jika sudah diambil</span>
              </div>
              
              {loadingOrders ? <Loader2 className="w-10 h-10 animate-spin text-brand-accent mx-auto my-20" /> : orders.length === 0 ? (
                <div className="text-center py-20 bg-brand-dark-card rounded-2xl border border-dashed border-white/10">
                  <p className="text-gray-500">Belum ada pesanan masuk.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o) => (
                    <motion.div 
                      key={o.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        "flex items-center gap-4 bg-brand-dark-card p-4 rounded-xl border transition-all",
                        o.status === 'completed' ? "border-green-500/20 opacity-60" : "border-white/5 hover:border-white/10"
                      )}
                    >
                      {/* Checkbox Logic - Specifically for Gulai but fits all */}
                      <button 
                        onClick={() => toggleOrderStatus(o)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0 border-2",
                          o.status === 'completed' 
                            ? "bg-green-500 border-green-500 text-brand-dark" 
                            : (o.items && o.items.some(i => i.name.toLowerCase().includes('gulai'))) || (o.menu_name?.toLowerCase().includes('gulai'))
                              ? "border-brand-accent text-brand-accent hover:bg-brand-accent/10" 
                              : "border-white/20 text-white/20 hover:border-white/40"
                        )}
                      >
                        {o.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
                      </button>

                        <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                          <div className="flex items-center gap-3">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-bold truncate">{o.customer_name}</span>
                          </div>
                          
                          <div className="flex items-center gap-3 md:col-span-2">
                            {o.items && o.items.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {o.items.map((item, idx) => (
                                  <div key={idx} className="bg-brand-primary/10 text-brand-primary px-2 py-1 rounded text-[10px] font-bold uppercase border border-brand-primary/20">
                                    {item.name} x{item.quantity}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className={cn("px-2 py-1 rounded text-xs font-bold uppercase", o.menu_name?.toLowerCase().includes('gulai') ? "bg-amber-500/20 text-amber-500" : "bg-brand-primary/20 text-brand-primary")}>
                                {o.menu_name || 'Menu Tidak Diketahui'} {o.quantity && `x${o.quantity}`}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-brand-accent text-sm font-bold justify-end">
                            <span>Rp {(o.total_price || 0).toLocaleString('id-ID')}</span>
                            <Clock className="w-4 h-4 text-gray-500 ml-2" />
                            <b className="text-white">{o.pickup_time}</b>
                          </div>
                        </div>

                      <button onClick={() => deleteOrder(o.id)} className="p-2 text-gray-600 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>

        <footer className="mt-16 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Sate Kambing Admin. Data tersinkronisasi otomatis.</p>
        </footer>
      </div>
    </div>
  );
}
