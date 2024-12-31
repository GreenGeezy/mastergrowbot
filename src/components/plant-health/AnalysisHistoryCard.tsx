import React from 'react';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Leaf, AlertCircle } from 'lucide-react';
import ShareResults from './ShareResults';

interface AnalysisHistoryCardProps {
  analysis: any;
}

const AnalysisHistoryCard = ({ analysis }: AnalysisHistoryCardProps) => {
  return (
    <Card key={analysis.id} className="p-6 backdrop-blur-lg bg-gray-900/60 border border-gray-800">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">
              {format(new Date(analysis.created_at), 'PPP')}
            </span>
          </div>
          {analysis.issue_resolved && (
            <span className="text-sm text-green-500 flex items-center gap-1">
              <Leaf className="w-4 h-4" />
              Resolved
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.image_urls && Array.isArray(analysis.image_urls) && analysis.image_urls.length > 0 ? (
            analysis.image_urls.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Plant analysis ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))
          ) : analysis.image_url ? (
            <img
              src={analysis.image_url}
              alt="Plant analysis"
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="col-span-3 text-center text-gray-400">
              No images available
            </div>
          )}
        </div>

        {analysis.diagnosis && (
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Diagnosis</h4>
            <p className="text-gray-300">{analysis.diagnosis}</p>
          </div>
        )}

        {analysis.detailed_analysis && (
          <>
            {analysis.detailed_analysis.growth_stage && (
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Growth Stage</h4>
                <p className="text-gray-300">{analysis.detailed_analysis.growth_stage}</p>
              </div>
            )}

            {analysis.detailed_analysis.health_score && (
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Health Score</h4>
                <p className="text-gray-300">{analysis.detailed_analysis.health_score}</p>
              </div>
            )}

            {analysis.detailed_analysis.specific_issues && (
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Specific Issues</h4>
                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-1" />
                    <p className="text-gray-300">{analysis.detailed_analysis.specific_issues}</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {analysis.confidence_level && (
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Confidence Level</h4>
            <Progress 
              value={analysis.confidence_level * 100} 
              className="h-2"
            />
            <p className="text-sm text-gray-400 mt-1">
              {Math.round(analysis.confidence_level * 100)}% confidence
            </p>
          </div>
        )}

        {analysis.recommended_actions && Array.isArray(analysis.recommended_actions) && analysis.recommended_actions.length > 0 && (
          <div>
            <h4 className="text-lg font-medium text-white mb-2">Recommended Actions</h4>
            <ul className="space-y-2">
              {analysis.recommended_actions.map((action: string, index: number) => (
                <li key={index} className="flex items-start gap-2 text-gray-300">
                  <Leaf className="w-5 h-5 text-green-500 mt-1" />
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-4 border-t border-gray-800">
          <ShareResults 
            analysisId={analysis.id} 
            imageUrls={analysis.image_urls || [analysis.image_url]} 
          />
        </div>
      </div>
    </Card>
  );
};

export default AnalysisHistoryCard;