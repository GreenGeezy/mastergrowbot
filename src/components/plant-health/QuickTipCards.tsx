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

  const handleShare = () => {
    const shareDialog = document.querySelector('[data-share-dialog]');
    if (shareDialog) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      shareDialog.dispatchEvent(event);
    }
  };

  const handleHistory = () => {
    const historyDialog = document.querySelector('[data-history-dialog]');
    if (historyDialog) {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      historyDialog.dispatchEvent(event);
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
      action: handleShare,
      buttonText: "Share Results"
    },
    {
      icon: History,
      title: "Analysis History",
      description: "Review past diagnoses and track your plant's health over time",
      action: handleHistory,
      buttonText: "View History"
    }
  ];

  return (
    <>
      {session && (
        <>
          <div data-share-dialog>
            <ShareResults analysisId="" imageUrls={[]} />
          </div>
          <div data-history-dialog>
            <AnalysisHistory userId={session.user.id} />
          </div>
        </>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {quickTips.map((tip, index) => (
          <Card
            key={index}
            className="bg-[#0F172A] border border-gray-800 hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10 h-[240px]"
          >
            <div
              className="p-6 cursor-pointer flex flex-col items-center text-center h-full"
              onClick={tip.action}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  tip.action?.();
                }
              }}
            >
              <div className="w-[60px] h-[60px] rounded-full bg-primary flex items-center justify-center mb-4 group-hover:shadow-md group-hover:shadow-primary/20 transition-all duration-300">
                <tip.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2 group-hover:text-primary/90 transition-colors duration-300">
                {tip.title}
              </h3>
              <p className="text-sm text-gray-400 mb-6 line-clamp-2 px-4 h-[40px]">
                {tip.description}
              </p>
              <button 
                className="w-[80%] bg-[#1E293B]/80 text-white border border-gray-800 hover:border-primary/50 rounded-lg py-2 px-4 transition-all duration-300 mt-auto group-hover:bg-[#1E293B] hover:shadow-sm hover:shadow-primary/20"
                onClick={(e) => {
                  e.stopPropagation();
                  if (tip.action) tip.action();
                }}
              >
                {tip.buttonText}
              </button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default QuickTipCards;