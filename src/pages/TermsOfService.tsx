
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Particles } from '@/components/ui/particles';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background/80 to-muted/50 flex flex-col">
      {/* Particles Background */}
      <Particles
        className="absolute inset-0"
        quantity={20}
        ease={80}
        color="#22c55e"
        size={4}
        refresh
      />
      
      {/* Header */}
      <header className="w-full py-4 px-6 border-b bg-card/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/a72be8e9-0fb6-49e8-985d-127ba951fee7.png" 
              alt="Master Growbot Logo" 
              className="w-10 h-10" 
            />
            <span className="font-bold text-xl text-primary">Master Growbot</span>
          </Link>
          <Link to="/">
            <Button variant="outline">Return Home</Button>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8">
        <div className="bg-card border rounded-lg shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6 text-primary border-b pb-2">Terms of Service</h1>
          
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="prose max-w-none space-y-6">
              {/* Introduction */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Introduction</h2>
                <p className="text-left leading-relaxed">
                  Welcome to Master Growbot's Terms of Service. Master Growbot is an AI-powered horticulture and plant health platform designed to help users improve cultivation practices through advanced technology. The service may be applied to a wide range of crops, including cannabis where legally permitted. These terms govern your use of our services.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Important Legal Notice */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Important Legal Notice</h2>
                <p className="text-left leading-relaxed">
                  Master Growbot is intended only for individuals in jurisdictions where cultivation of cannabis is legal. Users are solely responsible for verifying legality and compliance with all applicable local, state, and federal laws before using the service. The platform is strictly educational and does not promote or encourage illegal activity.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Acceptance of Terms</h2>
                <p className="text-left leading-relaxed">
                  By accessing or using Master Growbot, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree, do not use our services. Continued use constitutes ongoing acceptance.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Description of Service */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Description of Service</h2>
                <p className="text-left leading-relaxed mb-4">Master Growbot provides:</p>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>AI-powered plant health guidance and cultivation insights</li>
                  <li>Plant analysis through image recognition</li>
                  <li>Growing guides and educational resources</li>
                  <li>Personalized cultivation insights based on user inputs</li>
                  <li>Community features for sharing experiences</li>
                </ul>
                <p className="mt-4 text-left leading-relaxed">
                  We may update, enhance, or modify services at any time.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* User Responsibilities */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">User Responsibilities</h2>
                <p className="text-left leading-relaxed mb-4">As a user, you agree to:</p>
                <ul className="list-disc pl-6 space-y-3 text-left">
                  <li>
                    <strong>Legal Compliance:</strong> Follow all applicable laws regarding cultivation and use.
                  </li>
                  <li>
                    <strong>Legality Verification:</strong> Confirm that cultivation is legal in your jurisdiction.
                  </li>
                  <li>
                    <strong>Medical Consultation:</strong> Consult licensed healthcare professionals for medical guidance.
                  </li>
                  <li>
                    <strong>Independent Decision-Making:</strong> Use AI recommendations as guidance only.
                  </li>
                  <li>
                    <strong>Regulatory Adherence:</strong> Comply with plant counts, licenses, or other local regulations.
                  </li>
                  <li>
                    <strong>Account Security:</strong> Protect your credentials and notify us of unauthorized use.
                  </li>
                  <li>
                    <strong>Ethical Use:</strong> Use the service responsibly and respectfully.
                  </li>
                </ul>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Limitations of Master Growbot */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Limitations of Master Growbot</h2>
                <ul className="list-disc pl-6 space-y-3 text-left">
                  <li>
                    <strong>No Medical, Legal, or Compliance Advice:</strong> Information is educational only.
                  </li>
                  <li>
                    <strong>No Guaranteed Outcomes:</strong> Cultivation depends on many variables beyond our control.
                  </li>
                  <li>
                    <strong>Not a Substitute for Professionals:</strong> Always seek expert advice for medical, legal, or compliance concerns.
                  </li>
                  <li>
                    <strong>Educational Purpose Only:</strong> All AI insights are for learning and general guidance.
                  </li>
                  <li>
                    <strong>AI Limitations:</strong> AI cannot account for all conditions in every grow environment.
                  </li>
                </ul>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Intellectual Property */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Intellectual Property</h2>
                <p className="text-left leading-relaxed mb-4">
                  All content, features, and functionality of Master Growbot are our property and protected by intellectual property laws.
                </p>
                <p className="text-left leading-relaxed">
                  User-generated content remains your property, but by submitting it, you grant Master Growbot a worldwide, royalty-free license to use and improve the platform.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Disclaimer of Warranties */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Disclaimer of Warranties</h2>
                <p className="text-left leading-relaxed">
                  Master Growbot is provided "as is" without warranties of any kind. We do not guarantee uninterrupted, error-free service, or specific results.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Limitation of Liability */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Limitation of Liability</h2>
                <p className="text-left leading-relaxed">
                  To the maximum extent permitted by law, Master Growbot is not liable for indirect, incidental, or consequential damages. Liability is limited to amounts you paid in the 12 months preceding the claim.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Indemnification */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Indemnification</h2>
                <p className="text-left leading-relaxed">
                  You agree to indemnify and hold harmless Master Growbot and its affiliates against claims arising from your use of the service or violation of these terms.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Termination */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Termination</h2>
                <p className="text-left leading-relaxed">
                  We may suspend or terminate access at any time if terms are violated. Provisions such as disclaimers, indemnity, and liability limits survive termination.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Governing Law */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Governing Law</h2>
                <p className="text-left leading-relaxed">
                  These terms are governed by California law. Any disputes will be resolved exclusively in San Francisco County courts.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Changes to Terms */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Changes to Terms</h2>
                <p className="text-left leading-relaxed">
                  We may revise these terms at any time. Material changes will be announced at least 30 days before taking effect. Continued use after revisions indicates acceptance.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Compliance with Apple In-App Purchases */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Compliance with Apple In-App Purchases</h2>
                <p className="text-left leading-relaxed">
                  On iOS devices, all digital subscriptions and in-app services are processed exclusively through Apple's In-App Purchase system, in accordance with App Store guidelines.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Disclaimers */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Disclaimers</h2>
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <p className="mb-4 text-left leading-relaxed">
                    <strong>Medical Disclaimer:</strong> We provide cultivation technology and general plant health information only. We do not provide medical advice.
                  </p>
                  <p className="mb-4 text-left leading-relaxed">
                    <strong>General Disclaimer:</strong> All content is educational and not a substitute for professional advice.
                  </p>
                  <p className="text-left leading-relaxed">
                    <strong>User Accountability:</strong> You are solely responsible for compliance with all applicable laws regarding cultivation.
                  </p>
                </div>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Contact Information */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Contact Information</h2>
                <p className="text-left leading-relaxed font-medium">
                  📧 Email: support@futuristiccannabis.ai
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Last Updated */}
              <section className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Last Updated: September 2025</p>
                <p className="text-muted-foreground text-sm">© 2025 Master Growbot. All rights reserved.</p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-4 px-6 border-t bg-card/60 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Master Growbot. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default TermsOfService;
