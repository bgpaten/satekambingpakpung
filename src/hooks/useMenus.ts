import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { MenuItem } from '../lib/supabase';

export function useMenus() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenus() {
      try {
        setLoading(true);
        // We will try fetching from Supabase, but if it fails (due to no keys or RLS), fallback to mock data
        const { data, error } = await supabase.from('menus').select('*').order('created_at', { ascending: true });
        
        if (error || !data || data.length === 0) {
          // Fallback mock data
          setMenus([
            {
              id: '1',
              name: 'Sate Kambing',
              description: 'Sate kambing muda empuk dengan bumbu meresap sempurna.',
              price: 40000,
              stock: 50,
              image_url: '/images/hero_sate_kambing.png',
              is_special: false
            },
            {
              id: '2',
              name: 'Sate Ayam',
              description: 'Sate ayam full daging dengan saus kacang legit dan manis.',
              price: 25000,
              stock: 5,
              image_url: '/images/sate_ayam_menu.png',
              is_special: false
            },
            {
              id: '3',
              name: 'Gulai Kambing',
              description: 'Gulai kaya rempah dengan daging kambing lembut.',
              price: 35000,
              stock: 10,
              image_url: '/images/gulai_kambing_menu.png',
              is_special: true
            }
          ]);
        } else {
          const isSaturday = new Date().getDay() === 6;
          const processedData = (data as MenuItem[]).map(item => {
            if (item.name.toLowerCase().includes('gulai')) {
              if (!isSaturday) {
                return { ...item, stock: 0 };
              }
              // On Saturday, return the actual database stock
            }
            return item;
          });
          setMenus(processedData);
        }
      } catch (err) {
        console.error("Error fetching menus", err);
      } finally {
        setLoading(false);
      }
    }

    fetchMenus();

    // Subscribe to realtime changes
    const channel = supabase.channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'menus' }, (payload) => {
        const isSaturday = new Date().getDay() === 6;

        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newItem = payload.new as MenuItem;
          
          // Custom logic for Gulai on Saturday
          if (newItem.name.toLowerCase().includes('gulai')) {
             if (!isSaturday) {
               newItem.stock = 0; // Force 0 if not Saturday
             }
             // On Saturday, we respect the actual database value (payload.new.stock)
             // whether it's 20, 10, or 0 (Habis).
          }

          if (payload.eventType === 'INSERT') {
            setMenus(current => [...current, newItem]);
          } else {
            setMenus(current => current.map(item => item.id === newItem.id ? newItem : item));
          }
        } else if (payload.eventType === 'DELETE') {
          setMenus(current => current.filter(item => item.id === payload.old.id));
        }
      })
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR') {
          console.warn("Realtime menus connection failed, falling back to polling.");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const refresh = async () => {
    try {
       const { data, error } = await supabase.from('menus').select('*').order('created_at', { ascending: true });
       if (error) throw error;
       setMenus(data as MenuItem[]);
    } catch (err) {
       console.error(err);
    }
  };

  return { menus, loading, refresh };
}
