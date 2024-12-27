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
        const { data: sharedAnalysis, error: sharedError } = await supabase
          .from('shared_analyses')
          .select('analysis_id')
          .eq('share_token', token)
          .single();

        if (sharedError) throw sharedError;

        const { data: analysis, error: analysisError } = await supabase
          .from('plant_analyses')
          .select('*')
          .eq('id', sharedAnalysis.analysis_id)
          .single();

        if (analysisError) throw analysisError;

        setAnalysis(analysis);
      } catch (error: any) {
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
            <img
              src={analysis.image_url}
              alt="Plant Analysis"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <AnalysisResults analysisResult={analysis} />

          <div className="mt-12 text-center space-y-6 border-t border-gray-800 pt-8">
            <h2 className="text-2xl font-bold text-white">
              Get AI-Powered Plant Analysis
            </h2>
            <p className="text-gray-400 max-w-md mx-auto">
              Join thousands of growers optimizing their harvests with advanced AI analysis
            </p>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link to="/auth">Start Your Free Analysis</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SharedAnalysis;