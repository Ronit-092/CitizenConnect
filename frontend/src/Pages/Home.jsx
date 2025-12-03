import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  FileText,
  MapPin,
  Eye,
  Bell,
  Shield,
  BarChart3,
  Camera,
  Clock,
  Users,
  Heart,
  Scale,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import LoginModal from "@/components/LoginModal";

export default function Home() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const { data: complaints = [] } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => base44.entities.Complaint.list(),
  });

  const stats = {
    total: complaints.length || 150,
    resolved: complaints.filter(c => c.status === "resolved").length || 89,
  };

  const handleCitizenLogin = () => {
    setIsLoginOpen(false);
    window.location.href = createPageUrl("CitizenDashboard");
  };

  const handleGovtLogin = () => {
    setIsLoginOpen(false);
    window.location.href = createPageUrl("GovtDashboard");
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onCitizenLogin={handleCitizenLogin}
        onGovtLogin={handleGovtLogin}
      />

      {/* Navigation */}
      <nav className="px-6 md:px-12 py-4 flex justify-between items-center border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-md z-40">
        <div className="flex items-center gap-3">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692f179dc247519d0fe6336b/986c722a7_image.png" 
            alt="CitizenConnect" 
            className="w-10 h-10 object-contain"
          />
          <span className="text-xl font-bold text-gray-900">CitizenConnect</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">Features</a>
          <a href="#stats" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">Impact</a>
          <a href="#about" className="text-sm text-gray-600 hover:text-purple-600 transition-colors">About</a>
        </div>
        <button
          onClick={() => setIsLoginOpen(true)}
          className="px-6 py-2 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 py-20 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 bg-purple-50 mb-6 w-fit">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                Transparent Governance Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Your Voice, <span className="text-purple-600">Our Action</span>
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Bridge the gap between citizens and government. Report civic
              issues, track progress in real-time, and hold authorities
              accountable with complete transparency.
            </p>

            {/* CTA Buttons */}
            <div className="flex gap-4 mb-12 flex-wrap">
              <Link
                to={createPageUrl("CitizenSignup")}
                className="px-8 py-3 rounded-lg bg-purple-600 text-white font-semibold flex items-center gap-2 hover:bg-purple-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-8 py-3 rounded-lg border-2 border-purple-600 text-purple-600 font-semibold hover:bg-purple-50 transition-all transform hover:scale-105 active:scale-95"
              >
                Login
              </button>
            </div>
          </div>

          {/* Right - Image Section */}
          <div className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&q=80"
                alt="Smart City"
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/80 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Issues Resolved</p>
                        <p className="text-sm text-gray-500">This month</p>
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-teal-600">{stats.resolved}+</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section id="stats" className="px-6 md:px-12 py-16 bg-gradient-to-r from-purple-600 to-purple-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.total || 5}</p>
              <p className="text-purple-200">Issues Filed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">{stats.resolved || 1}</p>
              <p className="text-purple-200">Issues Resolved</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">0</p>
              <p className="text-purple-200">Active Citizens</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <p className="text-4xl font-bold text-white mb-2">50+</p>
              <p className="text-purple-200">Cities Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-12 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-purple-600 text-sm font-semibold mb-2">FEATURES</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for{" "}
              <span className="text-purple-600">Civic Engagement</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to empower citizens and
              streamline government response to public issues.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: FileText,
                title: "Easy Complaint Filing",
                desc: "Submit complaints in minutes with our intuitive form. Add photos, descriptions, and precise locations.",
              },
              {
                icon: MapPin,
                title: "Precise Location Mapping",
                desc: "Pin-point exact issue locations on interactive maps. Search and mark the problem area with ease.",
              },
              {
                icon: Eye,
                title: "Full Transparency",
                desc: "Track every complaint's journey from submission to resolution. No hidden processes.",
              },
              {
                icon: Bell,
                title: "Real-time Updates",
                desc: "Get notified when government takes action on your complaint. Stay informed at every step.",
              },
              {
                icon: Shield,
                title: "Government Portal",
                desc: "Dedicated dashboard for officials to manage, prioritize, and resolve citizen complaints efficiently.",
              },
              {
                icon: BarChart3,
                title: "Progress Analytics",
                desc: "Visual dashboards showing resolution rates, response times, and department performance.",
              },
              {
                icon: Camera,
                title: "Photo Evidence",
                desc: "Upload images as proof of civic issues. Visual documentation speeds up verification.",
              },
              {
                icon: Clock,
                title: "Status Tracking",
                desc: "Monitor complaint status from pending to resolved. Complete visibility into government action.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg p-8 border border-gray-200 hover:shadow-lg hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
              >
                <feature.icon className="w-8 h-8 text-purple-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                <h3 className="text-lg font-bold mb-3 group-hover:text-purple-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="px-6 md:px-12 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="relative rounded-2xl overflow-hidden h-64 group">
              <img
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&q=80"
                alt="Community Meeting"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Community First</p>
                <p className="text-sm text-gray-300">Working together for change</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 group">
              <img
                src="https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=400&q=80"
                alt="City Infrastructure"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Better Infrastructure</p>
                <p className="text-sm text-gray-300">Building smarter cities</p>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-64 group">
              <img
                src="https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&q=80"
                alt="Government Building"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-semibold">Transparent Governance</p>
                <p className="text-sm text-gray-300">Accountability matters</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 md:px-12 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-purple-600 text-sm font-semibold mb-2">
                ABOUT CITIZENCONNECT
              </p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Bridging the Gap Between{" "}
                <span className="text-purple-600">Citizens & Government</span>
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                CitizenConnect is a digital platform designed to revolutionize how
                citizens report civic issues and how governments respond to
                them. We believe in transparency, accountability, and efficient
                governance.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Users, text: "Empowering citizens to voice their concerns" },
                  { icon: Heart, text: "Building stronger communities together" },
                  { icon: Scale, text: "Ensuring accountability in governance" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative rounded-3xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                alt="Team collaboration"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-purple-100 leading-relaxed">
                  To create a seamless bridge between citizens and government,
                  ensuring every voice is heard and every issue is addressed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-12 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692f179dc247519d0fe6336b/986c722a7_image.png" 
                alt="CitizenConnect" 
                className="w-10 h-10 object-contain brightness-0 invert"
              />
              <span className="text-xl font-bold">CitizenConnect</span>
            </div>
            <div className="flex gap-6">
              <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
              <a href="#stats" className="text-sm text-gray-400 hover:text-white transition-colors">Impact</a>
              <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
            </div>
            <p className="text-gray-400 text-sm">
              © 2024 CitizenConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}