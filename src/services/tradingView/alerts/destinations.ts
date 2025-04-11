
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { AlertDestination, LOCAL_STORAGE_KEY, getDestinationTypeName } from './types';

// Get defined alert destinations
export const getAlertDestinations = (): AlertDestination[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading alert destinations:', error);
  }
  
  // Default destinations
  const defaultDestinations: AlertDestination[] = [
    {
      id: uuidv4(),
      name: '{"botToken":"","chatId":""}',
      type: 'telegram',
      active: false
    },
    {
      id: uuidv4(),
      name: '',
      type: 'whatsapp',
      active: false
    }
  ];
  
  // Save default destinations
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDestinations));
  
  return defaultDestinations;
};

// Save alert destinations
export const saveAlertDestinations = (destinations: AlertDestination[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(destinations));
};

// Add new alert destination
export const addAlertDestination = (destination: Omit<AlertDestination, 'id'>): void => {
  const destinations = getAlertDestinations();
  const newDestination = {
    ...destination,
    id: uuidv4()
  };
  
  destinations.push(newDestination);
  saveAlertDestinations(destinations);
  
  toast.success('יעד התראות חדש נוסף', {
    description: `יעד מסוג ${getDestinationTypeName(destination.type)} נוסף בהצלחה`
  });
};

// Update alert destination
export const updateAlertDestination = (type: AlertDestination['type'], updates: Partial<AlertDestination>): void => {
  const destinations = getAlertDestinations();
  const index = destinations.findIndex(d => d.type === type);
  
  if (index !== -1) {
    destinations[index] = { ...destinations[index], ...updates };
    saveAlertDestinations(destinations);
    
    toast.success('יעד התראות עודכן', {
      description: `יעד ${getDestinationTypeName(type)} עודכן בהצלחה`
    });
  } else {
    // If destination doesn't exist, add it
    addAlertDestination({
      name: updates.name || type,
      type,
      active: updates.active || false
    });
  }
};

// Delete alert destination
export const deleteAlertDestination = (id: string): void => {
  const destinations = getAlertDestinations();
  const filtered = destinations.filter(d => d.id !== id);
  
  if (filtered.length !== destinations.length) {
    saveAlertDestinations(filtered);
    
    toast.success('יעד התראות נמחק', {
      description: 'יעד ההתראות נמחק בהצלחה'
    });
  }
};
