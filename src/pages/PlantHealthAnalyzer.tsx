
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
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface StructuredAnalysisResult {
  diagnosis: string;
  confidence_level: number;
  detailed_analysis: {
    growth_stage: string;
    health_score: string;
    specific_issues: string;
    environmental_factors: string;
  };
  recommended_actions: string[];
}

const PlantHealthAnalyzer = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [analysisResult, setAnalysisResult] = useState<StructuredAnalysisResult | null>(null);
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
    console.log('Current URL:', window.location.href);
    console.log('Branch/Environment check');
    console.log('Files to analyze:', selectedFiles.length);
    
    setIsLoading(true);
    setAnalysisResult(null);

    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      toast.error("Analysis timed out. Please try again with a smaller image or check your connection.");
    }, 120000); // 2 minute timeout

    try {
      console.log('Starting analysis with', selectedFiles.length, 'files');
      
      // Upload images to storage with enhanced error handling
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
          console.log('Calling upload-plant-image function...');
          
          // Use the upload edge function with enhanced error handling
          const uploadResponse = await supabase.functions.invoke('upload-plant-image', {
            body: {
              fileName,
              fileData: await fileToBase64(file),
              contentType: file.type || 'image/jpeg'
            }
          });

          console.log(`Upload response for file ${i + 1}:`, uploadResponse);

          if (uploadResponse.error) {
            console.error(`Upload error for file ${i + 1}:`, uploadResponse.error);
            throw new Error(`Failed to upload ${file.name}: ${uploadResponse.error.message}`);
          }

          if (uploadResponse.data?.publicUrl) {
            console.log(`Upload successful for file ${i + 1}:`, uploadResponse.data.publicUrl);
            imageUrls.push(uploadResponse.data.publicUrl);
          } else {
            console.error(`No public URL received for file ${i + 1}:`, uploadResponse.data);
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

      // Call the analyze-plant edge function with enhanced error handling
      const analysisResponse = await supabase.functions.invoke('analyze-plant', {
        body: { 
          imageUrls,
          userId: session?.user?.id || `anonymous-${Date.now()}` // Use anonymous ID for non-authenticated users
        }
      });

      console.log('Analysis function response received:', analysisResponse);

      if (analysisResponse.error) {
        console.error('Analysis function error:', analysisResponse.error);
        throw new Error(`Analysis failed: ${analysisResponse.error.message || 'Unknown error from analysis function'}`);
      }

      if (!analysisResponse.data) {
        console.error('No analysis data received');
        throw new Error('No analysis data received from function');
      }

      if (!analysisResponse.data.success) {
        console.error('Analysis function returned failure:', analysisResponse.data);
        throw new Error(analysisResponse.data.error || 'Analysis failed with unknown error');
      }

      // Safely extract and sanitize analysis text
      let analysisText = analysisResponse.data.analysis || analysisResponse.data.diagnosis || "Analysis completed successfully!";
      
      // Ensure analysisText is a string and sanitize it
      if (typeof analysisText !== 'string') {
        analysisText = JSON.stringify(analysisText, null, 2);
      }
      
      // Remove any potential problematic characters
      analysisText = analysisText.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g, '');
      // Parse the analysis text to create structured data
      const structuredResult = parseAnalysisText(analysisText, analysisResponse.data.confidence_level || 0.95);
      
      console.log('Analysis result received, length:', analysisText.length);
      
      setAnalysisResult(structuredResult);
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
              confidence_level: analysisResponse.data.confidence_level || 0.95,
              detailed_analysis: analysisResponse.data.detailed_analysis || {},
              recommended_actions: analysisResponse.data.recommended_actions || []
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
      setAnalysisResult(null);
      toast.error(errorMessage);
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // Helper function to parse analysis text into structured data
  const parseAnalysisText = (analysisText: string, confidence: number): StructuredAnalysisResult => {
    // Split analysis text into sections based on common patterns
    const sections = analysisText.split(/\n\n+/);
    
    let growthStage = "";
    let healthScore = "";
    let specificIssues = "";
    let environmentalFactors = "";
    const recommendedActions: string[] = [];
    
    // Parse sections looking for key indicators
    for (const section of sections) {
      const lowerSection = section.toLowerCase();
      
      if (lowerSection.includes('flowering') || lowerSection.includes('vegetative') || lowerSection.includes('growth stage')) {
        growthStage = section.length > 200 ? section.substring(0, 200) + "..." : section;
      } else if (lowerSection.includes('health') && lowerSection.includes('score')) {
        healthScore = section.length > 200 ? section.substring(0, 200) + "..." : section;
      } else if (lowerSection.includes('issue') || lowerSection.includes('deficiency') || lowerSection.includes('problem')) {
        specificIssues = section.length > 300 ? section.substring(0, 300) + "..." : section;
      } else if (lowerSection.includes('environment') || lowerSection.includes('temperature') || lowerSection.includes('humidity') || lowerSection.includes('light')) {
        environmentalFactors = section.length > 300 ? section.substring(0, 300) + "..." : section;
      }
      
      // Extract recommendations
      if (lowerSection.includes('recommend') || lowerSection.includes('action') || lowerSection.includes('suggestion')) {
        const recommendations = section.split(/[•\-\n]/).filter(item => 
          item.trim().length > 10 && 
          (item.toLowerCase().includes('use') || 
           item.toLowerCase().includes('apply') || 
           item.toLowerCase().includes('adjust') ||
           item.toLowerCase().includes('increase') ||
           item.toLowerCase().includes('decrease') ||
           item.toLowerCase().includes('ensure') ||
           item.toLowerCase().includes('monitor'))
        );
        recommendedActions.push(...recommendations.map(r => r.trim()).slice(0, 6));
      }
    }
    
    // Fallback values if sections aren't found
    if (!growthStage) {
      growthStage = analysisText.length > 200 ? analysisText.substring(0, 200) + "..." : analysisText;
    }
    if (!healthScore) {
      healthScore = "Plant appears to be in good overall condition based on visual assessment.";
    }
    if (!specificIssues) {
      specificIssues = "No major issues detected. Continue monitoring plant health.";
    }
    if (!environmentalFactors) {
      environmentalFactors = "Environmental conditions appear suitable. Monitor temperature, humidity, and lighting.";
    }
    if (recommendedActions.length === 0) {
      recommendedActions.push(
        "Continue regular watering schedule",
        "Monitor for pests and diseases",
        "Maintain proper lighting conditions",
        "Check nutrient levels"
      );
    }
    
    return {
      diagnosis: analysisText,
      confidence_level: confidence,
      detailed_analysis: {
        growth_stage: growthStage,
        health_score: healthScore,
        specific_issues: specificIssues,
        environmental_factors: environmentalFactors
      },
      recommended_actions: recommendedActions
    };
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
              <AnalysisResults analysisResult={analysisResult} />
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
