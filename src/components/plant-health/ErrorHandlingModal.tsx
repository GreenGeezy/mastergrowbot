import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Camera, RefreshCw, X } from 'lucide-react';

interface ErrorHandlingModalProps {
  isVisible: boolean;
  errorType: 'blurry' | 'upload' | 'analysis' | 'network' | null;
  errorMessage?: string;
  onRetake: () => void;
  onRetry: () => void;
  onCancel: () => void;
}

const ErrorHandlingModal = ({ 
  isVisible, 
  errorType, 
  errorMessage, 
  onRetake, 
  onRetry, 
  onCancel 
}: ErrorHandlingModalProps) => {
  if (!isVisible || !errorType) return null;

  const getErrorContent = () => {
    switch (errorType) {
      case 'blurry':
        return {
          icon: <Camera className="w-12 h-12 text-yellow-400" />,
          title: 'Image Quality Issue',
          description: 'The uploaded image appears to be blurry or unclear. For the best analysis results, please retake the photo with better lighting and focus.',
          primaryAction: { label: 'Retake Photo', action: onRetake, variant: 'default' as const },
          secondaryAction: { label: 'Try Anyway', action: onRetry, variant: 'outline' as const }
        };
      
      case 'upload':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
          title: 'Upload Failed',
          description: 'There was a problem uploading your image. Please check your internet connection and try again.',
          primaryAction: { label: 'Try Again', action: onRetry, variant: 'default' as const },
          secondaryAction: { label: 'Cancel', action: onCancel, variant: 'outline' as const }
        };
      
      case 'analysis':
        return {
          icon: <RefreshCw className="w-12 h-12 text-orange-400" />,
          title: 'Analysis Error',
          description: errorMessage || 'Our AI analysis encountered an issue. This is usually temporary - please try again in a moment.',
          primaryAction: { label: 'Retry Analysis', action: onRetry, variant: 'default' as const },
          secondaryAction: { label: 'Cancel', action: onCancel, variant: 'outline' as const }
        };
      
      case 'network':
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
          title: 'Connection Issue',
          description: 'Unable to connect to our servers. Please check your internet connection and try again.',
          primaryAction: { label: 'Retry', action: onRetry, variant: 'default' as const },
          secondaryAction: { label: 'Cancel', action: onCancel, variant: 'outline' as const }
        };
      
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-400" />,
          title: 'Something went wrong',
          description: errorMessage || 'An unexpected error occurred. Please try again.',
          primaryAction: { label: 'Try Again', action: onRetry, variant: 'default' as const },
          secondaryAction: { label: 'Cancel', action: onCancel, variant: 'outline' as const }
        };
    }
  };

  const content = getErrorContent();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-4 bg-gradient-to-br from-gray-900/95 to-gray-800/95 border border-gray-700/50 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">{content.title}</h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="text-gray-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-8 text-center space-y-6">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-gray-800/50">
              {content.icon}
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <p className="text-gray-300 text-base leading-relaxed">
              {content.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={content.primaryAction.action}
              variant={content.primaryAction.variant}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3"
            >
              {content.primaryAction.label}
            </Button>
            
            <Button
              onClick={content.secondaryAction.action}
              variant={content.secondaryAction.variant}
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700/50"
            >
              {content.secondaryAction.label}
            </Button>
          </div>
        </div>

        {/* Tips Section for Blurry Images */}
        {errorType === 'blurry' && (
          <div className="p-4 border-t border-gray-700/50 bg-gray-900/50">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Tips for better photos:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Ensure good lighting (natural light works best)</li>
              <li>• Hold camera steady and focus on the plant</li>
              <li>• Get close enough to show details clearly</li>
              <li>• Avoid shadows covering the plant</li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ErrorHandlingModal;