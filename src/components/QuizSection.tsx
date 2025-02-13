
import { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface QuizFormData {
  environment: string;
  experience: string;
  goals: string;
  medium: string;
  spaceSize: string;
}

interface QuizSectionProps {
  onQuizSubmit: () => void;
}

export default function QuizSection({ onQuizSubmit }: QuizSectionProps) {
  const [formData, setFormData] = useState<QuizFormData>({
    environment: '',
    experience: '',
    goals: '',
    medium: '',
    spaceSize: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we would typically save the quiz data to the database
    // For now, we'll just trigger the visibility change
    onQuizSubmit();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-2xl space-y-8 bg-card p-8 rounded-lg border border-border/50">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gradient-primary tech-font">
            Welcome to Master Growbot! 🌱
          </h1>
          <p className="text-lg text-gray-400">
            Answer a few quick questions to personalize your experience and unlock access to Master Growbot.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="environment">What is your primary growing environment?</Label>
              <Select
                required
                value={formData.environment}
                onValueChange={(value) => setFormData(prev => ({ ...prev, environment: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select environment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indoor">Indoor</SelectItem>
                  <SelectItem value="outdoor">Outdoor</SelectItem>
                  <SelectItem value="greenhouse">Greenhouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">What is your experience level with cannabis cultivation?</Label>
              <Select
                required
                value={formData.experience}
                onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">What are your primary goals for using Master Growbot?</Label>
              <Input
                id="goals"
                required
                placeholder="Enter your goals"
                value={formData.goals}
                onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
                className="bg-background"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medium">What type of growing medium do you use or plan to use?</Label>
              <Select
                required
                value={formData.medium}
                onValueChange={(value) => setFormData(prev => ({ ...prev, medium: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select growing medium" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="soil">Soil</SelectItem>
                  <SelectItem value="hydroponics">Hydroponics</SelectItem>
                  <SelectItem value="coco">Coco Coir</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spaceSize">What is your typical grow space size (approximate)?</Label>
              <Input
                id="spaceSize"
                required
                placeholder="E.g., 4x4 feet, 10x10 feet"
                value={formData.spaceSize}
                onChange={(e) => setFormData(prev => ({ ...prev, spaceSize: e.target.value }))}
                className="bg-background"
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300"
          >
            Submit Answers
          </Button>
        </form>
      </div>
    </div>
  );
}
