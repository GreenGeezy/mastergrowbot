
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useSession } from "@supabase/auth-helpers-react";
import { useNavigate } from 'react-router-dom';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import BottomNavigation from "@/components/navigation/BottomNavigation";
import CameraCapture from '@/components/plant-health/CameraCapture';

const PlantHealthAnalyzer = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const session = useSession();
  const navigate = useNavigate();

  const handleCapture = useCallback((imageSrc: string | null) => {
    setCapturedImage(imageSrc);
    setShowCamera(false);
  }, []);

  const handlePhotoCapture = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!capturedImage) {
      toast.error("Please capture an image first.");
      return;
    }

    setIsLoading(true);
    setAnalysisResult(null);

    try {
      // Simulate analysis (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 2000));
      setAnalysisResult("The plant appears healthy. No immediate concerns detected.");
      toast.success("Analysis complete!");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysisResult("Analysis failed. Please try again.");
      toast.error("Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="min-h-screen bg-background text-white pb-20">
      <PlantHealthHeader />

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
            <CardHeader>
              <CardTitle>Capture Plant Image</CardTitle>
              <CardDescription>Take a clear photo of your plant for analysis.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {!showCamera ? (
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowCamera(true)}
                    className="w-full bg-gradient-primary hover:bg-gradient-secondary"
                  >
                    Open Camera
                  </Button>
                  {capturedImage && (
                    <div className="mt-4">
                      <img src={capturedImage} alt="Captured Plant" className="max-w-md rounded-lg" />
                    </div>
                  )}
                </div>
              ) : (
                <CameraCapture
                  onPhotoCapture={handlePhotoCapture}
                  onClose={() => setShowCamera(false)}
                />
              )}
            </CardContent>
          </Card>
        </section>

        <section className="mb-8">
          <div className="space-y-2">
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !capturedImage}
              className="w-full bg-gradient-primary hover:bg-gradient-secondary"
            >
              {isLoading ? "Analyzing..." : "Analyze Plant Health"}
            </Button>
            {analysisResult && (
              <Card className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
                <CardContent>
                  <p>{analysisResult}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {!session && (
          <section className="text-center">
            <p className="text-gray-400 mb-4">
              To save your analysis history, please sign in.
            </p>
            <Button onClick={handleSignIn} variant="secondary">
              Sign In to Save History
            </Button>
          </section>
        )}
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default PlantHealthAnalyzer;
