
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import SEOHead from "@/components/SEOHead";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col font-sans">
      <SEOHead
        title="Terms of Service | MasterGrowbot AI"
        description="MasterGrowbot AI terms of service and usage agreement for the iOS and Android cannabis cultivation app."
        canonicalUrl="https://www.mastergrowbot.com/terms-of-service"
      />

      <LandingNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Apple/Google note banner */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 px-4 py-3 bg-[#1a1e26] border border-white/[0.07] rounded-xl">
          <span className="text-sm text-white/50">
            <span className="text-landing-green font-medium">App Store:</span> Support URL is{' '}
            <span className="text-white/70">mastergrowbot.com/contact</span>
          </span>
          <span className="text-sm text-white/50">
            <span className="text-landing-green font-medium">Privacy Policy URL:</span>{' '}
            <span className="text-white/70">mastergrowbot.com/privacy-policy</span>
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-1 text-white tracking-tight">Terms of Service</h1>
        <p className="text-white/35 text-sm mb-10">Last Updated: April 17, 2026</p>

        <div className="space-y-10">

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Introduction</h2>
            <p className="text-white/60 leading-relaxed">
              Welcome to MasterGrowbot AI's Terms of Service. MasterGrowbot AI is an AI-powered cannabis cultivation
              platform designed to help users grow better and improve their cultivation practices through
              advanced technology. These terms govern your use of our services.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Acceptance of Terms</h2>
            <p className="text-white/60 leading-relaxed">
              By accessing or using MasterGrowbot AI, you acknowledge that you have read, understood, and agree
              to be bound by these Terms of Service. If you do not agree to these terms, please do not use
              our services. Your continued use of MasterGrowbot AI constitutes your ongoing acceptance of these terms.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Description of Service</h2>
            <p className="text-white/60 mb-3">
              "Service" or "App" refers to the MasterGrowbot AI platform, including the MasterGrowbot AI mobile
              application available on the Apple App Store and Google Play Store, as well as the web application
              accessible at mastergrowbot.com.
            </p>
            <p className="text-white/60 mb-3">MasterGrowbot AI provides the following features and functionality:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/60">
              <li>AI-powered guidance and recommendations for cannabis cultivation</li>
              <li>Plant health analysis through image recognition technology</li>
              <li>Comprehensive growing guides and educational resources</li>
              <li>Personalized cultivation insights based on user inputs and preferences</li>
              <li>Community sharing features for cultivation experiences</li>
            </ul>
            <p className="mt-4 text-white/60">
              We may update, modify, or enhance our services at any time without prior notice.
            </p>
          </section>

          {/* Mobile Application License */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Mobile Application License</h2>
            <p className="text-white/60 leading-relaxed">
              Subject to your compliance with these Terms, MasterGrowbot AI grants you a limited, non-exclusive,
              non-transferable, revocable license to download and use a copy of the App on a mobile device
              that you own or control. This license does not give you any ownership rights in the App or
              its content.
            </p>
            <p className="mt-3 text-white/60">
              You may not: (a) copy, modify, or distribute the App; (b) reverse engineer, decompile, or
              disassemble the App; (c) rent, lease, lend, sell, or sublicense the App; or (d) use the App
              for any unlawful purpose.
            </p>
          </section>

          {/* App Store Specific Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">App Store Specific Terms</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-base font-semibold mb-2 text-white/80">Apple App Store</h3>
                <p className="text-white/60 leading-relaxed">
                  If you downloaded the App from the Apple App Store, you agree to use the App only on an
                  Apple-branded product running iOS and as permitted by the "Usage Rules" in the Apple Media
                  Services Terms. You acknowledge that Apple and its subsidiaries are third-party beneficiaries
                  of these Terms and have the right to enforce them against you. Apple has no obligation to
                  furnish any maintenance or support services with respect to the App.
                </p>
                <div className="mt-4 p-4 bg-[#1a1e26] border border-white/[0.08] rounded-xl">
                  <p className="text-sm text-white/50 leading-relaxed">
                    <span className="font-semibold text-white/70">Note for Apple iOS App Store submission:</span> Apple's standard End User License Agreement (EULA) is selected in App Store Connect rather than a custom terms document. The official Support URL for App Store Review is{' '}
                    <a href="https://www.mastergrowbot.com/contact" className="text-landing-green hover:underline">https://www.mastergrowbot.com/contact</a>, and the Privacy Policy URL is{' '}
                    <a href="https://www.mastergrowbot.com/privacy-policy" className="text-landing-green hover:underline">https://www.mastergrowbot.com/privacy-policy</a>.
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-base font-semibold mb-2 text-white/80">Google Play Store</h3>
                <p className="text-white/60 leading-relaxed">
                  If you downloaded the App from the Google Play Store, you agree to comply with all applicable
                  Google Play policies, including the Google Play Terms of Service. Google is not responsible
                  for the App or its content.
                </p>
              </div>
            </div>
          </section>

          {/* Subscriptions and Billing */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Subscriptions and Billing</h2>
            <p className="text-white/60 mb-4">
              Subscriptions purchased via a mobile app store (Apple App Store or Google Play) are managed
              directly by that store. The following terms apply:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-white/60">
              <li>Payment will be charged to your iTunes or Google Play account at confirmation of purchase.</li>
              <li>
                Subscriptions automatically renew unless auto-renew is turned off at least 24 hours before
                the end of the current period.
              </li>
              <li>
                Your account will be charged for renewal within 24 hours prior to the end of the current period.
              </li>
              <li>
                You can manage or cancel your subscription in your Account Settings on the respective app store.
              </li>
              <li>
                MasterGrowbot AI cannot directly refund purchases made through these stores. Please contact
                Apple or Google for refund requests.
              </li>
            </ul>
          </section>

          {/* User Responsibilities */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">User Responsibilities</h2>
            <p className="text-white/60 mb-4">As a user of MasterGrowbot AI, you are responsible for:</p>
            <ul className="list-disc pl-6 space-y-3 text-white/60">
              <li>
                <strong className="text-white/80">Legal Compliance:</strong> Complying with all applicable local, state, and federal laws and
                regulations regarding cannabis cultivation and use. MasterGrowbot AI does not promote
                illegal activities and assumes users are operating within their legal jurisdiction.
              </li>
              <li>
                <strong className="text-white/80">Legality Verification:</strong> Independently verifying the legality of your growing activities
                in your jurisdiction. Laws vary widely across different locations, and it is solely your
                responsibility to understand and adhere to the laws that apply to you.
              </li>
              <li>
                <strong className="text-white/80">Medical Consultation:</strong> Consulting qualified healthcare professionals for any medical
                guidance related to cannabis use or cultivation for medical purposes. MasterGrowbot AI
                does not provide medical advice.
              </li>
              <li>
                <strong className="text-white/80">Independent Decision-Making:</strong> Making your own independent decisions about your cultivation
                practices. While our AI provides guidance, you are ultimately responsible for the actions
                you take based on our recommendations.
              </li>
              <li>
                <strong className="text-white/80">Regulatory Adherence:</strong> Following local regulations and guidelines regarding plant counts,
                cultivation licenses, and any other regulatory requirements in your area.
              </li>
              <li>
                <strong className="text-white/80">Account Security:</strong> Maintaining the security of your account credentials and notifying
                us immediately of any unauthorized access to your account.
              </li>
              <li>
                <strong className="text-white/80">Ethical Use:</strong> Using the service in an ethical manner that respects the rights and
                well-being of others.
              </li>
            </ul>
          </section>

          {/* Limitations */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Limitations of MasterGrowbot AI</h2>
            <p className="text-white/60 mb-4">
              It is important to understand that MasterGrowbot AI has the following limitations:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-white/60">
              <li>
                <strong className="text-white/80">No Medical, Legal, or Compliance Advice:</strong> MasterGrowbot AI does not provide medical,
                legal, or compliance advice. Our recommendations are for educational and informational
                purposes only.
              </li>
              <li>
                <strong className="text-white/80">No Guaranteed Outcomes:</strong> We cannot guarantee specific outcomes, yields, or results
                from following our recommendations. Plant cultivation involves numerous variables beyond
                our control.
              </li>
              <li>
                <strong className="text-white/80">Not a Substitute for Professional Consultation:</strong> Our service is not a substitute for
                consultation with healthcare professionals, legal experts, or compliance specialists.
                Users should seek appropriate professional advice for specific concerns.
              </li>
              <li>
                <strong className="text-white/80">Educational Purpose Only:</strong> All content, recommendations, and analyses provided by
                MasterGrowbot AI are for educational purposes only and should be considered general guidance
                rather than definitive instructions.
              </li>
              <li>
                <strong className="text-white/80">AI Limitations:</strong> Our AI technology, while advanced, has inherent limitations and
                may not account for all possible variables in your specific growing environment.
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Intellectual Property</h2>
            <p className="text-white/60 leading-relaxed">
              MasterGrowbot AI and all its content, features, and functionality are owned by us and are protected
              by intellectual property rights, including but not limited to trademarks, copyrights, and trade
              secrets. You may not reproduce, distribute, modify, create derivative works of, publicly display,
              publicly perform, republish, download, store, or transmit any materials from our service without
              our prior written consent, except for temporary storage in your computer's cache memory during
              your personal use of the service.
            </p>
            <p className="mt-3 text-white/60">
              Any user-generated content that you submit to MasterGrowbot AI remains your property. However, by
              submitting such content, you grant us a worldwide, non-exclusive, royalty-free license to use,
              reproduce, adapt, publish, translate, and distribute it in connection with our service and for
              improving our AI capabilities.
            </p>
          </section>

          {/* Disclaimer of Warranties */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Disclaimer of Warranties</h2>
            <div className="bg-[#1a1e26] border border-white/[0.08] p-5 rounded-xl space-y-3">
              <p className="text-white/60 text-sm uppercase font-medium leading-relaxed">
                THE MASTERGROWBOT AI SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND,
                EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES,
                INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE,
                NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.
              </p>
              <p className="text-white/60 text-sm uppercase font-medium leading-relaxed">
                WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE, OR THAT
                ANY DEFECTS WILL BE CORRECTED. WE DO NOT MAKE ANY REPRESENTATIONS OR WARRANTIES REGARDING THE ACCURACY,
                RELIABILITY, COMPLETENESS, OR TIMELINESS OF THE CONTENT PROVIDED THROUGH THE SERVICE.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Limitation of Liability</h2>
            <div className="bg-[#1a1e26] border border-white/[0.08] p-5 rounded-xl space-y-3">
              <p className="text-white/60 text-sm uppercase font-medium leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL MASTERGROWBOT AI, ITS AFFILIATES,
                DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL,
                CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF PROFITS, GOODWILL,
                USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF, OR INABILITY TO USE,
                THE SERVICE.
              </p>
              <p className="text-white/60 text-sm uppercase font-medium leading-relaxed">
                IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS EXCEED THE AMOUNT PAID BY YOU TO US FOR
                THE SERVICE DURING THE TWELVE (12) MONTH PERIOD PRIOR TO THE ACT GIVING RISE TO LIABILITY.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF CERTAIN WARRANTIES OR THE LIMITATION OR EXCLUSION OF
                LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES. ACCORDINGLY, SOME OF THE ABOVE LIMITATIONS MAY NOT
                APPLY TO YOU.
              </p>
            </div>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Indemnification</h2>
            <p className="text-white/60 leading-relaxed">
              You agree to indemnify, defend, and hold harmless MasterGrowbot AI, its affiliates, officers, directors,
              employees, consultants, agents, and representatives from and against any and all claims, liabilities,
              damages, losses, costs, expenses, or fees (including reasonable attorneys' fees) that such parties may
              incur as a result of or arising from your violation of these Terms of Service, your use of the Service,
              or your violation of any rights of any other person or entity.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Termination</h2>
            <p className="text-white/60 leading-relaxed">
              We reserve the right to terminate or suspend your access to MasterGrowbot AI, without prior notice or
              liability, for any reason whatsoever, including, without limitation, if you breach these Terms of Service.
              Upon termination, your right to use the service will immediately cease.
            </p>
            <p className="mt-3 text-white/60">
              All provisions of these Terms of Service which by their nature should survive termination shall survive
              termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and
              limitations of liability.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Governing Law</h2>
            <p className="text-white/60 leading-relaxed">
              These Terms of Service shall be governed by and construed in accordance with the laws of the State of
              California, without regard to its conflict of law principles. Any legal action or proceeding arising
              under these Terms shall be brought exclusively in the federal or state courts located in San Francisco
              County, California, and you hereby consent to the personal jurisdiction and venue therein.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Changes to Terms</h2>
            <p className="text-white/60 leading-relaxed">
              We reserve the right, at our sole discretion, to modify or replace these Terms of Service at any time.
              If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
              What constitutes a material change will be determined at our sole discretion.
            </p>
            <p className="mt-3 text-white/60">
              By continuing to access or use our service after any revisions become effective, you agree to be bound
              by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the service.
            </p>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Disclaimers</h2>
            <div className="bg-[#1a1e26] border border-white/[0.08] p-5 rounded-xl space-y-3">
              <p className="text-white/60 text-sm leading-relaxed">
                <strong className="text-white/80">Medical Disclaimer:</strong> MasterGrowbot AI is a cultivation technology platform and does not
                provide medical advice or guidance. While our AI can assist with general growing techniques,
                all medical decisions should be made in consultation with qualified healthcare professionals.
                Users growing for medical purposes should always follow their healthcare provider's guidance
                and comply with local medical regulations.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                <strong className="text-white/80">General Disclaimer:</strong> MasterGrowbot AI is a technology platform providing AI-assisted
                plant cultivation guidance. Any specific plant-related features or examples are for illustrative
                purposes only. No Professional Advice: Our AI technology provides general horticultural information
                only. We do not offer legal, medical, compliance, or professional advice. Users must consult
                qualified professionals for medical, legal, or compliance guidance.
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                <strong className="text-white/80">User Accountability:</strong> Users are solely responsible for verifying and maintaining
                compliance with all applicable laws and regulations regarding their cultivation activities.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Contact Information</h2>
            <p className="text-white/60">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="mt-3">
              <a
                href="mailto:support@mastergrowbot.com"
                className="text-landing-green text-lg font-semibold hover:text-landing-green/80 transition-colors duration-200"
              >
                support@mastergrowbot.com
              </a>
            </p>
            <p className="mt-4 text-white/35 text-sm">Last Updated: April 17, 2026</p>
          </section>

        </div>

        {/* Bottom CTA */}
        <div className="mt-14 p-6 bg-[#1a1e26] border border-landing-green/20 rounded-2xl text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <img src="/images/app-icon.png" alt="MasterGrowbot AI" className="w-5 h-5 rounded-md" width={20} height={20} />
            <span className="text-white text-sm font-semibold">MasterGrowbot AI</span>
          </div>
          <p className="text-white/40 text-xs mb-4">
            Your AI master grower, in your pocket. Free 3-day trial available on iOS and Android.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-landing-green/10 border border-landing-green/25 text-landing-green text-xs font-semibold hover:bg-landing-green/20 transition-colors duration-200"
              onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'app_store_click', { link_url: 'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060' }); }}
            >
              Download on App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-landing-green/10 border border-landing-green/25 text-landing-green text-xs font-semibold hover:bg-landing-green/20 transition-colors duration-200"
              onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'play_store_click', { link_url: 'https://play.google.com/store/apps/details?id=com.mastergrowbot.app' }); }}
            >
              Get it on Google Play
            </a>
          </div>
        </div>

      </main>

      <LandingFooter />
    </div>
  );
};

export default TermsOfService;
