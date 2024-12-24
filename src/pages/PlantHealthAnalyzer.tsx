import React, { useState } from 'react';
import { Leaf, AlertCircle, LoaderCircle, Upload } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import ImageDropzone from '@/components/plant-health/ImageDropzone';

interface AnalysisResult {
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
  const [files, setFiles] = useState<File[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const { toast } = useToast();
  const session = useSession();

  const uploadImages = async (files: File[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${session?.user.id}/${fileName}`;

      try {
        const { error: uploadError, data } = await supabase.storage
          .from('plant-images')
          .upload(filePath, file, {
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('plant-images')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
        setUploadProgress((prev) => prev + (100 / files.length));
      } catch (error: any) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
      }
    }

    return uploadedUrls;
  };

  const analyzeImages = async (imageUrls: string[]) => {
    try {
      const { data, error } = await supabase.functions.invoke('analyze-plant', {
        body: { imageUrls },
      });

      if (error) throw error;

      if (!data || !data.analysis) {
        throw new Error('No analysis data received');
      }

      return data.analysis;
    } catch (error: any) {
      console.error('Error analyzing images:', error);
      throw new Error('Failed to analyze images');
    }
  };

  const handleAnalysis = async () => {
    if (files.length === 0 || !session) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setUploadProgress(0);

    try {
      const imageUrls = await uploadImages(files);
      setUploadProgress(100);
      
      const result = await analyzeImages(imageUrls);
      
      setAnalysisResult(result);
      toast({
        title: "Analysis Complete",
        description: "Your plant health analysis is ready!",
      });
    } catch (error: any) {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const quickTips = [
    {
      icon: Leaf,
      title: "Take Photo",
      description: "Upload clear, detailed photos of any concerning areas on your plant"
    },
    {
      icon: AlertCircle,
      title: "Share Results",
      description: "Share your analysis via email, social media, or copy a direct link"
    },
    {
      icon: Upload,
      title: "Analysis History",
      description: "Review past diagnoses and track your plant's health over time"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-gradient-to-br from-green-900/20 to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-[#33C3F0] to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-[#1A1A1A]/90 p-4 rounded-full backdrop-blur-xl ring-1 ring-white/10 hover:ring-[#33C3F0]/30 transition-all duration-500">
              <img 
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
                alt="Plant Health Scanner" 
                className="w-16 h-16 mx-auto"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            Plant Health Scanner
          </h1>
          <p className="text-gray-400">
            Upload a photo of your plant for instant AI-powered health analysis
          </p>
        </div>

        {/* Upload Zone */}
        <ImageDropzone
          onImagesSelected={setFiles}
          selectedFiles={files}
          maxFiles={3}
        />

        {/* Analysis Progress */}
        {isAnalyzing && (
          <Card className="mb-8 p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Analyzing plant health...</span>
                <LoaderCircle className="animate-spin text-primary" />
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </Card>
        )}

        {/* Analysis Results */}
        {analysisResult && !isAnalyzing && (
          <AnalysisResults analysisResult={analysisResult} />
        )}

        {/* Quick Tips Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {quickTips.map((tip, index) => (
            <Card
              key={index}
              className="backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:border-primary/50 transition-all duration-300 p-6"
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                  <tip.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-white font-medium">{tip.title}</h3>
                <p className="text-gray-400 text-sm">{tip.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Analysis Button */}
        {files.length > 0 && !isAnalyzing && (
          <Button
            onClick={handleAnalysis}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-6 rounded-xl hover:opacity-90 transition-opacity duration-300 relative overflow-hidden"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <LoaderCircle className="animate-spin" />
                Analyzing Plant Health...
              </div>
            ) : (
              "Analyze Plant Health"
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;