import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import LeafletMap from "@/components/LeafletMap";
import CategorySelect from "@/components/CategorySelect";

export default function FileComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "road",
    latitude: "",
    longitude: "",
    locationAddress: "",
    image: null,
  });
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Complaint.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["complaints"]);
      setSubmitted(true);
    },
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploading(true);
      try {
        const { file_url } = await base44.integrations.Core.UploadFile({
          file: e.target.files[0],
        });
        setFormData((prev) => ({ ...prev, image: file_url }));
      } catch (error) {
        console.error("Upload failed:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleLocationSelect = (lat, lng, address) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString(),
      locationAddress: address,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.latitude || !formData.longitude) {
      alert("Please select a location on the map");
      return;
    }

    createMutation.mutate({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      status: "pending",
      location: formData.locationAddress || `Lat: ${formData.latitude}, Lng: ${formData.longitude}`,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      image_url: formData.image,
      citizen_name: "You",
    });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-full bg-teal-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-teal-400" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Complaint Submitted!</h1>
          <p className="text-gray-400 mb-8">
            Your complaint has been successfully filed. You can track its progress from your dashboard.
          </p>
          <Link
            to={createPageUrl("CitizenDashboard")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#1a0a42]/95">
        <div className="px-6 md:px-12 py-4 flex items-center gap-4 max-w-4xl mx-auto">
          <Link
            to={createPageUrl("CitizenDashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">File New Complaint</h1>
            <p className="text-sm text-gray-400">Report a civic issue in your area</p>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-8 max-w-4xl mx-auto">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-48">
          <img
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&q=80"
            alt="Community"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-transparent flex items-center p-8">
            <div>
              <h2 className="text-2xl font-bold mb-2">Your Voice Matters</h2>
              <p className="text-gray-300">Help us improve your community by reporting issues</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Issue Details</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Complaint Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="e.g., Pothole on Main Street"
                  className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <CategorySelect
                  value={formData.category}
                  onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows={4}
                placeholder="Describe the issue in detail..."
                className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 transition-all resize-none"
                required
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Evidence (Optional)</h3>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 border border-white/20 cursor-pointer hover:bg-white/20 transition-all">
                <Upload className="w-5 h-5" />
                {uploading ? "Uploading..." : "Choose Image"}
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              {formData.image && (
                <div className="flex items-center gap-2">
                  <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                  <span className="text-sm text-teal-400">Image uploaded ✓</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-purple-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Select Location *</h3>
            <LeafletMap onLocationSelect={handleLocationSelect} />
          </div>

          <div className="flex gap-4 pt-4">
            <Link
              to={createPageUrl("CitizenDashboard")}
              className="px-6 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/10 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="flex-1 px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {createMutation.isLoading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}