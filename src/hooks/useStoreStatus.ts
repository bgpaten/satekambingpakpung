import { useState, useEffect } from 'react';
import { useAnnouncements } from './useAnnouncements';

export function useStoreStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState('');
  const { announcements } = useAnnouncements();

  useEffect(() => {
    const checkStatus = () => {
      // Check if there is an active holiday announcement
      const holiday = announcements.find(a => a.type === 'holiday' && a.is_active);
      if (holiday) {
        setIsOpen(false);
        setStatusText('Toko Libur');
        return;
      }

      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Time checking: 16:00 to 22:30
      // To float: hour + minute/60
      const currentTimeStr = currentHour + currentMinute / 60;
      const openTime = 15.5;    // 15:30
      const closeTime = 22.5;   // 22:30

      if (currentTimeStr < openTime) {
        setIsOpen(false); // Changed to false based on logical opening
        setStatusText('Tutup (Buka 15:30)');
      } else if (currentTimeStr >= closeTime) {
        setIsOpen(false); // Changed to false based on logical opening
        setStatusText('Sudah Tutup');
      } else {
        setIsOpen(true);
        setStatusText('Buka Sekarang');
      }
    };

    checkStatus();
    // Re-check every minute
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, [announcements]);

  return { isOpen, statusText };
}
