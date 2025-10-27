import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <h1 className="text-xl font-bold text-gray-900">
              Privacy Policy
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card className="p-8 border border-gray-200 shadow-sm">
            <div className="prose prose-gray max-w-none">
              <h1 className="text-3xl font-bold mb-8 text-gray-900">Privacy Policy</h1>

              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Introduction</h2>
              <p className="text-gray-700 mb-6">
                Duhuze ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our video chat platform.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Information We Collect</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">2.1 Information You Provide</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Account information (email, username, age verification)</li>
                <li>Profile information (optional display name, bio, interests)</li>
                <li>Communication preferences and language settings</li>
                <li>Support requests and feedback</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">2.2 Information We Collect Automatically</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Device information and browser type</li>
                <li>IP address and location data (generalized)</li>
                <li>Usage patterns and feature interactions</li>
                <li>Connection logs (anonymized)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">2.3 Information We Do NOT Collect</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Video content or recordings</li>
                <li>Chat message content (messages are not stored)</li>
                <li>Personal photos or media files</li>
                <li>Real names or identifying information (unless voluntarily provided)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">3. How We Use Your Information</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Provide and maintain our video chat services</li>
                <li>Ensure platform safety and prevent abuse</li>
                <li>Match users based on preferences and availability</li>
                <li>Improve our services and develop new features</li>
                <li>Respond to support requests and resolve issues</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect against fraud or security threats</li>
                <li>With service providers who help operate our platform (under strict confidentiality agreements)</li>
                <li>In aggregated, anonymized form for research and improvement purposes</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Data Security</h2>
              <p className="text-gray-700 mb-6">
                We implement bank-level security measures including end-to-end encryption, secure data centers, regular security audits, and employee training on data protection. Video calls and text messages are encrypted in transit and at rest.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Data Retention</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Account data: Retained while account is active and for 2 years after deletion</li>
                <li>Usage logs: Anonymized and retained for 1 year for security and improvement</li>
                <li>Report data: Retained as needed for safety investigations</li>
                <li>Video content: Never stored or retained</li>
                <li>Chat messages: Not stored (self-destruct after session)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Access and review your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Opt out of non-essential communications</li>
                <li>Request data portability</li>
                <li>Lodge complaints with supervisory authorities</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-6">
                We use essential cookies for platform functionality and optional analytics cookies to improve our services. You can control cookie preferences in your browser settings.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">9. International Data Transfers</h2>
              <p className="text-gray-700 mb-6">
                Your data may be processed in countries other than Rwanda. We ensure appropriate safeguards are in place for international transfers, including standard contractual clauses and adequacy decisions.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Children's Privacy</h2>
              <p className="text-gray-700 mb-6">
                Duhuze is intended for users 18 years and older. We do not knowingly collect information from children under 18. If we become aware of such collection, we will delete the information immediately.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Changes to This Policy</h2>
              <p className="text-gray-700 mb-6">
                We may update this Privacy Policy periodically. We will notify users of material changes via email or platform notification. Continued use of our services constitutes acceptance of the updated policy.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul className="list-none mb-6 text-gray-700">
                <li><strong>Email:</strong> privacy@duhuze.rw</li>
                <li><strong>Address:</strong> Kigali, Rwanda</li>
                <li><strong>Phone:</strong> +250 788 123 456</li>
              </ul>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  This privacy policy is governed by the laws of Rwanda and is compliant with international data protection standards.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
