
import React, { useState, useCallback, useMemo } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import AnalysisActions from '@/components/plant-health/AnalysisActions';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function PlantHealthAnalyzer() {
  const session = useSession();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraFile, setCameraFile] = useState<File | null>(null);

  const validateFile = useCallback((file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Please upload JPEG, PNG, or WebP images.');
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File too large. Maximum size is 5MB.');
    }
    return true;
  }, []);

  const uploadImage = useCallback(async (file: File) => {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9-.]/g, '')}`;
    const { data, error } = await supabase.storage
      .from('plant-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    return supabase.storage
      .from('plant-images')
      .getPublicUrl(fileName).data.publicUrl;
  }, []);

  const handleImagesSelected = useCallback(async (files: File[]) => {
    try {
      const validFiles = files.filter(validateFile);
      setSelectedFiles(validFiles);
      if (validFiles.length > 0 && !cameraFile) {
        handleAnalyze(validFiles);
      }
    } catch (error: any) {
      toast({
        title: "File Error",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [cameraFile, toast, validateFile]);

  const handleTakePhoto = useCallback(() => {
    const imageDropzone = document.querySelector('[data-image-dropzone]');
    if (imageDropzone) {
      imageDropzone.dispatchEvent(new CustomEvent('start-camera'));
    }
  }, []);

  const handleCameraCapture = useCallback((file: File) => {
    setCameraFile(file);
    setSelectedFiles([file]);
    setShowConfirmation(true);
  }, []);

  const handleAnalyze = useCallback(async (filesToAnalyze?: File[]) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to analyze plants.",
        variant: "destructive",
      });
      return;
    }

    const files = filesToAnalyze || selectedFiles;
    if (files.length === 0) return;

    setIsAnalyzing(true);
    try {
      // Upload images in parallel with optimized error handling
      const uploadPromises = files.map(file => uploadImage(file));
      const imageUrls = await Promise.all(uploadPromises);

      // Analyze plant with optimized edge function
      const { data, error } = await supabase.functions.invoke('analyze-plant', {
        body: { imageUrls },
        headers: { 
          'x-user-id': session.user.id,
          'Authorization': `Bearer ${session.access_token}`
        }
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
  }, [selectedFiles, session, toast, uploadImage]);

  const handleConfirmationCancel = useCallback(() => {
    setShowConfirmation(false);
    setCameraFile(null);
    setSelectedFiles([]);
  }, []);

  const handleConfirmationConfirm = useCallback(() => {
    setShowConfirmation(false);
    handleAnalyze();
  }, [handleAnalyze]);

  const renderContent = useMemo(() => (
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
        onAnalyze={() => handleAnalyze()}
        showConfirmation={showConfirmation}
        onConfirmationCancel={handleConfirmationCancel}
        onConfirmationConfirm={handleConfirmationConfirm}
        analysisResult={analysisResult}
      />
    </div>
  ), [
    selectedFiles,
    isAnalyzing,
    analysisResult,
    session,
    showConfirmation,
    handleImagesSelected,
    handleCameraCapture,
    handleTakePhoto,
    handleAnalyze,
    handleConfirmationCancel,
    handleConfirmationConfirm
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <PlantHealthHeader />
      {renderContent}
    </div>
  );
}
