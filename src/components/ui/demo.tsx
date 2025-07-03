
// This is a demo of a preview
// That's what users will see in the preview

import { Hero1 } from "@/components/ui/hero-1";

const DemoOne = () => {
  const sampleQuestions = [
    "What's the best soil pH for cannabis?",
    "How often should I water my plants?",
    "What are the signs of nutrient deficiency?",
    "When should I start flowering?",
    "How to prevent pests naturally?",
    "What's the ideal temperature range?"
  ];

  return (
    <Hero1 
      questions={sampleQuestions}
      onQuestionClick={(question) => console.log('Selected question:', question)}
      onFeedbackClick={() => console.log('Feedback clicked')}
    />
  );
};

// IMPORTANT:
// format of the export MUST be export default { DemoOneOrOtherName }
// if you don't do this, the demo will not be shown
export default { DemoOne };
