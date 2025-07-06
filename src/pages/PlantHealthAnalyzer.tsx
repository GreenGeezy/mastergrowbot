
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CameraCapture from '@/components/plant-health/CameraCapture';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

const PlantHealthAnalyzer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleImagesSelected = useCallback((files: File[]) => {
    console.log('Images selected:', files.length);
    setSelectedFiles(files);
    setAnalysisResult(null); // Clear previous results
  }, []);

  const handleCameraCapture = useCallback((file: File) => {
    console.log('Camera capture file:', file.name, file.size);
    setSelectedFiles(prev => [...prev, file]);
    setShowCamera(false);
    setAnalysisResult(null); // Clear previous results
  }, []);

  const handleAnalyze = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select or capture images first.");
      return;
    }

    console.log('=== STARTING PLANT ANALYSIS ===');
    setIsLoading(true);
    setAnalysisResult(null);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      toast.error("Analysis timed out. Please try again with a smaller image or check your connection.");
    }, 120000); // 2 minute timeout

    try {
      console.log('Starting analysis with', selectedFiles.length, 'files');
      
      // Upload images to storage with improved error handling
      const imageUrls = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        console.log(`Processing file ${i + 1}:`, {
          name: file.name,
          size: file.size, 
          type: file.type,
          lastModified: file.lastModified
        });
        
        // Create unique filename with timestamp to avoid conflicts
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);
        const fileExtension = file.name.split('.').pop() || 'jpg';
        const fileName = `plant-analysis-${timestamp}-${i}-${randomId}.${fileExtension}`;
        
        try {
          console.log(`Uploading file ${i + 1} with name:`, fileName);
          
          // Use the upload edge function with timeout
          const uploadPromise = supabase.functions.invoke('upload-plant-image', {
            body: {
              fileName,
              fileData: await fileToBase64(file),
              contentType: file.type || 'image/jpeg'
            }
          });

          const uploadTimeout = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Upload timeout')), 30000)
          );

          const { data: uploadResult, error: uploadError } = await Promise.race([
            uploadPromise,
            uploadTimeout
          ]) as any;

          console.log(`Upload response for file ${i + 1}:`, { uploadResult, uploadError });

          if (uploadError) {
            console.error(`Upload error for file ${i + 1}:`, uploadError);
            throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
          }

          if (uploadResult?.publicUrl) {
            console.log(`Upload successful for file ${i + 1}:`, uploadResult.publicUrl);
            imageUrls.push(uploadResult.publicUrl);
          } else {
            console.error(`No public URL received for file ${i + 1}:`, uploadResult);
            throw new Error(`No public URL received for ${file.name}`);
          }
        } catch (uploadAttemptError) {
          console.error(`Upload attempt failed for file ${i + 1}:`, uploadAttemptError);
          throw new Error(`Failed to upload ${file.name}: ${uploadAttemptError.message}`);
        }
      }

      if (imageUrls.length === 0) {
        throw new Error('No images were successfully uploaded');
      }

      console.log('All images uploaded successfully:', imageUrls);
      console.log('Calling analyze-plant function...');

      // Call the analyze-plant edge function with timeout protection
      const analysisPromise = supabase.functions.invoke('analyze-plant', {
        body: { 
          imageUrls,
          userId: session?.user?.id || `anonymous-${Date.now()}` // Use anonymous ID for non-authenticated users
        }
      });

      const analysisTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Analysis timeout - OpenAI request took too long')), 90000)
      );

      console.log('Waiting for analysis response...');
      const { data, error } = await Promise.race([
        analysisPromise,
        analysisTimeout
      ]) as any;

      console.log('Analysis function response received:', { 
        hasData: !!data, 
        hasError: !!error,
        dataKeys: data ? Object.keys(data) : [],
        errorDetails: error
      });

      if (error) {
        console.error('Analysis function error:', error);
        throw new Error(`Analysis failed: ${error.message || 'Unknown error from analysis function'}`);
      }

      if (!data) {
        console.error('No analysis data received');
        throw new Error('No analysis data received from function');
      }

      if (!data.success) {
        console.error('Analysis function returned failure:', data);
        throw new Error(data.error || 'Analysis failed with unknown error');
      }

      const analysisText = data.analysis || data.diagnosis || "Analysis completed successfully!";
      console.log('Analysis result received, length:', analysisText.length);
      
      setAnalysisResult(analysisText);
      toast.success("Plant analysis complete!");

      // Store the analysis in the database only if user is authenticated
      if (session?.user?.id) {
        try {
          console.log('Saving analysis to database...');
          const { error: saveError } = await supabase
            .from('plant_analyses')
            .insert({
              user_id: session.user.id,
              image_url: imageUrls[0], // Primary image
              image_urls: imageUrls, // All images
              diagnosis: analysisText,
              confidence_level: data.confidence_level || 0.95,
              detailed_analysis: data.detailed_analysis || {},
              recommended_actions: data.recommended_actions || []
            });

          if (saveError) {
            console.error('Error saving analysis:', saveError);
            toast.error("Analysis complete but couldn't save to history");
          } else {
            console.log('Analysis saved to database successfully');
          }
        } catch (saveError) {
          console.error('Error saving analysis to database:', saveError);
        }
      } else {
        console.log('User not authenticated, skipping analysis save');
      }

      console.log('=== PLANT ANALYSIS COMPLETED SUCCESSFULLY ===');

    } catch (error) {
      console.error('=== PLANT ANALYSIS FAILED ===');
      console.error("Analysis error:", error);
      console.error("Error stack:", error.stack);
      const errorMessage = error instanceof Error ? error.message : "Analysis failed. Please try again.";
      setAnalysisResult(`Analysis failed: ${errorMessage}`);
      toast.error(errorMessage);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data:image/jpeg;base64, prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleTakePhoto = () => {
    setShowCamera(true);
  };

  const handleSignIn = () => {
    navigate('/');
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
            
            {selectedFiles.length > 0 && (
              <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
                <CardHeader>
                  <CardTitle className="text-sm text-green-400">Selected Images ({selectedFiles.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="text-xs text-gray-400 truncate">
                        {file.name} ({Math.round(file.size / 1024)}KB)
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {analysisResult && (
              <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
                <CardHeader>
                  <CardTitle className="text-green-400">Analysis Results</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="whitespace-pre-wrap text-sm">{analysisResult}</div>
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
