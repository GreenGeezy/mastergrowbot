import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import AnalysisActions from '@/components/plant-health/AnalysisActions';

const SharedAnalysis = () => {
  const { token } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
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

        if (new Date(sharedAnalysis.expires_at) < new Date()) {
          setError('This shared analysis has expired');
          setLoading(false);
          return;
        }

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

  const handleTakePhoto = () => {
    // Navigate to plant health analyzer or handle photo taking
    window.location.href = '/plant-health';
  };

  const handleAnalyze = async () => {
    // This is a shared view, so we'll redirect to the main analyzer
    window.location.href = '/plant-health';
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
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto bg-gray-900/60 border-gray-800">
        <div className="p-6">
          <div className="mb-8">
            {analysis.image_urls && analysis.image_urls.length > 0 ? (
              <img
                src={analysis.image_urls[0]}
                alt="Plant Analysis"
                className="w-full h-64 object-cover rounded-lg"
              />
            ) : (
              <img
                src={analysis.image_url}
                alt="Plant Analysis"
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
          </div>

          <AnalysisResults analysisResult={analysis} />
          <AnalysisActions 
            session={null}
            onTakePhoto={handleTakePhoto}
            onAnalyze={handleAnalyze}
            showConfirmation={showConfirmation}
            onConfirmationCancel={() => setShowConfirmation(false)}
            onConfirmationConfirm={() => {
              setShowConfirmation(false);
              handleAnalyze();
            }}
            analysisResult={analysis}
          />
        </div>
      </Card>
    </div>
  );
};

export default SharedAnalysis;