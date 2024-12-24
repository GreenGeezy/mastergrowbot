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
  buttonText?: string;
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
      action: handleTakePhoto,
      buttonText: "Take Photo"
    },
    {
      icon: Share2,
      title: "Share Results",
      description: "Share your analysis via email, social media, or copy a direct link",
      component: session && <ShareResults analysisId="" imageUrls={[]} />,
      buttonText: "Share Results"
    },
    {
      icon: History,
      title: "Analysis History",
      description: "Review past diagnoses and track your plant's health over time",
      dialog: session && <AnalysisHistory userId={session.user.id} />,
      buttonText: "View Analysis History"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {quickTips.map((tip, index) => (
        <Card
          key={index}
          className="bg-[#111827] border border-gray-800 hover:border-primary/50 transition-all duration-300"
        >
          {tip.component ? (
            tip.component
          ) : (
            <div
              className="p-8 cursor-pointer flex flex-col items-center text-center"
              onClick={tip.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  tip.action?.();
                }
              }}
            >
              <div className="rounded-full bg-[#2D5A27] p-4 mb-6">
                <tip.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-medium text-lg mb-3">{tip.title}</h3>
              <p className="text-gray-400 text-sm mb-6">{tip.description}</p>
              {(tip.dialog || tip.buttonText) && (
                <button 
                  className="w-full bg-transparent text-white border border-gray-800 hover:border-primary/50 rounded-lg py-2.5 px-4 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (tip.action) tip.action();
                  }}
                >
                  {tip.buttonText}
                </button>
              )}
              {tip.dialog}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};

export default QuickTipCards;