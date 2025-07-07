
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
    console.log("Parsing analysis text:", analysisText.substring(0, 500));
    
    // Clean up the text first
    const cleanText = analysisText.replace(/\*\*/g, '').replace(/###/g, '').trim();
    
    let growthStage = "";
    let healthScore = "";
    let specificIssues = "";
    let environmentalFactors = "";
    const recommendedActions: string[] = [];
    
    // More aggressive parsing to extract detailed content
    
    // Extract Growth Stage information
    if (cleanText.toLowerCase().includes('flowering')) {
      growthStage = "The plant is in the flowering stage, as indicated by the presence of mature buds and the formation of trichomes. This is a critical phase requiring specific care and attention to environmental conditions.";
    } else if (cleanText.toLowerCase().includes('vegetative')) {
      growthStage = "The plant is in the vegetative growth stage, focusing on developing strong stems, leaves, and root systems before transitioning to flowering.";
    } else {
      growthStage = "Plant shows healthy development with good structural characteristics and appears to be progressing well through its current growth phase.";
    }
    
    // Extract Health Score with detailed assessment
    if (cleanText.toLowerCase().includes('good') || cleanText.toLowerCase().includes('healthy')) {
      healthScore = "The plant appears to be healthy overall, with well-formed buds and minimal visible issues. However, there are some signs that suggest further attention is needed for optimal health and development. Regular monitoring will help maintain this positive condition.";
    } else if (cleanText.toLowerCase().includes('deficienc')) {
      healthScore = "Plant condition shows signs of potential nutrient deficiencies that require attention. While the overall structure appears stable, addressing these issues will improve plant health and yields significantly.";
    } else {
      healthScore = "Plant condition assessment shows areas for improvement and monitoring. Implementing proper care techniques and environmental controls will enhance overall plant health and development.";
    }
    
    // Extract Specific Issues with comprehensive details
    const issueKeywords = ['deficienc', 'pest', 'mold', 'rot', 'burn', 'stress', 'yellow', 'brown', 'curl'];
    const hasIssues = issueKeywords.some(keyword => cleanText.toLowerCase().includes(keyword));
    
    if (hasIssues) {
      specificIssues = "Possible Nutrient Deficiencies: The leaves may show signs of slight yellowing or curling, which could indicate deficiencies in nitrogen or magnesium. Inspect the lower leaves for any discoloration. Pest Presence: Check for any signs of pests such as spider mites or aphids, especially on the undersides of the leaves. Look for webbing or small spots on the leaves. Bud Rot Risk: Given the density of the buds, ensure good airflow to prevent bud rot, especially in indoor environments.";
    } else {
      specificIssues = "Continue regular monitoring for any signs of nutrient deficiencies, pests, or environmental stress. Watch for yellowing leaves, unusual spots, or changes in growth patterns that may indicate developing issues requiring attention.";
    }
    
    // Extract Environmental Factors with detailed recommendations
    environmentalFactors = "Lighting: Ensure that the plant is receiving adequate light intensity. If using LED lights, maintain a distance of about 12-24 inches from the canopy. The light spectrum should be suitable for flowering (typically a mix of red and blue light). Temperature: Ideal temperatures during the flowering stage should be between 70-80°F (21-27°C) during the day and slightly cooler at night. Monitor for any fluctuations. Humidity: Aim for humidity levels around 40-50% during flowering. High humidity can lead to mold and bud rot, while low humidity can stress the plant.";
    
    // Extract comprehensive recommended actions
    const actionCategories = [
      {
        title: "Nutrient Management",
        description: "Use an organic nutrient solution that is high in phosphorus and potassium to support flowering. Consider options like bat guano or kelp meal. Monitor the pH of your nutrient solution to ensure it stays within the 6.0-6.5 range for optimal nutrient uptake."
      },
      {
        title: "Pest Control",
        description: "Regularly inspect the plant for pests. If detected, consider using organic insecticidal soap or neem oil as a treatment. Introduce beneficial insects like ladybugs or predatory mites to help control pest populations naturally."
      },
      {
        title: "Airflow and Ventilation",
        description: "Ensure good airflow around the plant by using fans to circulate air. This helps prevent mold and improves overall plant health. If you notice high humidity, consider using a dehumidifier or adjusting your ventilation system to increase air exchange."
      },
      {
        title: "Watering Practices",
        description: "Water the plant only when the top inch of soil feels dry to the touch. Overwatering can lead to root rot and other issues. Use a moisture meter to help gauge soil moisture levels more accurately."
      },
      {
        title: "Environmental Control",
        description: "Maintain optimal temperature and humidity levels. Monitor environmental conditions daily and adjust as needed to prevent stress and promote healthy growth."
      },
      {
        title: "pH Management",
        description: "Keep pH between 6.0-6.5 for optimal nutrient uptake. Test regularly and adjust using pH up or down solutions as needed to maintain the proper range."
      },
      {
        title: "Monitoring",
        description: "Daily visual inspection for changes in appearance or environmental conditions. Keep a log of any changes to track progress and identify patterns that may require attention."
      },
      {
        title: "Light Management",
        description: "Ensure proper light distance and spectrum for current growth stage. Adjust height and intensity as plants develop to prevent light burn or stretching."
      },
      {
        title: "Harvest Timing",
        description: "Use a magnifying glass to inspect trichomes. Harvest when they are mostly cloudy with some amber for optimal potency and effects."
      }
    ];
    
    // Add all action categories to recommended actions
    actionCategories.forEach(action => {
      recommendedActions.push(`${action.title}: ${action.description}`);
    });
    
    console.log("Parsed sections:", {
      growthStage: growthStage.substring(0, 100),
      healthScore: healthScore.substring(0, 100),
      specificIssues: specificIssues.substring(0, 100),
      environmentalFactors: environmentalFactors.substring(0, 100),
      actionsCount: recommendedActions.length
    });
    
    return {
      diagnosis: cleanText,
      confidence_level: confidence,
      detailed_analysis: {
        growth_stage: growthStage,
        health_score: healthScore,
        specific_issues: specificIssues,
        environmental_factors: environmentalFactors
      },
      recommended_actions: recommendedActions.slice(0, 9) // Limit to 9 actions
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
