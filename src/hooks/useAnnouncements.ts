import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export interface Announcement {
  id: string;
  type: 'holiday' | 'event';
  title: string;
  description: string;
  end_time: string | null;
  is_active: boolean;
  created_at: string;
}

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn("Failed to fetch announcements. Is the table created?", error);
        setAnnouncements([]);
      } else {
        // Filter out expired announcements locally just in case
        const valid = (data as Announcement[]).filter(ann => {
          if (ann.end_time) {
             return new Date(ann.end_time).getTime() > Date.now();
          }
          return true;
        });
        setAnnouncements(valid);
      }
    } catch (err) {
      console.error("Error fetching announcements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();

    const channel = supabase.channel('announcements-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
        fetchAnnouncements();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { announcements, loading, refresh: fetchAnnouncements };
}
