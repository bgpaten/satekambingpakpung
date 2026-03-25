import { useState, useEffect } from 'react';

export function useStoreStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Time checking: 16:00 to 22:30
      // To float: hour + minute/60
      const currentTimeStr = currentHour + currentMinute / 60;
      const openTime = 15.5;    // 15:30
      const closeTime = 22.5;   // 22:30

      if (currentTimeStr < openTime) {
        setIsOpen(false);
        setStatusText('Belum Buka (Buka 15:30)');
      } else if (currentTimeStr >= closeTime) {
        setIsOpen(false);
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
  }, []);

  return { isOpen, statusText };
}
