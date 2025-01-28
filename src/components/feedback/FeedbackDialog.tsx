import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const IMPROVEMENT_AREAS = [
  "AI Chat Responses",
  "Plant Health Analysis",
  "Growing Guide Content",
  "App Reliability/Speed",
  "Other"
];

const FeedbackDialog = ({ isOpen, onOpenChange }: FeedbackDialogProps) => {
  const session = useSession();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBetaEmail, setShowBetaEmail] = useState(false);
  const [formData, setFormData] = useState({
    mainImprovementArea: "",
    otherImprovement: "",
    growingEffectivenessRating: 0,
    recommendationRating: 0,
    whatsWorking: "",
    biggestChallenge: "",
    betaTestingEmail: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("user_feedback").insert([
        {
          user_id: session?.user?.id,
          main_improvement_area: formData.mainImprovementArea === "Other" 
            ? formData.otherImprovement 
            : formData.mainImprovementArea,
          other_improvement_details: formData.mainImprovementArea === "Other" 
            ? formData.otherImprovement 
            : null,
          growing_effectiveness_rating: formData.growingEffectivenessRating,
          recommendation_rating: formData.recommendationRating,
          whats_working: formData.whatsWorking,
          biggest_challenge: formData.biggestChallenge,
          beta_testing_email: showBetaEmail ? formData.betaTestingEmail : null,
        },
      ]);

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve Master Growbot for everyone.",
      });

      // Reset form and close dialog
      setFormData({
        mainImprovementArea: "",
        otherImprovement: "",
        growingEffectivenessRating: 0,
        recommendationRating: 0,
        whatsWorking: "",
        biggestChallenge: "",
        betaTestingEmail: "",
      });
      setShowBetaEmail(false);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderRatingOptions = (name: string, value: number, onChange: (value: number) => void) => (
    <div className="flex gap-4">
      {[1, 2, 3, 4, 5].map((rating) => (
        <label key={rating} className="flex items-center gap-2">
          <RadioGroupItem
            value={rating.toString()}
            checked={value === rating}
            onClick={() => onChange(rating)}
          />
          <span>{rating}</span>
        </label>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-gray-900 border border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white">Help Us Improve Master Growbot</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-white">What's the most important thing we could improve?</Label>
            <RadioGroup
              value={formData.mainImprovementArea}
              onValueChange={(value) => setFormData({ ...formData, mainImprovementArea: value })}
              className="space-y-2"
            >
              {IMPROVEMENT_AREAS.map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <RadioGroupItem value={area} id={area} />
                  <Label htmlFor={area} className="text-white">{area}</Label>
                </div>
              ))}
            </RadioGroup>
            
            {formData.mainImprovementArea === "Other" && (
              <Input
                placeholder="Please specify..."
                value={formData.otherImprovement}
                onChange={(e) => setFormData({ ...formData, otherImprovement: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white">How effectively did Master Growbot help your growing process?</Label>
              <div className="mt-2">
                {renderRatingOptions(
                  "growingEffectiveness",
                  formData.growingEffectivenessRating,
                  (value) => setFormData({ ...formData, growingEffectivenessRating: value })
                )}
              </div>
            </div>

            <div>
              <Label className="text-white">How likely are you to recommend Master Growbot to other growers?</Label>
              <div className="mt-2">
                {renderRatingOptions(
                  "recommendation",
                  formData.recommendationRating,
                  (value) => setFormData({ ...formData, recommendationRating: value })
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-white">What's working best for you?</Label>
              <Textarea
                value={formData.whatsWorking}
                onChange={(e) => setFormData({ ...formData, whatsWorking: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>

            <div>
              <Label className="text-white">What's your biggest frustration or challenge?</Label>
              <Textarea
                value={formData.biggestChallenge}
                onChange={(e) => setFormData({ ...formData, biggestChallenge: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white mt-2"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="beta-testing"
                checked={showBetaEmail}
                onCheckedChange={(checked) => setShowBetaEmail(checked as boolean)}
              />
              <Label htmlFor="beta-testing" className="text-white">Join Beta Testing Program</Label>
            </div>

            {showBetaEmail && (
              <Input
                type="email"
                placeholder="Your email for beta updates"
                value={formData.betaTestingEmail}
                onChange={(e) => setFormData({ ...formData, betaTestingEmail: e.target.value })}
                className="bg-gray-800 border-gray-700 text-white"
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;