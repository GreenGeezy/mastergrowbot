
import LandingNav from "@/components/landing/LandingNav";
import LandingFooter from "@/components/landing/LandingFooter";
import DeletionRequestForm from "@/components/privacy/DeletionRequestForm";
import SEOHead from "@/components/SEOHead";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#0f1117] flex flex-col font-sans">
      <SEOHead
        title="Privacy Policy | MasterGrowbot AI"
        description="MasterGrowbot AI never sells your data. Learn how we protect your privacy on iOS and Android. GDPR compliant. Data deletion available on request."
        canonicalUrl="https://www.mastergrowbot.com/privacy-policy"
      />

      <LandingNav />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">

        {/* Trust badge row */}
        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 px-4 py-3 bg-[#1a1e26] border border-white/[0.07] rounded-xl">
          <span className="flex items-center gap-2 text-sm text-white/60">
            <span className="text-landing-green text-base">🔒</span> Encrypted &amp; Secure
          </span>
          <span className="flex items-center gap-2 text-sm text-white/60">
            <span className="text-landing-green text-base">✓</span> We Never Sell Your Data
          </span>
          <span className="flex items-center gap-2 text-sm text-white/60">
            <span className="text-landing-green text-base">✓</span> GDPR Compliant
          </span>
          <span className="flex items-center gap-2 text-sm text-white/60">
            <span className="text-landing-green text-base">✓</span> Data Deletion On Request
          </span>
        </div>

        <h1 className="text-4xl font-bold mb-1 text-white tracking-tight">Privacy Policy</h1>
        <p className="text-white/35 text-sm mb-10">Last Updated: April 17, 2026</p>

        <div className="space-y-10">

          {/* Introduction */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Introduction</h2>
            <p className="text-white/60 leading-relaxed">
              Welcome to MasterGrowbot AI's Privacy Policy. MasterGrowbot AI is an AI-powered cannabis cultivation
              platform designed to help users grow better and improve their cultivation practices through
              advanced technology. This Privacy Policy explains how we collect, use, and protect your data
              when you use our services.
            </p>
          </section>

          {/* Mobile App Coverage */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Mobile App Coverage</h2>
            <p className="text-white/60 leading-relaxed">
              This Privacy Policy also applies to the MasterGrowbot AI mobile application available on the Apple App Store (iOS)
              and Google Play Store (Android). It explains how user data — including photos, identifiers, and analytics — is collected,
              processed, and protected when using the app on Apple and Android devices.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Information Collection</h2>
            <p className="text-white/60 mb-4">We collect the following types of information:</p>

            <h3 className="text-base font-semibold mt-4 mb-2 text-white/80">Cultivation-Related Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-white/60">
              <li>Growing conditions (humidity, temperature, lighting)</li>
              <li>Plant health data from image uploads and analyses</li>
              <li>Chat inputs and questions about cultivation</li>
              <li>Quiz responses and cultivation preferences</li>
              <li>User feedback on growing recommendations</li>
            </ul>

            <h3 className="text-base font-semibold mt-5 mb-2 text-white/80">Account Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-white/60">
              <li>Email address and password (for standard accounts)</li>
              <li>Information from Google OAuth (name, email, language preference, profile picture)</li>
              <li>Subscription details for premium members</li>
            </ul>

            <h3 className="text-base font-semibold mt-5 mb-2 text-white/80">Automatically Collected Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-white/60">
              <li>Usage data (features used, time spent, interactions)</li>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Device information</li>
              <li>Date and time of visits</li>
            </ul>
          </section>

          {/* Photo Uploads & AI Analysis */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Photo Uploads &amp; AI Analysis</h2>
            <p className="text-white/60 leading-relaxed">
              When you upload plant images through the app or web interface, we store them securely, run
              AI-based diagnostics, and may retain them for up to 365 days unless you request deletion.
              Uploaded photos are used only to provide health analysis and improve AI accuracy.
            </p>
          </section>

          {/* Data Collection for Core Functionality */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Data Collection for Core Functionality</h2>
            <p className="text-white/60 mb-4">
              To provide the app's core functionality, we collect the following types of data:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-white/60">
              <li>
                <strong className="text-white/80">Images for Plant Diagnosis:</strong> Photos you upload are processed by our AI to analyze
                plant health and provide cultivation recommendations.
              </li>
              <li>
                <strong className="text-white/80">Voice Audio for Transcription:</strong> When using voice features, audio is captured and
                transcribed to enable voice-based interactions with the AI assistant.
              </li>
              <li>
                <strong className="text-white/80">Chat Inputs:</strong> Text conversations are processed to provide personalized growing advice.
              </li>
            </ul>
            <p className="mt-4 text-white/60">
              This data collection is essential to deliver the core services of the MasterGrowbot AI application.
            </p>
          </section>

          {/* Use of Information */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Use of Information</h2>
            <p className="text-white/60 mb-4">We use your information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-1 text-white/60">
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
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Sharing of Information</h2>
            <p className="text-white/60 mb-4">
              We may share your information with the following third parties:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-white/60">
              <li>
                <strong className="text-white/80">Google:</strong> For authentication purposes when using Google OAuth, and for app
                distribution and analytics through Google Play Services.
              </li>
              <li>
                <strong className="text-white/80">Apple:</strong> For app distribution through the Apple App Store and related services.
              </li>
              <li>
                <strong className="text-white/80">Service Providers:</strong> Companies that assist us in providing our services,
                including cloud hosting providers, payment processors, and analytics services.
              </li>
              <li>
                <strong className="text-white/80">Legal Requirements:</strong> When required by law, court order, or governmental regulation.
              </li>
              <li>
                <strong className="text-white/80">Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.
              </li>
              <li>
                <strong className="text-white/80">With Consent:</strong> In other cases with your explicit consent.
              </li>
            </ul>
            <p className="mt-4 px-4 py-3 bg-landing-green/10 border border-landing-green/25 rounded-lg text-landing-green text-sm font-medium">
              We do not sell your personal information to third parties.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Data Security</h2>
            <p className="text-white/60">
              We implement appropriate technical and organizational measures to protect your data, including:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3 text-white/60">
              <li>Encryption of sensitive data</li>
              <li>Regular security assessments</li>
              <li>Access controls and authentication mechanisms</li>
              <li>Secure database management</li>
              <li>Regular backups</li>
            </ul>
            <p className="mt-4 text-white/60">
              While we strive to protect your information, no method of transmission over the internet
              or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          {/* User Rights */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">User Rights</h2>
            <p className="text-white/60 mb-4">
              Depending on your location, you may have certain rights regarding your data:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-white/60">
              <li>Access to your personal information</li>
              <li>Correction of inaccurate or incomplete data</li>
              <li>Deletion of your personal information</li>
              <li>Restriction of processing</li>
              <li>Data portability</li>
              <li>Objection to processing</li>
            </ul>
            <p className="mt-4 text-white/60">
              MasterGrowbot AI respects your privacy and does not share or sell your personal information to third parties without your explicit and affirmative consent. You are always in control of your data. The rights listed above allow you to manage your personal information directly, ensuring your preferences about data use and security are always respected. If you have any questions about exercising your data rights or our commitment to data security, please contact us directly at{' '}
              <a href="mailto:support@mastergrowbot.com" className="text-landing-green hover:underline">support@mastergrowbot.com</a>.
            </p>
            <p className="mt-3 text-white/60">
              To exercise any of these rights, please contact us at{' '}
              <a href="mailto:support@mastergrowbot.com" className="text-landing-green hover:underline">support@mastergrowbot.com</a>.
            </p>
          </section>

          {/* Data Deletion & Retention */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Data Deletion &amp; Retention</h2>
            <p className="text-white/60">
              Users may request the deletion of their account and associated data by contacting us at{' '}
              <a href="mailto:support@mastergrowbot.com" className="text-landing-green hover:underline">support@mastergrowbot.com</a>{' '}
              or using the delete account function within the App settings.
              Upon verified request, data will be permanently removed within 30 days.
            </p>
            <p className="mt-3 text-white/60">
              Users may also request deletion of specific personal data or analysis history at any time
              through the same channels.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Children's Privacy</h2>
            <p className="text-white/60 leading-relaxed">
              MasterGrowbot AI is not intended for children under the age of 18. We do not knowingly
              collect personal information from individuals under 18 years of age. If we discover
              that a child has provided us with personal information, we will promptly delete it
              from our systems.
            </p>
          </section>

          {/* Third-Party Links */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Third-Party Links</h2>
            <p className="text-white/60 leading-relaxed">
              Our service may contain links to third-party websites or services that are not owned
              or controlled by MasterGrowbot AI. We have no control over and assume no responsibility
              for the content, privacy policies, or practices of any third-party websites or services.
              We advise you to read the privacy policies of every website you visit.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Changes to This Policy</h2>
            <p className="text-white/60 leading-relaxed">
              We may update our Privacy Policy from time to time. We will notify you of any changes
              by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              For significant changes, we may provide additional notice, such as email notifications.
            </p>
            <p className="mt-3 text-white/60">
              You are advised to review this Privacy Policy periodically for any changes. Changes
              to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          {/* Alignment with Google's Privacy Policy */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Alignment with Google's Privacy Policy</h2>
            <p className="text-white/60 leading-relaxed">
              MasterGrowbot AI respects user privacy and handles data in accordance with applicable
              privacy laws and Google's policies, particularly regarding data obtained through
              Google OAuth and Google Play Services. We follow Google's API Services User Data Policy
              for all data received through Google authentication and comply with all applicable
              Google Play policies for our Android application.
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
            </div>
          </section>

          {/* Data Deletion Request Form */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Data Deletion Request</h2>
            <div className="bg-[#1a1e26] border border-white/[0.08] p-5 rounded-xl">
              <DeletionRequestForm />
            </div>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white border-l-4 border-landing-green pl-3">Contact Information</h2>
            <p className="text-white/60">
              If you have any questions or concerns about this Privacy Policy or our data practices,
              please contact us at:
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
            We protect your privacy so you can focus on growing. Free 3-day trial — no signup required for the web app.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060?utm_source=website&utm_medium=organic&utm_campaign=privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-landing-green/10 border border-landing-green/25 text-landing-green text-xs font-semibold hover:bg-landing-green/20 transition-colors duration-200"
              onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'app_store_click', { link_url: 'https://apps.apple.com/us/app/mastergrowbot-ai-grow-cannabis/id6752221060' }); }}
            >
              Download on App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.mastergrowbot.app&utm_source=website&utm_medium=organic&utm_campaign=privacy-policy"
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

export default PrivacyPolicy;
