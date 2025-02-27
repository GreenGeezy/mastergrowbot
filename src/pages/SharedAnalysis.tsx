
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ExternalLink } from 'lucide-react';
import AnalysisResults from '@/components/plant-health/AnalysisResults';

const SharedAnalysis = () => {
  const { token } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // First get the analysis_id and check expiration from shared_analyses
        const { data: sharedAnalysis, error: sharedError } = await supabase
          .from('shared_analyses')
          .select('analysis_id, expires_at')
          .eq('share_token', token)
          .maybeSingle();

        if (sharedError) throw sharedError;
        if (!sharedAnalysis) {
          setError('Shared analysis not found');
          setLoading(false);
          return;
        }

        // Check if the analysis has expired
        if (new Date(sharedAnalysis.expires_at) < new Date()) {
          setError('This shared analysis has expired');
          setLoading(false);
          return;
        }

        // Then fetch the actual analysis data
        const { data: analysis, error: analysisError } = await supabase
          .from('plant_analyses')
          .select('*')
          .eq('id', sharedAnalysis.analysis_id)
          .maybeSingle();

        if (analysisError) throw analysisError;
        if (!analysis) {
          setError('Analysis data not found');
          setLoading(false);
          return;
        }

        setAnalysis(analysis);
      } catch (error: any) {
        console.error('Error fetching shared analysis:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAnalysis();
    } else {
      setError('Invalid share link');
      setLoading(false);
    }
  }, [token]);

  const handleUnleashClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Analysis Not Found</h1>
        <p className="text-gray-400 mb-8">{error || 'This analysis may have been removed.'}</p>
        <Button asChild>
          <Link to="/">Return Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-background to-gray-900/80 min-h-screen">
      {/* Branded Header */}
      <div className="flex flex-col items-center justify-center mb-8">
        <div className="relative flex items-center justify-center w-32 h-32 mb-4">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur opacity-75"></div>
          <div className="relative bg-card rounded-full p-4 backdrop-blur-xl ring-1 ring-white/10">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot" 
              className="w-24 h-24" 
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow mb-2 text-center">
          Master Growbot
        </h1>
        <p className="text-lg text-accent max-w-md text-center mb-4">
          Grow Bigger, Grow Better with AI-Powered Plant Analysis
        </p>
      </div>

      <Card className="max-w-4xl mx-auto bg-gray-900/60 border-gray-800 overflow-hidden">
        <div className="relative">
          {analysis.image_urls && analysis.image_urls.length > 0 ? (
            <img
              src={analysis.image_urls[0]}
              alt="Plant Analysis"
              className="w-full h-64 object-cover"
            />
          ) : (
            <img
              src={analysis.image_url}
              alt="Plant Analysis"
              className="w-full h-64 object-cover"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>
          <div className="absolute bottom-4 left-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium">
            AI-Powered Analysis
          </div>
        </div>

        <div className="p-6">
          <AnalysisResults analysisResult={analysis} />

          <div className="mt-12 text-center space-y-6 border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold text-white">
              Want AI Analysis for Your Plants?
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Join thousands of growers optimizing their harvests with Master Growbot's advanced AI analysis
            </p>
            <Button 
              onClick={handleUnleashClick}
              size="lg" 
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transform transition-all duration-300 hover:scale-105"
            >
              Try Master Growbot Free <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <p className="text-xs text-gray-500">
              Analyzed with ❤️ by Master Growbot • 
              <Link to="/" className="underline ml-1 hover:text-accent">
                www.mastergrowbot.com
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SharedAnalysis;
