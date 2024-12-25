import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import { Card } from '@/components/ui/card';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import AnalysisActions from '@/components/plant-health/AnalysisActions';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';

const PlantHealthAnalyzer = () => {
  const session = useSession();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleImagesSelected = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleTakePhoto = () => {
    const imageDropzone = document.querySelector('[data-image-dropzone]');
    if (imageDropzone) {
      const event = new CustomEvent('start-camera');
      imageDropzone.dispatchEvent(event);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Analysis logic here
    setIsAnalyzing(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PlantHealthHeader />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <ImageDropzone
          onImagesSelected={handleImagesSelected}
          selectedFiles={selectedFiles}
        />

        {analysisResult && (
          <AnalysisResults analysisResult={analysisResult} />
        )}

        <AnalysisActions
          session={session}
          onTakePhoto={handleTakePhoto}
          onAnalyze={handleAnalyze}
          showConfirmation={showConfirmation}
          onConfirmationCancel={() => setShowConfirmation(false)}
          onConfirmationConfirm={() => {
            setShowConfirmation(false);
            handleAnalyze();
          }}
        />
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;