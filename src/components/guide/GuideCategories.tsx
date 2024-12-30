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
        a: "Master Growbot currently offers a limited-time free access period for early adopters while we perfect our AI technology. Our upcoming subscription plans will include: Weekly access ($9.99), Quarterly subscription ($89.99), or Annual subscription ($199.99). Each tier provides unlimited access to our enterprise-grade AI technology suite."
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
        q: "How can Master Growbot help identify plant problems?",
        a: "Our proprietary dual-AI approach sets new standards in plant health monitoring. The process begins with our advanced computer vision system analyzing your uploads for immediate insights, followed by our expert AI chat system providing detailed recommendations by leveraging powerful machine learning technology with Master Growbot's vast knowledge of how to grow the world's best cannabis and optimize profits. This revolutionary combination delivers professional-grade diagnostics and personalized solutions previously unavailable to individual growers."
      },
      {
        q: "How do I track my growing progress?",
        a: "Master Growbot's AI creates a comprehensive digital timeline of your growing journey, integrating chat histories, health analyses, and guide progress into actionable insights. Our system identifies patterns and trends in your growing data, helping you optimize your techniques and achieve consistent results."
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
        a: "Users must: Comply with all applicable laws and regulations, Verify the legality of their growing activities, Consult healthcare professionals for medical guidance, Make independent decisions about their cultivation practices, Follow local regulations and guidelines."
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
        a: "We're committed to your success with our platform. For any questions, technical support, or guidance, email us at support@futuristiccannabis.ai. Our dedicated team will respond promptly to help you maximize the benefits of our AI technology."
      },
      {
        q: "What are the important legal disclaimers?",
        a: "Platform Purpose: Master Growbot is a technology platform providing AI-assisted plant cultivation guidance. Any specific plant-related features or examples are for illustrative purposes only. No Professional Advice: Our AI technology provides general horticultural information only. We do not offer legal, medical, compliance, or professional advice. Users must consult qualified professionals for medical, legal, or compliance guidance. User Accountability: Users are solely responsible for verifying and maintaining compliance with all applicable laws and regulations regarding their cultivation activities."
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