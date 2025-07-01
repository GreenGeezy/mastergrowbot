
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GuideItem {
  question: string;
  answer: string;
}

interface GuideCategory {
  title: string;
  description: string;
  items: GuideItem[];
}

const guideData: GuideCategory[] = [
  {
    title: "Getting Started",
    description: "Essential basics for new growers",
    items: [
      {
        question: "What equipment do I need to start growing?",
        answer: "For indoor growing, you'll need: grow lights (LED recommended), ventilation system, growing medium (soil or hydro), nutrients, pH testing kit, thermometer/hygrometer, and containers or pots."
      },
      {
        question: "How much space do I need?",
        answer: "A small closet (2x2 feet) can accommodate 1-2 plants, while a dedicated room (4x4 feet) can handle 4-9 plants depending on training methods."
      },
      {
        question: "What's the best growing medium for beginners?",
        answer: "High-quality potting soil is most forgiving for beginners. Look for organic, well-draining soil with perlite. Avoid soils with extended-release fertilizers."
      }
    ]
  },
  {
    title: "Plant Care",
    description: "Nurturing healthy plants",
    items: [
      {
        question: "How often should I water my plants?",
        answer: "Water when the top inch of soil feels dry. Typically every 2-3 days for seedlings, every 1-2 days for vegetative plants, and daily during flowering. Always check soil moisture first."
      },
      {
        question: "What's the ideal temperature and humidity?",
        answer: "Vegetative stage: 70-85°F with 40-70% humidity. Flowering stage: 65-80°F with 40-50% humidity. Maintain good air circulation to prevent mold."
      },
      {
        question: "When should I start nutrients?",
        answer: "Start light nutrients (1/4 strength) after the first set of true leaves appear, usually around week 2-3. Gradually increase as the plant grows."
      }
    ]
  },
  {
    title: "Common Problems",
    description: "Troubleshooting issues",
    items: [
      {
        question: "Why are my leaves turning yellow?",
        answer: "Yellow leaves can indicate overwatering, nutrient deficiency (especially nitrogen), pH imbalance, or natural aging of lower leaves during flowering."
      },
      {
        question: "How do I prevent pests?",
        answer: "Maintain clean growing environment, inspect plants regularly, use sticky traps, ensure good air circulation, and consider beneficial insects like ladybugs."
      },
      {
        question: "What causes nutrient burn?",
        answer: "Nutrient burn occurs from too much fertilizer, causing leaf tips to turn brown and crispy. Flush with plain water and reduce nutrient concentration."
      }
    ]
  },
  {
    title: "Harvest & Curing",
    description: "Finishing your grow",
    items: [
      {
        question: "When is my plant ready to harvest?",
        answer: "Check trichomes with a magnifying glass. Harvest when trichomes are mostly cloudy with some amber. Clear = too early, all amber = past peak."
      },
      {
        question: "How do I dry my harvest?",
        answer: "Hang branches in a dark, well-ventilated area at 60-70°F with 45-55% humidity for 7-14 days until stems snap but don't break completely."
      },
      {
        question: "What's the curing process?",
        answer: "After drying, place buds in airtight jars, filling 75% full. Open jars daily for first week, then weekly. Cure for minimum 2-4 weeks for best flavor and potency."
      }
    ]
  }
];

interface GuideCategoriesProps {
  searchQuery: string;
}

const GuideCategories: React.FC<GuideCategoriesProps> = ({ searchQuery }) => {
  const [openCategories, setOpenCategories] = useState<{ [key: string]: boolean }>({});

  const toggleCategory = (categoryTitle: string) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryTitle]: !prev[categoryTitle]
    }));
  };

  const filteredData = useMemo(() => {
    if (!searchQuery) return guideData;

    return guideData.map(category => ({
      ...category,
      items: category.items.filter(item =>
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.items.length > 0);
  }, [searchQuery]);

  return (
    <div className="space-y-6">
      {filteredData.map((category) => (
        <Card key={category.title} className="bg-card/90 backdrop-blur-sm border-card-foreground/10">
          <Collapsible
            open={openCategories[category.title]}
            onOpenChange={() => toggleCategory(category.title)}
          >
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">{category.title}</CardTitle>
                    <CardDescription className="text-gray-400">{category.description}</CardDescription>
                  </div>
                  {openCategories[category.title] ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  {category.items.map((item, index) => (
                    <div key={index} className="border-l-2 border-accent/30 pl-4">
                      <h4 className="font-medium text-white mb-2">{item.question}</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">{item.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      ))}
    </div>
  );
};

export default GuideCategories;
