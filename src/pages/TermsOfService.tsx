import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermsOfService = () => {
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
              Terms of Service
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
              <h1 className="text-3xl font-bold mb-8 text-gray-900">Terms of Service</h1>

              <p className="text-gray-600 mb-6">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Acceptance of Terms</h2>
              <p className="text-gray-700 mb-6">
                By accessing and using Duhuze ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">2. Description of Service</h2>
              <p className="text-gray-700 mb-6">
                Duhuze is an anonymous video chat platform that connects users for real-time video conversations. The service is designed for adults 18 years and older and emphasizes user safety, privacy, and respectful interactions.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">3. User Eligibility</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>You must be at least 18 years old to use Duhuze</li>
                <li>You must provide accurate and truthful information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to use the service only for lawful purposes</li>
                <li>You must comply with all applicable local laws and regulations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">4. Acceptable Use Policy</h2>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">4.1 Permitted Use</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700">
                <li>Engage in respectful, adult conversations</li>
                <li>Use the platform for making new connections and friendships</li>
                <li>Report inappropriate behavior or safety concerns</li>
                <li>Provide feedback to help improve the service</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 text-gray-900">4.2 Prohibited Activities</h3>
              <p className="text-gray-700 mb-4">You agree NOT to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Harass, abuse, or harm other users</li>
                <li>Share explicit, violent, or inappropriate content</li>
                <li>Impersonate others or provide false information</li>
                <li>Attempt to circumvent safety features or anonymity</li>
                <li>Use the service for commercial purposes without permission</li>
                <li>Distribute malware, viruses, or harmful code</li>
                <li>Violate intellectual property rights</li>
                <li>Engage in discriminatory behavior</li>
                <li>Solicit personal information from other users</li>
                <li>Record or screenshot conversations without consent</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">5. Content and Conduct</h2>
              <p className="text-gray-700 mb-6">
                Users are responsible for their own content and conduct. Duhuze reserves the right to monitor, moderate, and remove content that violates these terms. We employ AI-powered moderation and human oversight to maintain a safe environment.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">6. Privacy and Data Protection</h2>
              <p className="text-gray-700 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of Duhuze. By using our service, you consent to the collection and use of information as outlined in our Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">7. Safety and Reporting</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>Use the report button for any inappropriate behavior</li>
                <li>Our safety team reviews reports within 24 hours</li>
                <li>False reports may result in account suspension</li>
                <li>Emergency situations should be reported to local authorities</li>
                <li>We cooperate with law enforcement when legally required</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">8. Account Suspension and Termination</h2>
              <p className="text-gray-700 mb-6">
                Duhuze reserves the right to suspend or terminate accounts that violate these terms. Users may also delete their accounts at any time. Upon termination, all rights to use the service cease immediately.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">9. Intellectual Property</h2>
              <p className="text-gray-700 mb-6">
                Duhuze and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">10. Disclaimers</h2>
              <ul className="list-disc pl-6 mb-6 text-gray-700">
                <li>The service is provided "as is" without warranties</li>
                <li>We do not guarantee uninterrupted or error-free service</li>
                <li>We are not responsible for user-generated content</li>
                <li>Users interact at their own risk</li>
                <li>We disclaim liability for indirect or consequential damages</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">11. Limitation of Liability</h2>
              <p className="text-gray-700 mb-6">
                In no event shall Duhuze be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the service.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">12. Indemnification</h2>
              <p className="text-gray-700 mb-6">
                You agree to defend, indemnify, and hold harmless Duhuze from any claims, damages, losses, costs, and expenses arising from your use of the service or violation of these terms.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">13. Governing Law</h2>
              <p className="text-gray-700 mb-6">
                These terms shall be interpreted and governed by the laws of Rwanda, without regard to conflict of law provisions. Any disputes shall be resolved in the courts of Rwanda.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">14. Changes to Terms</h2>
              <p className="text-gray-700 mb-6">
                We reserve the right to modify these terms at any time. Users will be notified of changes, and continued use constitutes acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-bold mb-4 text-gray-900">15. Contact Information</h2>
              <p className="text-gray-700 mb-4">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <ul className="list-none mb-6 text-gray-700">
                <li><strong>Email:</strong> legal@duhuze.rw</li>
                <li><strong>Address:</strong> Kigali, Rwanda</li>
                <li><strong>Phone:</strong> +250 788 123 456</li>
              </ul>

              <div className="border-t pt-6 mt-8">
                <p className="text-sm text-gray-500">
                  By using Duhuze, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
