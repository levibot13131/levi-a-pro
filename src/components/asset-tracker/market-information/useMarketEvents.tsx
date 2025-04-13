
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { MarketEvent } from '@/types/marketInformation';
import { getUpcomingMarketEvents, setEventReminder } from '@/services/marketInformationService';

export const useMarketEvents = (selectedTimeRange: string, autoRefresh: boolean) => {
  const { data: events, isLoading: eventsLoading, refetch } = useQuery({
    queryKey: ['marketEvents', selectedTimeRange],
    queryFn: async () => {
      // Filter events based on time range if needed
      const allEvents = getUpcomingMarketEvents();
      
      if (!selectedTimeRange) return allEvents;
      
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + parseInt(selectedTimeRange));
      
      return allEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= today && eventDate <= endDate;
      });
    },
    refetchInterval: autoRefresh ? 60000 : false, // Auto refresh every minute if enabled
  });

  useEffect(() => {
    if (!autoRefresh) return;
    
    const refreshInterval = setInterval(() => {
      refetch();
    }, 60000); // Refresh every minute
    
    return () => clearInterval(refreshInterval);
  }, [autoRefresh, refetch]);

  const handleSetReminder = (eventId: string, reminder: boolean) => {
    setEventReminder(eventId, reminder);
    toast.success(`${reminder ? 'הגדרת' : 'ביטלת'} תזכורת לאירוע`);
  };

  const handleRefresh = () => {
    refetch();
    toast.success('נתונים התעדכנו בהצלחה');
  };

  return {
    events,
    eventsLoading,
    handleSetReminder,
    handleRefresh
  };
};
