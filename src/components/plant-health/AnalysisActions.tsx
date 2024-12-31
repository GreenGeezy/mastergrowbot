import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AnalysisActions = () => {
  const navigate = useNavigate();

  const handleUnleashClick = () => {
    navigate('/');
  };

  return (
    <div className="mt-12 text-center space-y-6 border-t border-gray-800 pt-8">
      <h2 className="text-2xl font-bold text-white">
        Grow Bigger, Grow Better with Master Growbot
      </h2>
      <p className="text-gray-400 max-w-md mx-auto">
        Join thousands of growers optimizing their harvests with advanced AI analysis
      </p>
      <Button 
        onClick={handleUnleashClick}
        size="lg" 
        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transform transition-all duration-300 hover:scale-105"
      >
        Unleash your AI Superpowers Today!
      </Button>
    </div>
  );
};

export default AnalysisActions;