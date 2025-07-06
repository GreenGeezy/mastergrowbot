
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CameraCapture from '@/components/plant-health/CameraCapture';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisActions from '@/components/plant-health/AnalysisActions';
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

const PlantHealthAnalyzer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleImagesSelected = useCallback((files: File[]) => {
    setSelectedFiles(files);
  }, []);

  const handleCameraCapture = useCallback((file: File) => {
    setSelectedFiles(prev => [...prev, file]);
    setShowCamera(false);
  }, []);

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select or capture images first.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // Upload images to storage
      const imageUrls = [];
      
      for (const file of selectedFiles) {
        const fileName = `plant-analysis-${Date.now()}-${Math.random().toString(36).substring(7)}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
          .from('plant-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('plant-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      // Call the analyze-plant edge function
      const { data, error } = await supabase.functions.invoke('analyze-plant', {
        body: { 
          imageUrls,
          userId: session?.user?.id 
        }
      });

      if (error) throw error;

      setAnalysisResult(data.analysis || "Analysis completed successfully!");
      toast.success("Plant analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisResult("Analysis failed. Please try again.");
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <PlantHealthHeader />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <section className="mb-8">
          <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Capture or Upload Plant Images</CardTitle>
              <CardDescription className="text-center">
                Take photos or upload images from your device for AI-powered plant health analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!showCamera ? (
                <ImageDropzone
                  onImagesSelected={handleImagesSelected}
                  selectedFiles={selectedFiles}
                  maxFiles={3}
                  onCameraCapture={handleCameraCapture}
                />
              ) : (
                <CameraCapture
                  onPhotoCapture={handleCameraCapture}
                  onClose={() => setShowCamera(false)}
                />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleTakePhoto}
                disabled={isLoading}
                className="flex-1 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold text-lg px-6 py-4 rounded-xl transition-all duration-300"
              >
                Take Photo
              </Button>
              <Button
                onClick={handleAnalyze}
                disabled={isLoading || selectedFiles.length === 0}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold text-lg px-6 py-4 rounded-xl transition-all duration-300"
              >
                {isLoading ? "Analyzing..." : "Analyze Plant Health"}
              </Button>
            </div>
            
            {analysisResult && (
              <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
                <CardHeader>
                  <CardTitle className="text-green-400">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{analysisResult}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {!session && (
          <section className="text-center">
            <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10 p-6">
              <p className="text-gray-400 mb-4">
                To save your analysis history and get personalized recommendations, please sign in.
              </p>
              <Button onClick={handleSignIn} variant="secondary">
                Sign In to Save History
              </Button>
            </Card>
          </section>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default PlantHealthAnalyzer;
