import { Card } from "@/components/ui/card";

interface AnalysisResultsProps {
  analysisResult: {
    image_urls?: string[];
    image_url?: string;
    diagnosis?: string;
    detailed_analysis?: any;
    recommended_actions?: string[];
  };
}

const AnalysisResults = ({ analysisResult }: AnalysisResultsProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Diagnosis</h3>
        <p className="text-gray-300">{analysisResult.diagnosis || 'No diagnosis available'}</p>
      </div>

      {analysisResult.detailed_analysis && (
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
          <pre className="whitespace-pre-wrap text-gray-300">
            {JSON.stringify(analysisResult.detailed_analysis, null, 2)}
          </pre>
        </div>
      )}

      {analysisResult.recommended_actions && (
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Recommended Actions</h3>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            {Array.isArray(analysisResult.recommended_actions) ? (
              analysisResult.recommended_actions.map((action, index) => (
                <li key={index}>{action}</li>
              ))
            ) : (
              <li>No recommended actions available</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AnalysisResults;