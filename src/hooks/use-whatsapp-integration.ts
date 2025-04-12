
import { useState, useEffect } from 'react';
import { AlertDestination } from '@/services/tradingView/alerts/types';

export const useWhatsAppIntegration = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [connectionCode, setConnectionCode] = useState<string>('');
  const [isPending, setIsPending] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const connectWhatsApp = async (phone: string) => {
    setIsPending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate random code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setConnectionCode(code);
      setPhoneNumber(phone);
      
      // Simulate QR code generation
      setQrCode('https://via.placeholder.com/200x200.png?text=WhatsApp+QR');
      
      setIsPending(false);
      return { success: true, code };
    } catch (error) {
      setIsPending(false);
      return { success: false, error: 'Failed to connect' };
    }
  };

  const verifyConnection = async (code: string) => {
    setIsPending(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (code === connectionCode) {
        setIsConnected(true);
        localStorage.setItem('whatsapp_connected', 'true');
        localStorage.setItem('whatsapp_phone', phoneNumber);
        setIsPending(false);
        return { success: true };
      }
      
      setIsPending(false);
      return { success: false, error: 'Invalid code' };
    } catch (error) {
      setIsPending(false);
      return { success: false, error: 'Verification failed' };
    }
  };

  const disconnectWhatsApp = () => {
    setIsConnected(false);
    setPhoneNumber('');
    setConnectionCode('');
    setQrCode(null);
    localStorage.removeItem('whatsapp_connected');
    localStorage.removeItem('whatsapp_phone');
    return { success: true };
  };

  const getWhatsAppDestination = (): AlertDestination | null => {
    if (!isConnected) return null;
    
    return {
      id: 'whatsapp-default',
      name: 'WhatsApp Alerts',
      type: 'whatsapp',
      active: true,
      config: {
        phone: phoneNumber,
        template: 'חדש: {{type}} סיגנל עבור {{symbol}} במחיר {{price}}. {{message}}'
      }
    };
  };

  // Initialize from localStorage on mount
  useEffect(() => {
    const connected = localStorage.getItem('whatsapp_connected') === 'true';
    const phone = localStorage.getItem('whatsapp_phone');
    
    if (connected && phone) {
      setIsConnected(connected);
      setPhoneNumber(phone);
    }
  }, []);

  return {
    isConnected,
    phoneNumber,
    isPending,
    qrCode,
    connectWhatsApp,
    verifyConnection,
    disconnectWhatsApp,
    getWhatsAppDestination
  };
};

export default useWhatsAppIntegration;
