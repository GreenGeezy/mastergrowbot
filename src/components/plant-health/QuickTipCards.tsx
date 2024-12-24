import React from 'react';
import { Card } from '@/components/ui/card';
import { Camera, Share2, History } from 'lucide-react';
import AnalysisHistory from './AnalysisHistory';
import ShareResults from './ShareResults';
import { useSession } from '@supabase/auth-helpers-react';

interface QuickTip {
  icon: React.ElementType;
  title: string;
  description: string;
  action?: () => void;
  dialog?: React.ReactNode;
  component?: React.ReactNode;
}

const QuickTipCards = () => {
  const session = useSession();

  const handleTakePhoto = () => {
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      const imageDropzone = document.querySelector('[data-image-dropzone]');
      if (imageDropzone) {
        const event = new CustomEvent('start-camera');
        imageDropzone.dispatchEvent(event);
      }
    }
  };

  const quickTips: QuickTip[] = [
    {
      icon: Camera,
      title: "Take Photo",
      description: "Upload clear, detailed photos of any concerning areas on your plant",
      action: handleTakePhoto
    },
    {
      icon: Share2,
      title: "Share Results",
      description: "Share your analysis via email, social media, or copy a direct link",
      component: session && <ShareResults analysisId="" imageUrls={[]} /> // These props will be populated when there's an active analysis
    },
    {
      icon: History,
      title: "Analysis History",
      description: "Review past diagnoses and track your plant's health over time",
      dialog: session && <AnalysisHistory userId={session.user.id} />
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {quickTips.map((tip, index) => (
        <Card
          key={index}
          className="backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:border-primary/50 transition-all duration-300"
        >
          {tip.component ? (
            tip.component
          ) : (
            <div
              className="p-6 cursor-pointer"
              onClick={tip.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  tip.action?.();
                }
              }}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                  <tip.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium">{tip.title}</h3>
                <p className="text-gray-400 text-sm">{tip.description}</p>
                {tip.dialog}
              </div>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default QuickTipCards;