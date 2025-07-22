
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AuroraBackground } from "@/components/ui/aurora-background";

const TermsOfService = () => {
  return (
    <AuroraBackground className="min-h-screen flex flex-col">
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
            <div className="space-y-6">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Introduction</h2>
                <p>
                  Welcome to Master Growbot's Terms of Service. Master Growbot is an AI-powered cannabis cultivation 
                  platform designed to help users grow better and improve their cultivation practices through 
                  advanced technology. These terms govern your use of our services.
                </p>
              </section>
              
              {/* Acceptance of Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Acceptance of Terms</h2>
                <p>
                  By accessing or using Master Growbot, you acknowledge that you have read, understood, and agree 
                  to be bound by these Terms of Service. If you do not agree to these terms, please do not use 
                  our services. Your continued use of Master Growbot constitutes your ongoing acceptance of these terms.
                </p>
              </section>
              
              {/* Description of Service */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Description of Service</h2>
                <p>
                  Master Growbot provides the following features and functionality:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>AI-powered guidance and recommendations for cannabis cultivation</li>
                  <li>Plant health analysis through image recognition technology</li>
                  <li>Comprehensive growing guides and educational resources</li>
                  <li>Personalized cultivation insights based on user inputs and preferences</li>
                  <li>Community sharing features for cultivation experiences</li>
                </ul>
                <p className="mt-3">
                  We may update, modify, or enhance our services at any time without prior notice.
                </p>
              </section>
              
              {/* User Responsibilities */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">User Responsibilities</h2>
                <p className="mb-3">
                  As a user of Master Growbot, you are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Legal Compliance:</strong> Complying with all applicable local, state, and federal laws and 
                    regulations regarding cannabis cultivation and use. Master Growbot does not promote 
                    illegal activities and assumes users are operating within their legal jurisdiction.
                  </li>
                  <li>
                    <strong>Legality Verification:</strong> Independently verifying the legality of your growing activities 
                    in your jurisdiction. Laws vary widely across different locations, and it is solely your 
                    responsibility to understand and adhere to the laws that apply to you.
                  </li>
                  <li>
                    <strong>Medical Consultation:</strong> Consulting qualified healthcare professionals for any medical 
                    guidance related to cannabis use or cultivation for medical purposes. Master Growbot 
                    does not provide medical advice.
                  </li>
                  <li>
                    <strong>Independent Decision-Making:</strong> Making your own independent decisions about your cultivation 
                    practices. While our AI provides guidance, you are ultimately responsible for the actions 
                    you take based on our recommendations.
                  </li>
                  <li>
                    <strong>Regulatory Adherence:</strong> Following local regulations and guidelines regarding plant counts, 
                    cultivation licenses, and any other regulatory requirements in your area.
                  </li>
                  <li>
                    <strong>Account Security:</strong> Maintaining the security of your account credentials and notifying 
                    us immediately of any unauthorized access to your account.
                  </li>
                  <li>
                    <strong>Ethical Use:</strong> Using the service in an ethical manner that respects the rights and 
                    well-being of others.
                  </li>
                </ul>
              </section>
              
              {/* Limitations of Master Growbot */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Limitations of Master Growbot</h2>
                <p className="mb-3">
                  It is important to understand that Master Growbot has the following limitations:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>No Medical, Legal, or Compliance Advice:</strong> Master Growbot does not provide medical, 
                    legal, or compliance advice. Our recommendations are for educational and informational 
                    purposes only.
                  </li>
                  <li>
                    <strong>No Guaranteed Outcomes:</strong> We cannot guarantee specific outcomes, yields, or results 
                    from following our recommendations. Plant cultivation involves numerous variables beyond 
                    our control.
                  </li>
                  <li>
                    <strong>Not a Substitute for Professional Consultation:</strong> Our service is not a substitute for 
                    consultation with healthcare professionals, legal experts, or compliance specialists. 
                    Users should seek appropriate professional advice for specific concerns.
                  </li>
                  <li>
                    <strong>Educational Purpose Only:</strong> All content, recommendations, and analyses provided by 
                    Master Growbot are for educational purposes only and should be considered general guidance 
                    rather than definitive instructions.
                  </li>
                  <li>
                    <strong>AI Limitations:</strong> Our AI technology, while advanced, has inherent limitations and 
                    may not account for all possible variables in your specific growing environment.
                  </li>
                </ul>
              </section>
              
              {/* Intellectual Property */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Intellectual Property</h2>
                <p>
                  Master Growbot and all its content, features, and functionality are owned by us and are protected 
                  by intellectual property rights, including but not limited to trademarks, copyrights, and trade 
                  secrets. You may not reproduce, distribute, modify, create derivative works of, publicly display, 
                  publicly perform, republish, download, store, or transmit any materials from our service without 
                  our prior written consent, except for temporary storage in your computer's cache memory during 
                  your personal use of the service.
                </p>
                <p className="mt-3">
                  Any user-generated content that you submit to Master Growbot remains your property. However, by 
                  submitting such content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
                  reproduce, adapt, publish, translate, and distribute it in connection with our service and for 
                  improving our AI capabilities.
                </p>
              </section>
              
              {/* Disclaimer of Warranties */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Disclaimer of Warranties</h2>
                <p className="uppercase font-medium">
                  THE MASTER GROWBOT SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, 
                  EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, 
                  INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, 
                  NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.
                </p>
                <p className="mt-3 uppercase font-medium">
                  WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE, OR THAT 
                  ANY DEFECTS WILL BE CORRECTED. WE DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES REGARDING THE ACCURACY, 
                  RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE CONTENT PROVIDED THROUGH THE SERVICE.
                </p>
              </section>
              
              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Limitation of Liability</h2>
                <p className="uppercase font-medium">
                  TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MASTER GROWBOT, ITS AFFILIATES, 
                  DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, 
                  CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL, 
                  USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF, OR INABILITY TO USE, 
                  THE SERVICE.
                </p>
                <p className="mt-3 uppercase font-medium">
                  IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU TO US FOR 
                  THE SERVICE DURING THE TWELVE (12) MONTH PERIOD PRIOR TO THE ACT GIVING RISE TO LIABILITY.
                </p>
                <p className="mt-3">
                  SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF 
                  LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT 
                  APPLY TO YOU.
                </p>
              </section>
              
              {/* Indemnification */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless Master Growbot, its affiliates, officers, directors, 
                  employees, consultants, agents, and representatives from and against any and all claims, liabilities, 
                  damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that such parties may 
                  incur as a result of or arising from your violation of these Terms of Service, your use of the Service, 
                  or your violation of any rights of any other person or entity.
                </p>
              </section>
              
              {/* Termination */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your access to Master Growbot, without prior notice or 
                  liability, for any reason whatsoever, including, without limitation, if you breach these Terms of Service. 
                  Upon termination, your right to use the service will immediately cease.
                </p>
                <p className="mt-3">
                  All provisions of these Terms of Service which by their nature should survive termination shall survive 
                  termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and 
                  limitations of liability.
                </p>
              </section>
              
              {/* Governing Law */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Governing Law</h2>
                <p>
                  These Terms of Service shall be governed by and construed in accordance with the laws of the State of 
                  California, without regard to its conflict of law principles. Any legal action or proceeding arising 
                  under these Terms shall be brought exclusively in the federal or state courts located in San Francisco 
                  County, California, and you hereby consent to the personal jurisdiction and venue therein.
                </p>
              </section>
              
              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Changes to Terms</h2>
                <p>
                  We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time. 
                  If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. 
                  What constitutes a material change will be determined at our sole discretion.
                </p>
                <p className="mt-3">
                  By continuing to access or use our service after any revisions become effective, you agree to be bound 
                  by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.
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
                  <p className="mb-3">
                    <strong>General Disclaimer:</strong> Master Growbot is a technology platform providing AI-assisted 
                    plant cultivation guidance. Any specific plant-related features or examples are for illustrative 
                    purposes only. No Professional Advice: Our AI technology provides general horticultural information 
                    only. We do not offer legal, medical, compliance, or professional advice. Users must consult 
                    qualified professionals for medical, legal, or compliance guidance. 
                  </p>
                  <p>
                    <strong>User Accountability:</strong> Users are solely responsible for verifying and maintaining 
                    compliance with all applicable laws and regulations regarding their cultivation activities.
                  </p>
                </div>
              </section>
              
              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-semibold mb-3 text-primary/90">Contact Information</h2>
                <p>
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="mt-2 font-medium">
                  Email: support@futuristiccannabis.ai
                </p>
              </section>
              
              {/* Last Updated */}
              <section className="mt-8 pt-4 border-t text-muted-foreground text-sm">
                <p>Last Updated: April 29, 2024</p>
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
    </AuroraBackground>
  );
};

export default TermsOfService;
