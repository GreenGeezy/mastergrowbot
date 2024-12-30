import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const categories = [
  {
    id: "basics",
    title: "Getting Started",
    description: "Essential knowledge for beginners",
    questions: [
      {
        q: "What's the ideal temperature for growing cannabis?",
        a: "The ideal temperature range for growing cannabis is typically between 70-85°F (21-29°C) during the day and slightly cooler at night. This can vary depending on the growth stage and strain."
      },
      {
        q: "How often should I water my plants?",
        a: "Water your plants when the top 1-2 inches of soil feels dry. The frequency depends on factors like pot size, humidity, and growth stage. It's better to underwater than overwater."
      }
    ]
  },
  {
    id: "nutrients",
    title: "Nutrients & Feeding",
    description: "Proper nutrition for healthy growth",
    questions: [
      {
        q: "What nutrients do cannabis plants need?",
        a: "Cannabis plants need macronutrients (N-P-K) and micronutrients. During vegetation, they need more nitrogen, while during flowering, they need more phosphorus and potassium."
      },
      {
        q: "How do I recognize nutrient deficiencies?",
        a: "Common signs include yellowing leaves (nitrogen), purple stems (phosphorus), or brown leaf edges (potassium). Our plant health analyzer can help identify specific issues."
      }
    ]
  },
  {
    id: "problems",
    title: "Troubleshooting",
    description: "Solutions to common growing issues",
    questions: [
      {
        q: "Why are my leaves turning yellow?",
        a: "Yellowing leaves can be caused by various factors including nutrient deficiencies, overwatering, pH imbalance, or natural aging. Use our plant health analyzer for specific diagnosis."
      },
      {
        q: "How do I prevent mold and mildew?",
        a: "Maintain proper airflow, control humidity levels (40-60%), avoid overwatering, and ensure proper plant spacing. Regular monitoring helps catch issues early."
      }
    ]
  }
];

const GuideCategories = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="grid gap-6 animate-fade-in">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-xl bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden transition-all duration-300 hover:border-[#FF69B4]/30 group"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
            <p className="text-gray-300 text-sm">{category.description}</p>
          </div>
          
          <Accordion type="single" collapsible className="px-6 pb-6">
            {category.questions.map((qa, index) => (
              <AccordionItem
                key={index}
                value={`${category.id}-${index}`}
                className="border-white/10"
              >
                <AccordionTrigger className="text-left hover:text-[#FF69B4] text-sm py-4">
                  {qa.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-sm leading-relaxed">
                  {qa.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}
    </div>
  );
};

export default GuideCategories;