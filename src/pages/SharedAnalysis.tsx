
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, ExternalLink } from 'lucide-react';
import AnalysisResults from '@/components/plant-health/AnalysisResults';
import { motion } from 'framer-motion';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-gray-900/80">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-white text-lg">Loading analysis...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-8 text-center bg-gradient-to-b from-background to-gray-900/80 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">Analysis Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'This analysis may have been removed.'}</p>
          <Button asChild className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover">
            <Link to="/">Return Home</Link>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-background to-gray-900/80 min-h-screen">
      {/* Modern Branded Header */}
      <motion.div 
        className="flex flex-col items-center justify-center mb-12"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="relative flex items-center justify-center w-40 h-40 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-glow via-accent-glow to-secondary-glow rounded-full blur-xl opacity-60"></div>
          <div className="relative bg-card rounded-full p-6 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl">
            <img 
              src="/lovable-uploads/c346bc72-2133-49aa-a5c8-b0773e68ef3b.png" 
              alt="Master Growbot" 
              className="w-28 h-28" 
            />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-glow via-accent to-secondary-glow mb-3 text-center">
          Master Growbot
        </h1>
        <p className="text-xl text-accent max-w-lg text-center mb-6">
          AI-Powered Plant Health Analysis
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <Card className="max-w-6xl mx-auto backdrop-blur-xl bg-gradient-to-br from-gray-900/90 to-gray-800/90 border border-gray-700/50 overflow-hidden shadow-2xl">
          <div className="relative">
            {analysis.image_urls && analysis.image_urls.length > 0 ? (
              <img
                src={analysis.image_urls[0]}
                alt="Plant Analysis"
                className="w-full h-80 object-cover"
              />
            ) : (
              <img
                src={analysis.image_url}
                alt="Plant Analysis"
                className="w-full h-80 object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent"></div>
            <div className="absolute bottom-6 left-6 bg-gradient-to-r from-primary/90 to-secondary/90 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              AI-Powered Analysis
            </div>
          </div>

          <div className="p-8">
            <AnalysisResults analysisResult={analysis} />

            <motion.div 
              className="mt-16 text-center space-y-8 border-t border-gray-700/50 pt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Want AI Analysis for Your Plants?
              </h2>
              <p className="text-gray-300 max-w-lg mx-auto text-lg leading-relaxed">
                Join thousands of growers optimizing their harvests with Master Growbot's advanced AI analysis
              </p>
              <Button 
                onClick={handleUnleashClick}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-10 py-4 rounded-xl text-lg transform transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Try Master Growbot Free <ExternalLink className="ml-3 h-5 w-5" />
              </Button>
            </motion.div>

            <div className="mt-12 flex justify-center">
              <p className="text-sm text-gray-500">
                Analyzed with ❤️ by Master Growbot • 
                <Link to="/" className="underline ml-2 hover:text-accent transition-colors">
                  www.mastergrowbot.com
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default SharedAnalysis;
