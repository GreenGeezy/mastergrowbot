import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@supabase/auth-helpers-react';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import ImageDropzone from '@/components/plant-health/ImageDropzone';
import PlantHealthHeader from '@/components/plant-health/PlantHealthHeader';
import ShareResults from '@/components/plant-health/ShareResults';
import AnalysisHistory from '@/components/plant-health/AnalysisHistory';

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
      if (!data || !data.analysis) throw new Error('No analysis data received');
      
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
      
      await supabase
        .from('plant_analyses')
        .insert({
          user_id: session.user.id,
          image_url: imageUrls[0],
          image_urls: imageUrls,
          diagnosis: result.diagnosis,
          confidence_level: result.confidence_level,
          detailed_analysis: result.detailed_analysis,
          recommended_actions: result.recommended_actions,
        });

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

  return (
    <div className="min-h-screen bg-[#0A0A0A] bg-gradient-to-br from-green-900/20 to-blue-900/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PlantHealthHeader />

        <ImageDropzone
          onImagesSelected={setFiles}
          selectedFiles={files}
          maxFiles={3}
        />

        {isAnalyzing && (
          <div className="mb-8 p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Analyzing plant health...</span>
                <LoaderCircle className="animate-spin text-primary" />
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </div>
        )}

        {analysisResult && !isAnalyzing && (
          <AnalysisResults analysisResult={analysisResult} />
        )}

        {files.length > 0 && !isAnalyzing && (
          <Button
            onClick={handleAnalysis}
            className="w-full max-w-lg mx-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mb-4"
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

        {session && (
          <div className="flex flex-col items-center gap-4 mt-6 max-w-lg mx-auto px-4">
            <div data-share-dialog className="w-full">
              <Button
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold text-lg px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 mb-4"
              >
                Share Results
              </Button>
            </div>
            <div data-history-dialog className="w-full">
              <Button
                className="w-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 hover:border-slate-500 text-white font-semibold text-lg px-6 py-4 rounded-xl transition-all duration-300 flex items-center justify-center"
              >
                View Analysis History
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;