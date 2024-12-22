import React, { useState } from 'react';
import { Upload, Leaf, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const PlantHealthAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

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
    };
    reader.readAsDataURL(file);
  };

  const quickTips = [
    {
      icon: Leaf,
      title: "Clear Photos",
      description: "Take well-lit, focused shots of affected areas"
    },
    {
      icon: AlertCircle,
      title: "Multiple Angles",
      description: "Include both close-up and full plant views"
    },
    {
      icon: Upload,
      title: "Recent Images",
      description: "Use photos taken within the last 24 hours"
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
        <Card className="mb-8 backdrop-blur-lg bg-gray-900/60 border border-gray-800 hover:border-primary/50 transition-all duration-300">
          <div
            className="p-8 text-center"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleFileDrop}
          >
            {!preview ? (
              <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-primary/50 transition-all duration-300">
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
                    <div className="p-4 rounded-full bg-gradient-to-r from-green-500 to-blue-500">
                      <Upload className="w-6 h-6 text-white" />
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
                    }}
                    variant="secondary"
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white"
                  >
                    Choose Different Image
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>

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
        {file && (
          <Button
            onClick={() => setIsAnalyzing(true)}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white font-medium py-6 rounded-xl hover:opacity-90 transition-opacity duration-300 relative overflow-hidden"
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
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