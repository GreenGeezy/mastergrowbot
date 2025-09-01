
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Particles } from '@/components/ui/particles';

const PrivacyPolicy = () => {
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
          <h1 className="text-3xl font-bold mb-6 text-primary border-b pb-2">Privacy Policy</h1>
          
          <ScrollArea className="h-[calc(100vh-250px)] pr-4">
            <div className="prose max-w-none space-y-6">
              {/* Introduction */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Introduction</h2>
                <p className="text-left leading-relaxed">
                  Welcome to Master Growbot's Privacy Policy. Master Growbot is an AI-powered horticulture and plant health platform that helps users improve their cultivation practices through advanced technology. The service may be applied to a wide range of crops, including cannabis where legally permitted. This Privacy Policy explains how we collect, use, and protect your data when you use our services.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Important Legal Notice */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Important Legal Notice</h2>
                <p className="text-left leading-relaxed">
                  Master Growbot is intended only for use in jurisdictions where cultivation of cannabis is legal. Users are solely responsible for verifying and complying with local laws. The service is strictly educational and does not promote or encourage illegal activity.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Information We Collect */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Information We Collect</h2>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Cultivation-Related Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>Growing conditions (humidity, temperature, lighting)</li>
                  <li>Plant health data from image uploads and analyses</li>
                  <li>Chat inputs and cultivation questions</li>
                  <li>Quiz responses and cultivation preferences</li>
                  <li>User feedback on recommendations</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Account Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>Email address and password (for standard accounts)</li>
                  <li>Google OAuth data (name, email, language preference, profile picture)</li>
                  <li>Subscription details for premium members (via Apple In-App Purchase on iOS devices)</li>
                </ul>
                
                <h3 className="text-lg font-semibold mt-6 mb-3">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>Usage data (features used, time spent, interactions)</li>
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system and device information</li>
                  <li>Date and time of visits</li>
                </ul>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* How We Use Information */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">How We Use Information</h2>
                <p className="text-left leading-relaxed mb-4">We use your information to:</p>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>Provide and maintain our services</li>
                  <li>Personalize your experience with tailored recommendations</li>
                  <li>Improve the AI's understanding of plant cultivation, including cannabis where legally permitted</li>
                  <li>Offer customer support and resolve technical issues</li>
                  <li>Process transactions and manage subscriptions</li>
                  <li>Send service updates and announcements</li>
                  <li>Ensure platform security and integrity</li>
                  <li>Analyze usage patterns to improve performance</li>
                </ul>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Sharing of Information */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Sharing of Information</h2>
                <p className="text-left leading-relaxed mb-4">
                  We may share your information only as follows:
                </p>
                <ul className="list-disc pl-6 space-y-3 text-left">
                  <li>
                    <strong>Google:</strong> For authentication through Google OAuth
                  </li>
                  <li>
                    <strong>Service Providers:</strong> For hosting, analytics, and payment processing
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, court order, or government regulation
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong>With Consent:</strong> In other cases with your explicit consent
                  </li>
                </ul>
                <p className="mt-4 text-left leading-relaxed">
                  We never sell personal information to third parties.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Data Security */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Data Security</h2>
                <p className="text-left leading-relaxed mb-4">
                  We use industry-standard measures, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>Encryption of sensitive data</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure database management</li>
                  <li>Regular backups and security assessments</li>
                </ul>
                <p className="mt-4 text-left leading-relaxed">
                  No method of internet transmission or storage is 100% secure, and we cannot guarantee absolute protection.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* User Rights */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">User Rights</h2>
                <p className="text-left leading-relaxed mb-4">
                  Depending on your location, you may have rights to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-left">
                  <li>Access, correct, or delete your personal information</li>
                  <li>Restrict or object to processing</li>
                  <li>Request data portability</li>
                </ul>
                <p className="mt-4 text-left leading-relaxed">
                  To exercise these rights, contact us at <span className="font-medium">support@futuristiccannabis.ai</span>.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Children's Privacy */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Children's Privacy</h2>
                <p className="text-left leading-relaxed">
                  Master Growbot is not intended for individuals under 18 years of age. We do not knowingly collect personal information from minors. Users must confirm they are 18 or older before accessing the service. If we learn a child has provided information, we will delete it immediately.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Third-Party Links */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Third-Party Links</h2>
                <p className="text-left leading-relaxed">
                  Our service may link to external websites. We are not responsible for their content or privacy practices. Please review third-party policies before using those services.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Changes to This Policy */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Changes to This Policy</h2>
                <p className="text-left leading-relaxed">
                  We may update this Privacy Policy from time to time. Updates will be posted on this page with a revised "Last Updated" date. Significant changes may also be sent by email.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Compliance with Google & Apple Policies */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Compliance with Google & Apple Policies</h2>
                <p className="text-left leading-relaxed">
                  Master Growbot complies with applicable privacy laws, Google's API Services User Data Policy (for Google OAuth), and Apple's App Store requirements for in-app subscriptions and data handling. On iOS, all digital subscriptions are processed through Apple's In-App Purchase system.
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Disclaimers */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Disclaimers</h2>
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <p className="mb-4 text-left leading-relaxed">
                    <strong>Medical Disclaimer:</strong> Master Growbot provides cultivation technology and general plant health information only. It does not provide medical advice. Users cultivating for medical purposes must follow licensed healthcare provider guidance and local medical regulations.
                  </p>
                  <p className="text-left leading-relaxed">
                    <strong>General Disclaimer:</strong> All recommendations are educational. We do not provide legal, compliance, or professional advice. Users must independently verify legality and compliance before acting.
                  </p>
                </div>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Contact Information */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Contact Information</h2>
                <p className="text-left leading-relaxed mb-2">
                  For questions about this Privacy Policy, please contact:
                </p>
                <p className="text-left leading-relaxed font-medium">
                  📧 Email: support@futuristiccannabis.ai
                </p>
                <div className="border-b border-gray-200 my-6"></div>
              </section>
              
              {/* Last Updated */}
              <section className="text-center">
                <p className="text-muted-foreground text-sm mb-2">Last Updated: September 2025</p>
                <p className="text-muted-foreground text-sm">© 2025 MasterGrowbot AI. All rights reserved.</p>
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

export default PrivacyPolicy;
