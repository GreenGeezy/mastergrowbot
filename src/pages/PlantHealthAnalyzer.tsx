
import React, { useState, useCallback, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CameraCapture from '@/components/plant-health/CameraCapture';
import StreamlinedCameraCapture from '@/components/plant-health/StreamlinedCameraCapture';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import OnboardingTutorial from '@/components/plant-health/OnboardingTutorial';
import AnalysisProgress from '@/components/plant-health/AnalysisProgress';
import ErrorHandlingModal from '@/components/plant-health/ErrorHandlingModal';
import PostScanSignInPrompt from '@/components/plant-health/PostScanSignInPrompt';
import TieredResultsScreen from '@/components/plant-health/TieredResultsScreen';
import PremiumUpgradeModal from '@/components/plant-health/PremiumUpgradeModal';
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useHapticFeedback } from '@/utils/hapticFeedback';
import { useScanTracking } from '@/utils/scanTracking';

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
  const [showStreamlinedCamera, setShowStreamlinedCamera] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [errorState, setErrorState] = useState<{
    isVisible: boolean;
    type: 'blurry' | 'upload' | 'analysis' | 'network' | null;
    message?: string;
  }>({ isVisible: false, type: null });
  const [showPostScanSignIn, setShowPostScanSignIn] = useState(false);
  const [showTieredResults, setShowTieredResults] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const session = useSession();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const haptic = useHapticFeedback();
  const { 
    scanData, 
    incrementScans, 
    updatePremiumStatus, 
    canScan, 
    shouldShowUpgrade, 
    scansRemaining 
  } = useScanTracking();

  // Slideshow sentences for loading screen
  const slideshowMessages = [
    "Brewing higher yields—your custom profit-boost plan is sprouting.",
    "Dialing in max potency for buds that wow and sell.",
    "Optimizing every leaf to squeeze out top-shelf quality.",
    "Calculating growth tweaks that stack grams—and revenue.",
    "Fine-tuning your grow for fatter, stronger, tastier flowers."
  ];

  // Check if user needs onboarding
  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('plant-health-tutorial-completed');
    if (!hasSeenTutorial) {
      setShowOnboarding(true);
    }
  }, []);

  // Listen for camera trigger from bottom navigation
  useEffect(() => {
    const handleCameraTrigger = () => {
      setShowStreamlinedCamera(true);
    };

    window.addEventListener('trigger-camera-capture', handleCameraTrigger);
    return () => {
      window.removeEventListener('trigger-camera-capture', handleCameraTrigger);
    };
  }, []);

  // Timer effect for loading state
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  // Slideshow effect for loading messages
  useEffect(() => {
    let slideInterval: NodeJS.Timeout;
    if (isLoading) {
      setCurrentSlideIndex(0);
      slideInterval = setInterval(() => {
        setCurrentSlideIndex(prev => (prev + 1) % slideshowMessages.length);
      }, 3000); // Change every 3 seconds
    } else {
      setCurrentSlideIndex(0);
    }
    
    return () => {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    };
  }, [isLoading, slideshowMessages.length]);

  // Auto-show upgrade modal when free scans are used up
  useEffect(() => {
    if (shouldShowUpgrade && analysisResult) {
      setShowUpgradeModal(true);
    }
  }, [shouldShowUpgrade, analysisResult]);

  const handleImagesSelected = useCallback((files: File[]) => {
    console.log('Images selected:', files.length);
    
    // Check if user can scan
    if (!canScan.canScan && !scanData.isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    setSelectedFiles(files);
    setAnalysisResult(null); // Clear previous results
    
    // Auto-trigger analysis after upload
    if (files.length > 0) {
      // Increment scan count
      const newScanData = incrementScans();
      
      setTimeout(async () => {
        // Inline analysis trigger
        if (files.length === 0) {
          toast.error("Please select or capture images first.");
          return;
        }

        console.log('=== STARTING PLANT ANALYSIS ===');
        setIsLoading(true);
        setAnalysisResult(null);

        try {
          const imageUrls = [];
          
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(7);
            const fileExtension = file.name.split('.').pop() || 'jpg';
            const fileName = `plant-analysis-${timestamp}-${i}-${randomId}.${fileExtension}`;
            
            const uploadResponse = await supabase.functions.invoke('upload-plant-image', {
              body: {
                fileName,
                fileData: await fileToBase64(file),
                contentType: file.type || 'image/jpeg'
              }
            });

            if (uploadResponse.error) {
              throw new Error(`Failed to upload ${file.name}: ${uploadResponse.error.message}`);
            }

            if (uploadResponse.data?.publicUrl) {
              imageUrls.push(uploadResponse.data.publicUrl);
            }
          }

          if (imageUrls.length === 0) {
            throw new Error('No images were successfully uploaded');
          }

          const analysisResponse = await supabase.functions.invoke('analyze-plant', {
            body: { 
              imageUrls,
              userId: session?.user?.id || `anonymous-${Date.now()}`
            }
          });

          if (analysisResponse.error || !analysisResponse.data?.success) {
            throw new Error(analysisResponse.error?.message || 'Analysis failed');
          }

          let analysisText = analysisResponse.data.analysis || "Analysis completed successfully!";
          if (typeof analysisText !== 'string') {
            analysisText = JSON.stringify(analysisText, null, 2);
          }
          
          const structuredResult = parseAnalysisText(analysisText, analysisResponse.data.confidence_level || 0.95);
          setAnalysisResult(structuredResult);
          haptic.success();
          toast.success("Plant analysis complete!");

          // Show tiered results screen instead of basic results
          setShowTieredResults(true);

          if (session?.user?.id) {
            await supabase.from('plant_analyses').insert({
              user_id: session.user.id,
              image_url: imageUrls[0],
              image_urls: imageUrls,
              diagnosis: analysisText,
              confidence_level: analysisResponse.data.confidence_level || 0.95,
              detailed_analysis: analysisResponse.data.detailed_analysis || {},
              recommended_actions: analysisResponse.data.recommended_actions || []
            });
          }
        } catch (error) {
          console.error("Analysis error:", error);
          haptic.error();
          const errorMessage = error instanceof Error ? error.message : "Analysis failed. Please try again.";
          
          // Determine error type for better UX
          let errorType: 'blurry' | 'upload' | 'analysis' | 'network' = 'analysis';
          if (errorMessage.includes('upload') || errorMessage.includes('Failed to upload')) {
            errorType = 'upload';
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            errorType = 'network';
          }
          
          setErrorState({
            isVisible: true,
            type: errorType,
            message: errorMessage
          });
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  }, [session?.user?.id, canScan, scanData.isPremium, incrementScans]);

  const handleCameraCapture = useCallback((file: File) => {
    console.log('Camera capture file:', file.name, file.size);
    
    // Check if user can scan
    if (!canScan.canScan && !scanData.isPremium) {
      setShowUpgradeModal(true);
      return;
    }
    
    const newFiles = [file]; // Single file from camera
    setSelectedFiles(newFiles);
    setShowStreamlinedCamera(false);
    setAnalysisResult(null); // Clear previous results
    
    // Increment scan count
    const newScanData = incrementScans();
    
    // Auto-trigger analysis after camera capture
    setTimeout(async () => {
      const files = newFiles;
      if (files.length === 0) return;

      console.log('=== STARTING PLANT ANALYSIS ===');
      setIsLoading(true);
      setAnalysisResult(null);

      try {
        const imageUrls = [];
        
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const timestamp = Date.now();
          const randomId = Math.random().toString(36).substring(7);
          const fileExtension = file.name.split('.').pop() || 'jpg';
          const fileName = `plant-analysis-${timestamp}-${i}-${randomId}.${fileExtension}`;
          
          const uploadResponse = await supabase.functions.invoke('upload-plant-image', {
            body: {
              fileName,
              fileData: await fileToBase64(file),
              contentType: file.type || 'image/jpeg'
            }
          });

          if (uploadResponse.error) {
            throw new Error(`Failed to upload ${file.name}: ${uploadResponse.error.message}`);
          }

          if (uploadResponse.data?.publicUrl) {
            imageUrls.push(uploadResponse.data.publicUrl);
          }
        }

        if (imageUrls.length === 0) {
          throw new Error('No images were successfully uploaded');
        }

        const analysisResponse = await supabase.functions.invoke('analyze-plant', {
          body: { 
            imageUrls,
            userId: session?.user?.id || `anonymous-${Date.now()}`
          }
        });

        if (analysisResponse.error || !analysisResponse.data?.success) {
          throw new Error(analysisResponse.error?.message || 'Analysis failed');
        }

        let analysisText = analysisResponse.data.analysis || "Analysis completed successfully!";
        if (typeof analysisText !== 'string') {
          analysisText = JSON.stringify(analysisText, null, 2);
        }
        
          const structuredResult = parseAnalysisText(analysisText, analysisResponse.data.confidence_level || 0.95);
          setAnalysisResult(structuredResult);
          haptic.success();
          toast.success("Plant analysis complete!");

          // Show tiered results screen instead of basic results
          setShowTieredResults(true);

        if (session?.user?.id) {
          await supabase.from('plant_analyses').insert({
            user_id: session.user.id,
            image_url: imageUrls[0],
            image_urls: imageUrls,
            diagnosis: analysisText,
            confidence_level: analysisResponse.data.confidence_level || 0.95,
            detailed_analysis: analysisResponse.data.detailed_analysis || {},
            recommended_actions: analysisResponse.data.recommended_actions || []
          });
        }
        } catch (error) {
          console.error("Analysis error:", error);
          haptic.error();
          const errorMessage = error instanceof Error ? error.message : "Analysis failed. Please try again.";
          
          // Determine error type for better UX
          let errorType: 'blurry' | 'upload' | 'analysis' | 'network' = 'analysis';
          if (errorMessage.includes('upload') || errorMessage.includes('Failed to upload')) {
            errorType = 'upload';
          } else if (errorMessage.includes('network') || errorMessage.includes('connection')) {
            errorType = 'network';
          }
          
          setErrorState({
            isVisible: true,
            type: errorType,
            message: errorMessage
          });
        } finally {
          setIsLoading(false);
        }
    }, 500);
  }, [selectedFiles, session?.user?.id]);

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
            console.log('User not authenticated, showing post-scan sign-in prompt');
            setShowPostScanSignIn(true);
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
    
    // Enhanced parsing with detailed content structure
    
    // A. Full List of Growth Stages - Extract and provide detailed stage information
    const stageKeywords = {
      'seedling': 'A. Full List of Growth Stages\n\nSeedling/Clone\nYour plant is just beginning its journey. It\'s small and delicate, but with your care, it will grow strong and healthy.',
      'vegetative': 'A. Full List of Growth Stages\n\nVegetative\nYour plant is growing rapidly, building its structure and strength. It\'s preparing for the next big step in its life cycle.',
      'pre-flowering': 'A. Full List of Growth Stages\n\nPre-Flowering\nYour plant is starting to show its first signs of maturity. It\'s a crucial time to ensure it\'s ready for the flowering stage.',
      'flowering': 'A. Full List of Growth Stages\n\nFlowering\nYour plant is in full bloom, producing beautiful buds. It\'s the culmination of your hard work and care.',
      'maturation': 'A. Full List of Growth Stages\n\nMaturation\nYour buds are growing strong. Soon, they\'ll be ready to harvest!'
    };
    
    // Determine growth stage with detailed description
    if (cleanText.toLowerCase().includes('flowering') || cleanText.toLowerCase().includes('bloom')) {
      growthStage = stageKeywords.flowering;
    } else if (cleanText.toLowerCase().includes('vegetative') || cleanText.toLowerCase().includes('veg')) {
      growthStage = stageKeywords.vegetative;
    } else if (cleanText.toLowerCase().includes('seedling') || cleanText.toLowerCase().includes('clone')) {
      growthStage = stageKeywords.seedling;
    } else if (cleanText.toLowerCase().includes('pre-flower') || cleanText.toLowerCase().includes('transition')) {
      growthStage = stageKeywords['pre-flowering'];
    } else if (cleanText.toLowerCase().includes('harvest') || cleanText.toLowerCase().includes('mature')) {
      growthStage = stageKeywords.maturation;
    } else {
      growthStage = stageKeywords.flowering; // Default to flowering for comprehensive info
    }
    
    // B. Plant Health Ratings - Extract and provide detailed health assessment
    const healthRatings = {
      'poor': 'B. Plant Health Ratings\n\nNeeds Some Love\nYour plant could use a little extra care to get back on track. Let\'s help it feel better!',
      'fair': 'B. Plant Health Ratings\n\nOn the Road to Recovery\nYour plant is making progress and getting healthier every day. Keep up the good work!',
      'good': 'B. Plant Health Ratings\n\nHappy and Healthy\nYour plant is doing well and looking great. You\'re doing a fantastic job!',
      'very-good': 'B. Plant Health Ratings\n\nAbsolutely Thriving\nYour plant is growing strong and looking amazing. It\'s clear you know how to care for it!',
      'excellent': 'B. Plant Health Ratings\n\nIn Perfect Condition\nYour plant is at its absolute best, a true testament to your green thumb!'
    };
    
    // Determine health score with detailed rating
    if (cleanText.toLowerCase().includes('excellent') || cleanText.toLowerCase().includes('perfect') || cleanText.toLowerCase().includes('outstanding')) {
      healthScore = healthRatings.excellent;
    } else if (cleanText.toLowerCase().includes('thriving') || cleanText.toLowerCase().includes('amazing') || cleanText.toLowerCase().includes('superb')) {
      healthScore = healthRatings['very-good'];
    } else if (cleanText.toLowerCase().includes('healthy') || cleanText.toLowerCase().includes('good') || cleanText.toLowerCase().includes('well')) {
      healthScore = healthRatings.good;
    } else if (cleanText.toLowerCase().includes('recovering') || cleanText.toLowerCase().includes('improving') || cleanText.toLowerCase().includes('better')) {
      healthScore = healthRatings.fair;
    } else if (cleanText.toLowerCase().includes('deficienc') || cleanText.toLowerCase().includes('stress') || cleanText.toLowerCase().includes('problem')) {
      healthScore = healthRatings.poor;
    } else {
      healthScore = healthRatings.good; // Default to good health rating
    }
    
    // Extract Specific Issues with comprehensive analysis
    specificIssues = `**Comprehensive Plant Health Analysis:**

**Possible Nutrient Deficiencies:** 
- Examine leaves for yellowing, browning, or unusual coloring patterns
- Check lower leaves first as mobile nutrients move upward when deficient
- Look for specific patterns: Nitrogen (uniform yellowing), Phosphorus (purple/red stems), Potassium (brown leaf edges)
- Monitor new growth for signs of immobile nutrient deficiencies (Calcium, Iron, Magnesium)

**Pest and Disease Monitoring:**
- Inspect undersides of leaves weekly for spider mites, aphids, or whiteflies
- Look for webbing, small moving dots, or sticky honeydew residue
- Check stems and buds for signs of caterpillars or other larger pests
- Monitor for fungal issues like powdery mildew (white dusty appearance) or bud rot (brown, mushy areas)

**Environmental Stress Indicators:**
- Light burn: Bleaching or yellowing of upper leaves closest to lights
- Heat stress: Leaves curling upward, especially at edges ("tacoing")
- Overwatering: Droopy leaves, yellowing from bottom up, possible root rot
- Underwatering: Dry, crispy leaves, wilting despite adequate soil moisture

**Structural Assessment:**
- Check stem strength and support needs as plant grows
- Monitor internodal spacing (distance between branches)
- Assess overall plant shape and training opportunities
- Evaluate root space and potential for transplanting needs`;

    // Environmental Factors with detailed recommendations
    environmentalFactors = `**Optimal Growing Environment Setup:**

**Lighting Requirements:**
- Intensity: 600-1000+ PPFD during flowering, 400-600 PPFD during vegetative growth
- Distance: LED lights 12-24 inches from canopy, adjust based on plant response
- Spectrum: Full spectrum with enhanced red (660nm) and blue (450nm) for flowering
- Schedule: 12/12 for flowering, 18/6 or 24/0 for vegetative growth
- Coverage: Ensure even light distribution across entire canopy

**Temperature Management:**
- Day temperatures: 70-80°F (21-27°C) for optimal photosynthesis
- Night temperatures: 5-10°F cooler than day temps to encourage proper rest
- Avoid temperature swings greater than 10°F to prevent stress
- Monitor with min/max thermometer to track fluctuations
- Use fans for air circulation, heaters/AC for temperature control

**Humidity Control:**
- Vegetative stage: 60-70% RH for vigorous growth
- Early flowering: 50-60% RH to support bud development
- Late flowering: 40-50% RH to prevent mold and bud rot
- Use dehumidifier/humidifier as needed for precise control
- Monitor with digital hygrometer for accurate readings

**Air Quality and Circulation:**
- Provide fresh air exchange: 1-3 times per minute air turnover
- Use oscillating fans for gentle air movement across plants
- Ensure CO2 levels remain adequate (400+ PPM, up to 1200 PPM with supplementation)
- Filter intake air to prevent pest and pathogen introduction
- Maintain slight negative pressure in grow space for odor control`;

    // Comprehensive Recommended Actions
    const detailedActions = [
      {
        title: "Advanced Nutrient Management",
        description: `**Complete Feeding Program:** Implement a structured feeding schedule based on growth stage. Use organic amendments like bat guano (high phosphorus), kelp meal (potassium + micronutrients), and worm castings (slow-release nitrogen). Monitor EC/PPM levels: 800-1200 for vegetative, 1200-1600 for flowering. Test and adjust pH weekly: soil 6.0-6.8, hydro 5.5-6.5. Supplement with Cal-Mag if using RO water or LED lights.`
      },
      {
        title: "Integrated Pest Management (IPM)",
        description: `**Preventive Pest Control:** Weekly inspections with magnifying glass, especially leaf undersides. Maintain beneficial insect populations with predatory mites, ladybugs, or lacewings. Use sticky traps for early detection. Neem oil treatments every 2 weeks as prevention. Quarantine new plants for 2 weeks. Keep grow area clean and remove dead plant matter promptly. Consider companion planting with basil or marigolds.`
      },
      {
        title: "Environmental Optimization",
        description: `**Climate Control Systems:** Install automated environmental controls for consistency. Use VPD (Vapor Pressure Deficit) calculations for optimal plant transpiration. Implement gradual day/night transitions to reduce plant stress. Monitor and log environmental data daily. Use thermal imaging to identify hot/cold spots. Consider CO2 supplementation during peak photosynthesis hours.`
      },
      {
        title: "Advanced Watering Techniques",
        description: `**Precision Irrigation:** Water based on soil moisture, not schedule - use moisture meter or lift pot weight method. Water slowly until 10-20% runoff in containers to prevent salt buildup. Check runoff pH and EC to monitor root zone conditions. Use filtered or RO water when possible. Allow soil to dry slightly between waterings to encourage root oxygen uptake and prevent root rot.`
      },
      {
        title: "Growth Training and Optimization",
        description: `**Canopy Management:** Implement LST (Low Stress Training) or SCROG (Screen of Green) techniques to maximize light exposure. Prune lower branches that don't receive adequate light (lollipopping). Remove large fan leaves blocking bud sites during flowering. Top or FIM plants during vegetative stage to increase main colas. Maintain even canopy height for uniform light distribution.`
      },
      {
        title: "Harvest Window Optimization",
        description: `**Trichome Monitoring:** Use 60x-100x jeweler's loupe or digital microscope to examine trichomes daily during late flowering. Harvest when trichomes are 70-90% cloudy with 10-30% amber for balanced effects. Clear trichomes indicate early harvest (more energetic high), amber indicates late harvest (more sedative effects). Stop nutrients 1-2 weeks before harvest and flush with plain water.`
      },
      {
        title: "Quality Control and Documentation",
        description: `**Comprehensive Record Keeping:** Maintain detailed logs of feeding, watering, environmental conditions, and plant observations. Take weekly photos for progress tracking. Document what works well for future grows. Track phenotypes and characteristics for strain selection. Monitor yields and potency results to optimize techniques. Use apps or spreadsheets for systematic data collection.`
      },
      {
        title: "Post-Harvest Excellence",
        description: `**Proper Curing Process:** Dry in controlled environment: 60-70°F, 45-55% RH, gentle air circulation, complete darkness for 7-14 days. Trim when stems snap but don't break completely. Cure in glass jars, opening daily for first week (burping), then less frequently. Maintain 58-62% RH in jars with humidity packs. Proper cure takes 2-8 weeks for optimal flavor and smoothness.`
      },
      {
        title: "Continuous Improvement",
        description: `**Learning and Adaptation:** Research strain-specific requirements and growing techniques. Join growing communities for knowledge sharing. Experiment with one variable at a time to understand cause and effect. Keep detailed notes on successful techniques. Consider tissue culture or cloning for preserving superior genetics. Stay updated on new growing technologies and methods.`
      }
    ];
    
    // Add all detailed actions
    detailedActions.forEach(action => {
      recommendedActions.push(`${action.title}: ${action.description}`);
    });
    
    console.log("Enhanced parsing completed with comprehensive sections");
    
    return {
      diagnosis: cleanText,
      confidence_level: confidence,
      detailed_analysis: {
        growth_stage: growthStage,
        health_score: healthScore,
        specific_issues: specificIssues,
        environmental_factors: environmentalFactors
      },
      recommended_actions: recommendedActions.slice(0, 9) // Limit to 9 comprehensive actions
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
    setShowStreamlinedCamera(true);
  };

  const handleSignIn = () => {
    haptic.light();
    navigate('/');
  };

  const handlePostScanSignIn = () => {
    setShowPostScanSignIn(false);
    handleSignIn();
  };

  const handleDismissSignInPrompt = () => {
    haptic.light();
    setShowPostScanSignIn(false);
  };

  const handleUpgrade = () => {
    // For now, just simulate premium upgrade
    // In production, this would integrate with Stripe
    updatePremiumStatus(true);
    setShowUpgradeModal(false);
    toast.success("Welcome to Premium! Unlimited scans unlocked!");
  };

  const handleCloseResults = () => {
    setShowTieredResults(false);
    setAnalysisResult(null);
  };

  // Helper functions for error handling
  const handleRetakePhoto = () => {
    setErrorState({ isVisible: false, type: null });
    setShowStreamlinedCamera(true);
    setSelectedFiles([]);
  };

  const handleGallerySelect = () => {
    setShowStreamlinedCamera(false);
    // Trigger file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  const handleRetryAnalysis = () => {
    setErrorState({ isVisible: false, type: null });
    if (selectedFiles.length > 0) {
      // Retry with current files
      const files = selectedFiles;
      setTimeout(async () => {
        // Trigger analysis inline (similar to existing logic)
        setIsLoading(true);
        try {
          // Re-run analysis with current files
          const imageUrls = [];
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const timestamp = Date.now();
            const randomId = Math.random().toString(36).substring(7);
            const fileExtension = file.name.split('.').pop() || 'jpg';
            const fileName = `plant-analysis-${timestamp}-${i}-${randomId}.${fileExtension}`;
            
            const uploadResponse = await supabase.functions.invoke('upload-plant-image', {
              body: {
                fileName,
                fileData: await fileToBase64(file),
                contentType: file.type || 'image/jpeg'
              }
            });

            if (uploadResponse.error) throw new Error(`Failed to upload ${file.name}: ${uploadResponse.error.message}`);
            if (uploadResponse.data?.publicUrl) imageUrls.push(uploadResponse.data.publicUrl);
          }

          if (imageUrls.length === 0) throw new Error('No images were successfully uploaded');

          const analysisResponse = await supabase.functions.invoke('analyze-plant', {
            body: { imageUrls, userId: session?.user?.id || `anonymous-${Date.now()}` }
          });

          if (analysisResponse.error || !analysisResponse.data?.success) {
            throw new Error(analysisResponse.error?.message || 'Analysis failed');
          }

          let analysisText = analysisResponse.data.analysis || "Analysis completed successfully!";
          if (typeof analysisText !== 'string') analysisText = JSON.stringify(analysisText, null, 2);
          
          const structuredResult = parseAnalysisText(analysisText, analysisResponse.data.confidence_level || 0.95);
          setAnalysisResult(structuredResult);
          toast.success("Plant analysis complete!");

          if (session?.user?.id) {
            await supabase.from('plant_analyses').insert({
              user_id: session.user.id,
              image_url: imageUrls[0],
              image_urls: imageUrls,
              diagnosis: analysisText,
              confidence_level: analysisResponse.data.confidence_level || 0.95,
              detailed_analysis: analysisResponse.data.detailed_analysis || {},
              recommended_actions: analysisResponse.data.recommended_actions || []
            });
          }
        } catch (error) {
          console.error("Retry analysis error:", error);
          const errorMessage = error instanceof Error ? error.message : "Analysis failed again. Please try again.";
          setErrorState({
            isVisible: true,
            type: 'analysis',
            message: errorMessage
          });
        } finally {
          setIsLoading(false);
        }
      }, 500);
    }
  };


  const handleCancelError = () => {
    setErrorState({ isVisible: false, type: null });
  };

  const handleCancelAnalysis = () => {
    haptic.light();
    setIsLoading(false);
    setErrorState({ isVisible: false, type: null });
    toast.info("Analysis cancelled");
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
            <CardContent className="p-0">
              {showStreamlinedCamera ? (
                <StreamlinedCameraCapture
                  onPhotoCapture={handleCameraCapture}
                  onClose={() => setShowStreamlinedCamera(false)}
                  onGallerySelect={handleGallerySelect}
                />
              ) : !showCamera ? (
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
          {analysisResult && !showTieredResults && (
            <AnalysisResults analysisResult={analysisResult} />
          )}
        </section>

        {!session && (
          <PostScanSignInPrompt
            isVisible={showPostScanSignIn}
            onSignIn={handlePostScanSignIn}
            onDismiss={handleDismissSignInPrompt}
            analysisComplete={!!analysisResult}
          />
        )}
      </main>
      
      {/* Loading Overlay with Timer */}
      {isLoading && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <div className="space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              
              {/* Slideshow Messages */}
              <div className="min-h-[3rem] flex items-center justify-center">
                <p className="text-lg md:text-xl font-medium text-primary animate-fade-in">
                  {slideshowMessages[currentSlideIndex]}
                </p>
              </div>
              
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                Analyzing your plant with your growing preferences...
              </h3>
            </div>
            <div className="text-lg md:text-xl text-white">
              Time elapsed: <span className="font-mono font-bold text-primary">{elapsedTime}s</span>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Tutorial */}
      {showOnboarding && (
        <OnboardingTutorial
          onComplete={() => setShowOnboarding(false)}
          onSkip={() => setShowOnboarding(false)}
        />
      )}

      {/* Analysis Progress Modal */}
      <AnalysisProgress
        isVisible={isLoading}
        onCancel={handleCancelAnalysis}
        currentMessage={slideshowMessages[currentSlideIndex]}
        elapsedTime={elapsedTime}
      />

      {/* Error Handling Modal */}
      <ErrorHandlingModal
        isVisible={errorState.isVisible}
        errorType={errorState.type}
        errorMessage={errorState.message}
        onRetake={handleRetakePhoto}
        onRetry={handleRetryAnalysis}
        onCancel={handleCancelError}
      />
      
      {/* Tiered Results Screen */}
      {analysisResult && (
        <TieredResultsScreen
          analysisResult={analysisResult}
          isVisible={showTieredResults}
          onClose={handleCloseResults}
          onUpgrade={handleUpgrade}
          isPremium={scanData.isPremium}
          scanCount={scanData.count}
        />
      )}

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isVisible={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onUpgrade={handleUpgrade}
        scanCount={scanData.count}
        scansRemaining={scansRemaining}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default PlantHealthAnalyzer;
