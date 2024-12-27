import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import AnalysisActions from '@/components/plant-health/AnalysisActions';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const PlantHealthAnalyzer = () => {
  const session = useSession();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraFile, setCameraFile] = useState<File | null>(null);

  const handleImagesSelected = async (files: File[]) => {
    setSelectedFiles(files);
    // Only auto-analyze if it's not from camera
    if (files.length > 0 && !cameraFile) {
      await handleAnalyze();
    }
  };

  const handleTakePhoto = () => {
    const imageDropzone = document.querySelector('[data-image-dropzone]');
    if (imageDropzone) {
      const event = new CustomEvent('start-camera');
      imageDropzone.dispatchEvent(event);
    }
  };

  const handleCameraCapture = (file: File) => {
    setCameraFile(file);
    setSelectedFiles([file]);
    setShowConfirmation(true);
  };

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "No images selected",
        description: "Please select or capture at least one image to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Upload images to Supabase storage
      const imageUrls = await Promise.all(
        selectedFiles.map(async (file) => {
          const fileName = `${Date.now()}-${file.name}`;
          const { data, error } = await supabase.storage
            .from('plant-images')
            .upload(fileName, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('plant-images')
            .getPublicUrl(fileName);

          return publicUrl;
        })
      );

      // Call the analyze-plant function
      const { data, error } = await supabase.functions.invoke('analyze-plant', {
        body: { imageUrls },
      });

      if (error) throw error;

      setAnalysisResult(data.analysis);
      toast({
        title: "Analysis Complete",
        description: "Your plant health analysis is ready to view.",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Failed to analyze plant health. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setShowConfirmation(false);
      setCameraFile(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <PlantHealthHeader />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <ImageDropzone
          onImagesSelected={handleImagesSelected}
          selectedFiles={selectedFiles}
          onCameraCapture={handleCameraCapture}
        />

        {isAnalyzing && (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-white text-lg">Analyzing your plant...</p>
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <AnalysisResults analysisResult={analysisResult} />
        )}

        <AnalysisActions
          session={session}
          onTakePhoto={handleTakePhoto}
          onAnalyze={handleAnalyze}
          showConfirmation={showConfirmation}
          onConfirmationCancel={() => {
            setShowConfirmation(false);
            setCameraFile(null);
            setSelectedFiles([]);
          }}
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