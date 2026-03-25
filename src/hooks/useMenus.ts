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
          setMenus(data as MenuItem[]);
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
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'menus' }, (payload) => {
        setMenus(current => current.map(item => item.id === payload.new.id ? payload.new as MenuItem : item));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { menus, loading };
}
