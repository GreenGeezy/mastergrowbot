
import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import SuccessShare from "./SuccessShare";
import CommunityShares from "./CommunityShares";

const categories = [
  {
    id: "master-growbot",
    title: "Using Master Growbot",
    description: "Learn how to use our AI-powered platform",
    questions: [
      {
        q: "How do I get started with Master Growbot?",
        a: "Step into the future of cannabis cultivation with Master Growbot's revolutionary AI technology. Our platform offers three groundbreaking features: an advanced AI chat system trained on decades of growing expertise, state-of-the-art Plant Health Analysis powered by computer vision, and an adaptive AI-driven Growing Guide. After a simple sign-up, you'll have instant access to enterprise-grade growing technology previously available only to large agricultural corporations."
      },
      {
        q: "How does the AI chat feature work?",
        a: "Experience conversations with the most advanced Cannabis growing AI assistant ever created. Our system understands complex growing scenarios and provides real-time, expert-level guidance on environment optimization, plant care, and problem resolution. The AI learns from each interaction, adapting its advice to your specific growing context while maintaining a complete history of your growing journey."
      },
      {
        q: "How do I use the Plant Health Analysis feature?",
        a: "Our cutting-edge AI vision technology transforms plant health monitoring. Simply upload clear photos through the Plant Health page to receive instant, professional-grade analysis of your plants' condition. Our AI processes millions of visual data points to identify potential issues before they become visible to the human eye, providing precise, actionable insights that would typically require years of growing expertise."
      }
    ]
  },
  {
    id: "subscription",
    title: "Account & Subscription",
    description: "Information about plans and pricing",
    questions: [
      {
        q: "What subscription options are available?",
        a: "Master Growbot currently offers a limited-time free access period for early adopters while we perfect our AI technology. Our upcoming subscription plans will include: Weekly access - $9.99, Quarterly subscription - $89.99 (Save 25%), or Annual subscription - $199.99 (Save Over 60%). Each subscription clearly communicates the value users receive, including continuous AI improvements, guaranteed secure handling of personal information, premium support, and unlimited access to advanced AI cultivation tools. Your personal data remains secure and confidential regardless of your subscription level."
      },
      {
        q: "Why is Master Growbot priced this way?",
        a: "As the pioneer in cannabis cultivation AI, Master Growbot democratizes access to technology that typically costs large corporations hundreds of thousands annually. Our revolutionary approach combines advanced machine learning, computer vision, and horticultural expertise into an accessible platform for individual growers. By optimizing for longer subscription periods, we ensure continuous AI model improvements while maintaining affordability."
      }
    ]
  },
  {
    id: "growing",
    title: "Growing Guidance",
    description: "Expert growing tips and problem-solving",
    questions: [
      {
        q: "What are the key signs of nutrient deficiencies in cannabis plants?",
        a: "One of the most common symptoms is leaf discoloration, often starting at the lower leaves. Leaves may turn yellow, show brown spots, or develop unusual curling or twisting. Slow growth and weak stems can also indicate a lack of specific nutrients.\n\nNutrient Deficiency Guide:\n- Nitrogen: Yellowing from bottom up, leaves look pale, overall slow growth\n- Phosphorus: Purple/reddish leaf stems, stunted growth and dark leaf patches\n- Potassium: Brown leaf edges/tips, crispy or scorched appearance"
      },
      {
        q: "How do I optimize temperature and humidity through different growth stages?",
        a: "Seedlings and clones generally prefer warmer temperatures (around 70–80°F) and higher humidity (60–70%) to encourage root development. In the vegetative stage, a slightly lower humidity (40–60%) and consistent warmth (70–78°F) helps promote healthy leaves. During flowering, lower humidity (40–50%) and slightly cooler temperatures (65–75°F) help prevent mold and enhance bud quality."
      },
      {
        q: "What are the most reliable indicators that cannabis is ready for harvest?",
        a: "Trichomes (tiny resin glands) that shift from clear to milky or cloudy, with some turning amber, are a top indicator of ripeness. Pistils (the hair-like structures on buds) also darken and curl inward when the plant is near harvest. Many growers also notice that fan leaves may start to yellow as the plant directs energy into bud development."
      },
      {
        q: "How can I identify and prevent common cannabis pests early?",
        a: "Regularly inspect leaves, especially the undersides, for tiny bugs, spots, or webbing. Sticky traps hung near the plants help catch and monitor flying pests like fungus gnats and whiteflies. Introducing natural predators (like ladybugs) or using safe organic sprays early can stop pests from spreading."
      },
      {
        q: "Which metrics should I track to maximize yields and potency?",
        a: "Keep an eye on pH and EC (electrical conductivity) levels to ensure proper nutrient uptake. Monitor temperature and humidity daily to maintain stable conditions. Tracking plant height, bud density, and even terpene profiles can help refine your grow strategies for better yields over time."
      },
      {
        q: "What's the optimal lighting schedule for different growth phases?",
        a: "During the seedling and vegetative phases, cannabis typically thrives with 18–20 hours of light to promote strong leaf and stem growth. In the flowering phase, switching to 12 hours of light and 12 hours of darkness triggers bud development. Some growers use slight variations (like 20/4 or 11/13) to fine-tune growth, but the standard 18/6 and 12/12 schedules remain most popular."
      },
      {
        q: "How do I prevent and address mold issues in cannabis cultivation?",
        a: "Consistent airflow, achieved by using fans or vents, helps reduce moisture buildup on leaves. Keeping humidity lower, especially during flowering (around 40–50%), also makes conditions less inviting for mold. If you spot any moldy buds, remove them immediately and increase ventilation to prevent further spread."
      },
      {
        q: "What's the best approach for nutrient feeding throughout the grow cycle?",
        a: "Begin with light nutrient solutions when plants are small, gradually increasing as they develop more leaves and roots. Maintain a feeding schedule that matches your plants' stage: higher nitrogen during vegetative growth and higher phosphorus/potassium during flowering. Toward the end, many growers flush their plants with plain water for a week or two to improve final taste."
      },
      {
        q: "Which plant training techniques maximize indoor cannabis yields?",
        a: "Low-stress training (LST), which gently bends branches to create an even canopy, helps all parts of the plant receive good light. Topping (snipping the main stem) encourages more branches and bud sites. Techniques like scrogging (using a screen) also help to spread out growth and boost yields."
      },
      {
        q: "How do I maintain consistent phenotypes across multiple grows?",
        a: "The simplest way is to clone a healthy \"mother plant\" with the traits you desire, ensuring the genetic makeup remains the same. Keep environmental conditions—like temperature, humidity, and nutrient levels—as consistent as possible from grow to grow. Document everything (feeding schedule, lighting duration, etc.) so you can recreate successful conditions every time."
      },
      {
        q: "How can Master Growbot help identify plant problems?",
        a: "Master Growbot's proprietary dual-AI approach helps you quickly and accurately identify plant health issues. After uploading photos, our advanced computer vision provides immediate insights, followed by personalized recommendations from our AI assistant. While Master Growbot significantly improves your plant-monitoring accuracy and results, successful cultivation ultimately relies on combining our technology with your attentive care and judgment."
      },
      {
        q: "How do I track my growing progress?",
        a: "Master Growbot securely and privately creates a comprehensive digital timeline of your growing journey, integrating chat histories, health analyses, and guide progress into actionable insights. Your data is protected and always fully controlled by you, and will never be shared or sold without your explicit consent. Our system identifies patterns and trends in your growing data, helping you optimize your techniques and achieve consistent results."
      },
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
    id: "compliance",
    title: "Medical & Legal Compliance",
    description: "Important legal information and disclaimers",
    questions: [
      {
        q: "Does Master Growbot provide medical advice?",
        a: "Master Growbot is a cultivation technology platform and does not provide medical advice or guidance. While our AI can assist with general growing techniques, all medical decisions should be made in consultation with qualified healthcare professionals. Users growing for medical purposes should always follow their healthcare provider's guidance and comply with local medical regulations."
      },
      {
        q: "What are Master Growbot's limitations?",
        a: "Our AI provides sophisticated horticultural guidance but does not: Offer medical, legal, or compliance advice, Guarantee specific outcomes or yields, Replace professional medical or legal consultation. All recommendations are for educational purposes only."
      },
      {
        q: "What are my responsibilities as a user?",
        a: "Users must: Comply with all applicable laws and regulations, Verify the legality of their growing activities, Consult healthcare professionals for medical guidance, Make independent decisions about their cultivation practices, Follow local regulations and guidelines, and manage personal information responsibly in accordance with the Privacy Policy."
      }
    ]
  },
  {
    id: "support",
    title: "Support & Help",
    description: "Get assistance with Master Growbot",
    questions: [
      {
        q: "How can I get help with Master Growbot?",
        a: "We're committed to your success and protecting your privacy. For questions regarding your personal data, privacy rights, technical support, or growing guidance, email us at support@futuristiccannabis.ai. Our dedicated team will promptly assist you."
      },
      {
        q: "What are the important legal disclaimers?",
        a: "Platform Purpose: Master Growbot is a technology platform providing AI-assisted plant cultivation guidance. Any specific plant-related features or examples are for illustrative purposes only. No Professional Advice: Our AI technology provides general horticultural information only. We do not offer legal, medical, compliance, or professional advice. Users must consult qualified professionals for medical, legal, or compliance guidance. User Accountability: Users are solely responsible for verifying and maintaining compliance with all applicable laws and regulations regarding their cultivation activities."
      }
    ]
  }
];

const GuideCategories = ({ searchQuery }: { searchQuery: string }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase().trim();
    
    return categories.map(category => {
      const matchingQuestions = category.questions.filter(qa => 
        qa.q.toLowerCase().includes(query) || 
        qa.a.toLowerCase().includes(query)
      );

      if (matchingQuestions.length === 0) return null;

      return {
        ...category,
        questions: matchingQuestions
      };
    }).filter(Boolean);
  }, [searchQuery]);

  if (filteredCategories.length === 0 && searchQuery.trim()) {
    return (
      <div className="text-center py-8 text-gray-600 animate-fade-in">
        No results found for "{searchQuery}". Try a different search term.
      </div>
    );
  }

  return (
    <div className="grid gap-6 animate-fade-in">
      {filteredCategories.map((category) => (
        <div
          key={category.id}
          className="rounded-xl bg-gray-50 backdrop-blur-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:border-green-400 group"
        >
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-900">{category.title}</h3>
            <p className="text-gray-600 text-sm">{category.description}</p>
          </div>
          
          <Accordion type="single" collapsible className="px-6 pb-6">
            {category.questions.map((qa, index) => (
              <AccordionItem
                key={index}
                value={`${category.id}-${index}`}
                className="border-gray-200"
              >
                <AccordionTrigger className="text-left hover:text-green-600 text-sm py-4 text-gray-900">
                  {qa.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
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
