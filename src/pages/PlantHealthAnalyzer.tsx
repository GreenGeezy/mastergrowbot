import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import AnalysisActions from '@/components/plant-health/AnalysisActions';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import AnalysisHistory from '@/components/plant-health/AnalysisHistory';
import AnalysisConfirmationDialog from '@/components/plant-health/AnalysisConfirmationDialog';
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
    if (selectedFiles.length === 0) return;

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

      // Save analysis results to the database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('plant_analyses')
        .insert({
          user_id: session?.user?.id,
          image_url: imageUrls[0], // Keep first image as primary
          image_urls: imageUrls, // Store all images
          diagnosis: data.analysis.diagnosis,
          confidence_level: data.analysis.confidence_level,
          detailed_analysis: data.analysis.detailed_analysis,
          recommended_actions: data.analysis.recommended_actions,
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving analysis:', saveError);
        throw new Error('Failed to save analysis results');
      }

      setAnalysisResult(savedAnalysis);
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

        <div className="flex flex-col space-y-4">
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
            analysisResult={analysisResult}
          />
          
          {session && (
            <AnalysisHistory userId={session.user.id} />
          )}
        </div>

        <AnalysisConfirmationDialog
          isOpen={showConfirmation}
          onConfirm={() => {
            setShowConfirmation(false);
            handleAnalyze();
          }}
          onCancel={() => {
            setShowConfirmation(false);
            setCameraFile(null);
            setSelectedFiles([]);
          }}
        />
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;