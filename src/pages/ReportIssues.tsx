import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertTriangle,
  Send,
  ArrowLeft,
  Shield,
  MessageSquare,
  User,
  Clock,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const ReportIssues = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    reportType: "",
    severity: "",
    reportedUser: "",
    incidentDate: "",
    incidentTime: "",
    description: "",
    evidence: "",
    contactMethod: "anonymous"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportTypes = [
    { value: "harassment", label: "Harassment or Bullying" },
    { value: "inappropriate", label: "Inappropriate Content" },
    { value: "spam", label: "Spam or Scams" },
    { value: "privacy", label: "Privacy Violation" },
    { value: "technical", label: "Technical Issues" },
    { value: "safety", label: "Safety Concern" },
    { value: "other", label: "Other" }
  ];

  const severityLevels = [
    { value: "low", label: "Low - Minor issue", description: "Annoying but not serious" },
    { value: "medium", label: "Medium - Concerning", description: "Requires attention" },
    { value: "high", label: "High - Serious", description: "Immediate action needed" },
    { value: "critical", label: "Critical - Emergency", description: "Severe violation requiring immediate response" }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "Report Submitted!",
      description: "Thank you for helping keep Duhuze safe. We'll review your report within 24 hours.",
    });

    setFormData({
      reportType: "",
      severity: "",
      reportedUser: "",
      incidentDate: "",
      incidentTime: "",
      description: "",
      evidence: "",
      contactMethod: "anonymous"
    });

    setIsSubmitting(false);
  };

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
              Report Issues
            </h1>
            <div className="w-20"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-r from-gray-50 to-white border-b">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Help Us Keep Duhuze Safe
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Your reports help maintain a safe and positive community for everyone.
          </p>
          <Button
            onClick={() => document.getElementById('report-form')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-gray-900 text-white hover:bg-gray-800 px-4 py-2 rounded-md font-medium text-sm"
          >
            Submit a Report
          </Button>
        </div>
      </section>

      {/* Report Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div id="report-form" className="max-w-2xl mx-auto">
            <Card className="p-8 border border-gray-200 shadow-sm bg-white">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-3 text-gray-900">Submit a Report</h2>
                <p className="text-gray-600">All reports are taken seriously and reviewed by our safety team within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Report Type */}
                <div className="space-y-2">
                  <Label>What type of issue are you reporting?</Label>
                  <Select value={formData.reportType} onValueChange={(value) => handleInputChange("reportType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity Level */}
                <div className="space-y-4">
                  <Label>How severe is this issue?</Label>
                  <RadioGroup value={formData.severity} onValueChange={(value) => handleInputChange("severity", value)}>
                    {severityLevels.map((level) => (
                      <div key={level.value} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={level.value} id={level.value} />
                        <div className="flex-1">
                          <Label htmlFor={level.value} className="font-semibold cursor-pointer">
                            {level.label}
                          </Label>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Reported User */}
                <div className="space-y-2">
                  <Label htmlFor="reportedUser">Username or Display Name (if known)</Label>
                  <Input
                    id="reportedUser"
                    value={formData.reportedUser}
                    onChange={(e) => handleInputChange("reportedUser", e.target.value)}
                    placeholder="Leave blank if unknown"
                  />
                </div>

                {/* Incident Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="incidentDate">Date of Incident</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      value={formData.incidentDate}
                      onChange={(e) => handleInputChange("incidentDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incidentTime">Approximate Time</Label>
                    <Input
                      id="incidentTime"
                      type="time"
                      value={formData.incidentTime}
                      onChange={(e) => handleInputChange("incidentTime", e.target.value)}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Please provide as much detail as possible about what happened..."
                    rows={6}
                    required
                  />
                </div>

                {/* Evidence */}
                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence or Screenshots (optional)</Label>
                  <Textarea
                    id="evidence"
                    value={formData.evidence}
                    onChange={(e) => handleInputChange("evidence", e.target.value)}
                    placeholder="Links to screenshots, chat logs, or other evidence..."
                    rows={3}
                  />
                </div>

                {/* Contact Method */}
                <div className="space-y-4">
                  <Label>How would you like us to follow up?</Label>
                  <RadioGroup value={formData.contactMethod} onValueChange={(value) => handleInputChange("contactMethod", value)}>
                    <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                      <RadioGroupItem value="anonymous" id="anonymous" />
                      <div>
                        <Label htmlFor="anonymous" className="font-semibold cursor-pointer">Remain Anonymous</Label>
                        <p className="text-sm text-gray-600">We won't contact you about this report</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg">
                      <RadioGroupItem value="email" id="email" />
                      <div>
                        <Label htmlFor="email" className="font-semibold cursor-pointer">Contact me via email</Label>
                        <p className="text-sm text-gray-600">We'll send updates about this report</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gray-900 text-white hover:bg-gray-800 py-3 rounded-lg font-medium"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    "Submitting Report..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Report
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety Information */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3 text-gray-900">
              What Happens Next?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our safety team reviews every report carefully and takes appropriate action.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Review Within 24 Hours</h3>
              <p className="text-gray-600 text-sm">Every report is reviewed by our dedicated safety team</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Appropriate Action</h3>
              <p className="text-gray-600 text-sm">Warnings, suspensions, or bans based on severity</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-gray-900">Follow Up</h3>
              <p className="text-gray-600 text-sm">Updates provided if you requested contact</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportIssues;
