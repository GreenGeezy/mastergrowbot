import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AnalysisHistoryCard from './AnalysisHistoryCard';

interface AnalysisHistoryProps {
  userId: string;
}

const AnalysisHistory = ({ userId }: AnalysisHistoryProps) => {
  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ['plantAnalyses', userId],
    queryFn: async () => {
      console.log('Fetching analyses for user:', userId);
      const { data, error } = await supabase
        .from('plant_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching analyses:', error);
        throw error;
      }
      
      console.log('Fetched analyses:', data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error loading analysis history. Please try again later.</p>
      </div>
    );
  }

  if (!analyses || analyses.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-400">No plant analyses found. Upload some images to get started!</p>
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          View Analysis History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[80vh]">
        <DialogHeader>
          <DialogTitle>Plant Health Analysis History</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <AnalysisHistoryCard key={analysis.id} analysis={analysis} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisHistory;