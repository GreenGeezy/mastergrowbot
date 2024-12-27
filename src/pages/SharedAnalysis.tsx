import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AnalysisResults from '@/components/plant-health/AnalysisResults';

const SharedAnalysis = () => {
  const { token } = useParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        // First get the analysis_id from shared_analyses
        const { data: sharedAnalysis, error: sharedError } = await supabase
          .from('shared_analyses')
          .select('analysis_id')
          .eq('share_token', token)
          .maybeSingle();

        if (sharedError) throw sharedError;
        if (!sharedAnalysis) throw new Error('Shared analysis not found');

        // Then fetch the actual analysis data
        const { data: analysis, error: analysisError } = await supabase
          .from('plant_analyses')
          .select('*')
          .eq('id', sharedAnalysis.analysis_id)
          .maybeSingle();

        if (analysisError) throw analysisError;
        if (!analysis) throw new Error('Analysis data not found');

        setAnalysis(analysis);
      } catch (error: any) {
        console.error('Error fetching shared analysis:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [token]);

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
        <p className="text-gray-400 mb-8">This analysis may have expired or been removed.</p>
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

          <div className="mt-12 text-center space-y-6 border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold text-white">
              Grow Bigger, Grow Better with Master Growbot
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Join thousands of growers optimizing their harvests with advanced AI analysis
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/auth">Unleash your AI Superpowers Today!</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SharedAnalysis;