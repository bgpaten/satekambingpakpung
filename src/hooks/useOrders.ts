import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export type Order = {
  id: string;
  customer_name: string;
  menu_id?: string;
  menu_name?: string;
  quantity?: number;
  items?: OrderItem[];
  total_price?: number;
  pickup_time: string;
  status: 'pending' | 'completed';
  notes?: string;
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setOrders(data as Order[]);
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();

    // Realtime subscription
    const channel = supabase.channel('order-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setOrders(current => [payload.new as Order, ...current]);
        } else if (payload.eventType === 'UPDATE') {
          setOrders(current => current.map(o => o.id === payload.new.id ? payload.new as Order : o));
        } else if (payload.eventType === 'DELETE') {
          setOrders(current => current.filter(o => o.id === payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { orders, loading };
}
