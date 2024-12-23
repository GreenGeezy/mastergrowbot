import React, { useState } from 'react';
import { Upload, Leaf, AlertCircle, Info, CheckCircle, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';

const PlantHealthAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number>(0);
  const [showChecklist, setShowChecklist] = useState(false);
  const { toast } = useToast();

  const analysisSteps = [
    'Scanning image...',
    'Analyzing plant health...',
    'Generating results...'
  ];

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      handleFileSelect(droppedFile);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image.",
        variant: "destructive",
      });
      return false;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    setFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setShowChecklist(true);
    };
    reader.readAsDataURL(file);
  };

  const quickTips = [
    {
      icon: Leaf,
      title: "Clear Photos",
      description: "Take well-lit, focused shots of affected areas",
      tooltip: "Ensure good lighting and focus on problem areas"
    },
    {
      icon: AlertCircle,
      title: "Multiple Angles",
      description: "Include both close-up and full plant views",
      tooltip: "Different angles help with accurate diagnosis"
    },
    {
      icon: Upload,
      title: "Recent Images",
      description: "Use photos taken within the last 24 hours",
      tooltip: "Fresh images provide the most accurate analysis"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 animate-gradient-x">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="relative group mb-4">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-full blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-background/90 p-4 rounded-full backdrop-blur-xl ring-1 ring-white/10 hover:ring-accent/30 transition-all duration-500">
              <img 
                src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
                alt="Plant Health Scanner" 
                className="w-16 h-16 mx-auto"
              />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary text-transparent bg-clip-text">
            Plant Health Scanner
          </h1>
          <p className="text-gray-400">
            Upload a photo of your plant for instant AI-powered health analysis
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-8 backdrop-blur-lg bg-background/60 border border-primary/10 hover:border-accent/50 transition-all duration-300 group">
          <div
            className="p-8 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {!preview ? (
              <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 hover:border-accent/50 transition-all duration-300">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => e.target.files?.[0] && validateFile(e.target.files[0]) && handleFileSelect(e.target.files[0])}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer"
                >
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-gradient-to-r from-primary to-accent group-hover:animate-pulse">
                      <Upload className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Drop your image here or click to upload</p>
                      <p className="text-gray-400 text-sm mt-1">JPEG, PNG or WebP (max. 10MB)</p>
                    </div>
                  </div>
                </label>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-[400px] rounded-xl mx-auto"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Button
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      setShowChecklist(false);
                    }}
                    variant="secondary"
                    className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-all duration-300"
                  >
                    Choose Different Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Expandable Checklist */}
        <TooltipProvider>
          <Collapsible open={showChecklist} onOpenChange={setShowChecklist}>
            <CollapsibleContent className="space-y-2">
              {quickTips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-4 rounded-lg bg-background/60 border border-primary/10 backdrop-blur-lg transition-all duration-300 hover:border-accent/50"
                >
                  <div className="p-2 rounded-full bg-gradient-to-r from-primary to-accent">
                    <tip.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-white font-medium">{tip.title}</h3>
                    <p className="text-gray-400 text-sm">{tip.description}</p>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 text-accent hover:text-accent/80 transition-colors" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-card border border-accent/20 backdrop-blur-lg">
                      <p>{tip.tooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </TooltipProvider>

        {/* Analysis Progress */}
        {isAnalyzing && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 animate-spin border-t-accent" />
                <Loader className="w-6 h-6 text-accent absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
              </div>
              <p className="text-accent font-medium">{analysisSteps[analysisStep]}</p>
            </div>
            <Progress value={(analysisStep + 1) * 33} className="w-full" />
          </div>
        )}

        {/* Analysis Button */}
        {file && !isAnalyzing && (
          <Button
            onClick={() => setIsAnalyzing(true)}
            className="w-full bg-gradient-to-r from-primary to-accent text-white font-medium py-6 rounded-xl hover:opacity-90 transition-all duration-300 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            Analyze Plant Health
          </Button>
        )}
      </div>
    </div>
  );
};

export default PlantHealthAnalyzer;