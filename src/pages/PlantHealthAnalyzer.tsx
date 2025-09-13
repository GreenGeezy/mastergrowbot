
import React, { useState } from 'react';
import { useSession } from '@supabase/auth-helpers-react';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import AnalysisActions from '@/components/plant-health/AnalysisActions';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { getAnalyzePlantFunctionName } from '@/utils/analyzePlantConfig';
import { normalizeAnalysisResult } from '@/utils/normalizeAnalysisResult';

// Helper to normalize analysis payload from backend response
const normalizeAnalysisPayload = (data: any) => {
  console.log('Normalizer input data keys:', Object.keys(data || {}));
  
  // Branch 1: Use data.result if available (preferred from unified backend)
  if (data?.result) {
    console.log('Normalizer branch used: result');
    const r = data.result;
    const diagnosis = data.diagnosis || r.summary || 'Analysis completed';
    console.log('Diagnosis preview:', diagnosis.substring(0, 120));
    
    return {
      diagnosis,
      confidence_level: r.confidence > 1 ? r.confidence / 100 : (r.confidence || 0.95),
      detailed_analysis: {
        growth_stage: r.growthStage || 'Not specified',
        health_score: r.healthScore || null,
        specific_issues: Array.isArray(r.specificIssues) ? r.specificIssues.join('; ') : '',
        environmental_factors: Array.isArray(r.environmentalFindings) ? r.environmentalFindings.join('; ') : ''
      },
      recommended_actions: Array.isArray(r.recommendedActions) ? r.recommendedActions : []
    };
  }
  
  // Branch 2: Use data.analysis if already structured
  if (data?.analysis && typeof data.analysis === 'object' && data.analysis.detailed_analysis) {
    console.log('Normalizer branch used: structured');
    const diagnosis = data.diagnosis || data.analysis.diagnosis || 'Analysis completed';
    console.log('Diagnosis preview:', diagnosis.substring(0, 120));
    
    return {
      ...data.analysis,
      diagnosis,
      confidence_level: data.analysis.confidence_level > 1 ? data.analysis.confidence_level / 100 : (data.analysis.confidence_level || 0.95)
    };
  }
  
  // Branch 3: Parse from text (fallback)
  console.log('Normalizer branch used: text');
  const text = data.diagnosis || data.result?.summary || data.analysis?.summary || 
               (typeof data.analysis === 'string' ? data.analysis : JSON.stringify(data.analysis || {}));
  console.log('Text to parse preview:', text.substring(0, 120));
  
  const normalized = normalizeAnalysisResult({ diagnosis: text, confidence: 0.95 });
  return {
    diagnosis: normalized.summary,
    confidence_level: normalized.confidence,
    detailed_analysis: {
      growth_stage: normalized.growthStage,
      health_score: normalized.healthScore,
      specific_issues: normalized.specificIssues.join('; '),
      environmental_factors: normalized.environmentalFindings.join('; ')
    },
    recommended_actions: normalized.recommendedActions
  };
};

const PlantHealthAnalyzer = () => {
  const session = useSession();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraFile, setCameraFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ current: number, total: number } | null>(null);
  const [analysisStartTime, setAnalysisStartTime] = useState<number | null>(null);
  const [profileUsed, setProfileUsed] = useState<boolean>(false);

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
    setAnalysisStartTime(Date.now());
    setUploadProgress({ current: 0, total: selectedFiles.length });
    
    try {
      console.log('Starting analysis...');
      
      // Upload images to Supabase storage
      const imageUrls = await Promise.all(
        selectedFiles.map(async (file, index) => {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
          const fileName = `${Date.now()}-${safeName}`;
          const { data, error } = await supabase.storage
            .from('plant-images')
            .upload(fileName, file);

          if (error) {
            console.error('Image upload error:', error);
            throw error;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('plant-images')
            .getPublicUrl(fileName);
            
          // Update progress
          setUploadProgress(prev => {
            if (!prev) return { current: index + 1, total: selectedFiles.length };
            return { ...prev, current: index + 1 };
          });

          return publicUrl;
        })
      );

      console.log('Images uploaded successfully:', imageUrls);
      
      // Show interim toast for user feedback
      const elapsedUploadTime = ((Date.now() - (analysisStartTime || 0)) / 1000).toFixed(1);
      toast({
        title: "Images Uploaded Successfully",
        description: `Beginning AI analysis now (uploaded in ${elapsedUploadTime}s)`,
      });

      // Call the analyze function with user ID for personalization
      const functionName = getAnalyzePlantFunctionName();
      const { data, error } = await supabase.functions.invoke(functionName, {
        body: { 
          imageUrls,
          userId: session?.user?.id 
        },
      });

      if (error) {
        console.error('Function invocation error:', error);
        throw error;
      }

      console.log('Analysis data received:', data);

      // Development debugging logs
      if (import.meta.env.MODE !== 'production') {
        console.log('RAW_RESULT_KEYS', Object.keys(data || {}));
      }

      // Use the new normalizer that prioritizes data.result
      const structuredResult = normalizeAnalysisPayload(data);
      
      // Development debugging logs
      if (import.meta.env.MODE !== 'production') {
        console.log('STRUCTURED_RESULT_KEYS', Object.keys(structuredResult || {}));
      }
      
      // Track if profile data was used
      setProfileUsed(!!data?.profileUsed);

      // Save analysis results to the database
      const { data: savedAnalysis, error: saveError } = await supabase
        .from('plant_analyses')
        .insert({
          user_id: session?.user?.id,
          image_url: imageUrls[0], // Keep first image as primary
          image_urls: imageUrls, // Store all images
          diagnosis: structuredResult.diagnosis,
          confidence_level: structuredResult.confidence_level,
          detailed_analysis: structuredResult.detailed_analysis,
          recommended_actions: structuredResult.recommended_actions,
        })
        .select()
        .single();

      if (saveError) {
        console.error('Error saving analysis:', saveError);
        throw new Error('Failed to save analysis results');
      }

      console.log('Analysis saved to database:', savedAnalysis);
      
      // Set analysis result from structured data with database ID for sharing
      const displayResult = {
        ...structuredResult,
        // Merge essential database fields for sharing functionality
        id: savedAnalysis.id,
        image_urls: imageUrls,
        image_url: imageUrls[0],
        user_id: session?.user?.id
      };
      
      setAnalysisResult(displayResult);
      
      // Calculate total time elapsed
      const totalTimeElapsed = ((Date.now() - (analysisStartTime || 0)) / 1000).toFixed(1);
      
      toast({
        title: "Analysis Complete",
        description: `Your plant health analysis is ready to view (completed in ${totalTimeElapsed}s)${
          data?.profileUsed ? " - Personalized to your growing method" : ""
        }`,
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
      setUploadProgress(null);
      setAnalysisStartTime(null);
    }
  };

  // Calculate upload progress percentage
  const uploadProgressPercentage = uploadProgress 
    ? Math.round((uploadProgress.current / uploadProgress.total) * 100) 
    : 0;

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
            {uploadProgress && uploadProgress.current < uploadProgress.total ? (
              <div className="w-full max-w-xs space-y-2">
                <p className="text-white text-lg">Uploading images... ({uploadProgressPercentage}%)</p>
                <div className="w-full bg-gray-700 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${uploadProgressPercentage}%` }}></div>
                </div>
              </div>
            ) : (
              <p className="text-white text-lg">
                Analyzing your plant{session?.user?.id ? " with your growing preferences" : ""}...
              </p>
            )}
            {analysisStartTime && (
              <p className="text-gray-400 text-sm">
                Time elapsed: {Math.floor((Date.now() - analysisStartTime) / 1000)}s
              </p>
            )}
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <>
            <AnalysisResults analysisResult={analysisResult} />
            {profileUsed && (
              <div className="bg-green-900/30 border border-green-700 rounded-md p-3 text-sm text-green-200">
                <p className="font-medium">Personalized Analysis</p>
                <p>This analysis was tailored to your growing method and preferences.</p>
              </div>
            )}
          </>
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
          analysisResult={analysisResult}
        />
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;
