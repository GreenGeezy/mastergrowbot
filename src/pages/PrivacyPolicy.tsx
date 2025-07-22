
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import FloatingIcons from '@/components/FloatingIcons';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background/80 to-muted/50 flex flex-col">
      {/* Floating Icons */}
      <FloatingIcons />
      
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
            <div className="space-y-6">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Introduction</h2>
                <p>
                  Welcome to Master Growbot's Privacy Policy. Master Growbot is an AI-powered cannabis cultivation 
                  platform designed to help users grow better and improve their cultivation practices through 
                  advanced technology. This Privacy Policy explains how we collect, use, and protect your data 
                  when you use our services.
                </p>
              </section>
              
              {/* Information Collection */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Information Collection</h2>
                <p className="mb-2">We collect the following types of information:</p>
                
                <h3 className="text-xl font-medium mt-4 mb-2">Cultivation-Related Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Growing conditions (humidity, temperature, lighting)</li>
                  <li>Plant health data from image uploads and analyses</li>
                  <li>Chat inputs and questions about cultivation</li>
                  <li>Quiz responses and cultivation preferences</li>
                  <li>User feedback on growing recommendations</li>
                </ul>
                
                <h3 className="text-xl font-medium mt-4 mb-2">Account Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Email address and password (for standard accounts)</li>
                  <li>Information from Google OAuth (name, email, language preference, profile picture)</li>
                  <li>Subscription details for premium members</li>
                </ul>
                
                <h3 className="text-xl font-medium mt-4 mb-2">Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Usage data (features used, time spent, interactions)</li>
                  <li>IP address</li>
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Device information</li>
                  <li>Date and time of visits</li>
                </ul>
              </section>
              
              {/* Use of Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Use of Information</h2>
                <p className="mb-2">We use your information for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Providing and maintaining our services</li>
                  <li>Personalizing your experience with tailored growing recommendations</li>
                  <li>Improving the AI's understanding of cannabis cultivation</li>
                  <li>Offering customer support and addressing technical issues</li>
                  <li>Processing transactions and managing subscriptions</li>
                  <li>Sending service updates and announcements</li>
                  <li>Ensuring the security and integrity of our platform</li>
                  <li>Analyzing usage patterns to enhance our services</li>
                </ul>
              </section>
              
              {/* Sharing of Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Sharing of Information</h2>
                <p className="mb-3">
                  We may share your information with the following third parties:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Google:</strong> For authentication purposes when using Google OAuth.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Companies that assist us in providing our services, 
                    including cloud hosting providers, payment processors, and analytics services.
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, court order, or governmental regulation.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
                  </li>
                  <li>
                    <strong>With Consent:</strong> In other cases with your explicit consent.
                  </li>
                </ul>
                <p className="mt-3">
                  We do not sell your personal information to third parties.
                </p>
              </section>
              
              {/* Data Security */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your data, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure database management</li>
                  <li>Regular backups</li>
                </ul>
                <p className="mt-3">
                  While we strive to protect your information, no method of transmission over the internet 
                  or electronic storage is 100% secure. We cannot guarantee absolute security.
                </p>
              </section>
              
              {/* User Rights - UPDATED SECTION */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">User Rights</h2>
                <p className="mb-3">
                  Depending on your location, you may have certain rights regarding your data:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate or incomplete data</li>
                  <li>Deletion of your personal information</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                  <li>Objection to processing</li>
                </ul>
                <p className="mt-3">
                  Master Growbot respects your privacy and does not share or sell your personal information to third parties without your explicit and affirmative consent. You are always in control of your data. The rights listed above allow you to manage your personal information directly, ensuring your preferences about data use and security are always respected. If you have any questions about exercising your data rights or our commitment to data security, please contact us directly at support@futuristiccannabis.ai.
                </p>
                <p className="mt-3">
                  To exercise any of these rights, please contact us at support@futuristiccannabis.ai.
                </p>
              </section>
              
              {/* Children's Privacy */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Children's Privacy</h2>
                <p>
                  Master Growbot is not intended for children under the age of 18. We do not knowingly 
                  collect personal information from individuals under 18 years of age. If we discover 
                  that a child has provided us with personal information, we will promptly delete it 
                  from our systems.
                </p>
              </section>
              
              {/* Third-Party Links */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Third-Party Links</h2>
                <p>
                  Our service may contain links to third-party websites or services that are not owned 
                  or controlled by Master Growbot. We have no control over and assume no responsibility 
                  for the content, privacy policies, or practices of any third-party websites or services. 
                  We advise you to read the privacy policies of every website you visit.
                </p>
              </section>
              
              {/* Changes to This Policy */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Changes to This Policy</h2>
                <p>
                  We may update our Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last Updated" date. 
                  For significant changes, we may provide additional notice, such as email notifications.
                </p>
                <p className="mt-2">
                  You are advised to review this Privacy Policy periodically for any changes. Changes 
                  to this Privacy Policy are effective when they are posted on this page.
                </p>
              </section>
              
              {/* Alignment with Google's Privacy Policy */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Alignment with Google's Privacy Policy</h2>
                <p>
                  Master Growbot respects user privacy and handles data in accordance with applicable 
                  privacy laws and Google's policies, particularly regarding data obtained through 
                  Google OAuth. We follow Google's API Services User Data Policy for all data received 
                  through Google authentication.
                </p>
              </section>
              
              {/* Disclaimers */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Disclaimers</h2>
                <div className="bg-muted/50 p-4 rounded-md border">
                  <p className="mb-3">
                    <strong>Medical Disclaimer:</strong> Master Growbot is a cultivation technology platform and does not 
                    provide medical advice or guidance. While our AI can assist with general growing techniques, 
                    all medical decisions should be made in consultation with qualified healthcare professionals. 
                    Users growing for medical purposes should always follow their healthcare provider's guidance 
                    and comply with local medical regulations.
                  </p>
                  <p>
                    <strong>General Disclaimer:</strong> Master Growbot is a technology platform providing AI-assisted 
                    plant cultivation guidance. Any specific plant-related features or examples are for illustrative 
                    purposes only. No Professional Advice: Our AI technology provides general horticultural information 
                    only. We do not offer legal, medical, compliance, or professional advice. Users must consult 
                    qualified professionals for medical, legal, or compliance guidance.
                  </p>
                </div>
              </section>
              
              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Contact Information</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy or our data practices, 
                  please contact us at:
                </p>
                <p className="mt-2 font-medium">
                  Email: support@futuristiccannabis.ai
                </p>
              </section>
              
              {/* Last Updated */}
              <section className="mt-8 pt-4 border-t text-muted-foreground text-sm">
                <p>Last Updated: December 8, 2023</p>
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
