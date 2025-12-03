import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  MapPin,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  FileText,
  BarChart3,
} from "lucide-react";

const SAMPLE_COMPLAINTS = [
  {
    id: "1",
    title: "Pothole on Rajpath",
    description: "Large pothole causing traffic issues and vehicle damage",
    category: "road",
    status: "pending",
    created_date: "2024-01-15",
    location: "New Delhi, India",
    latitude: 28.6139,
    longitude: 77.209,
    citizen_name: "Citizen 1",
  },
  {
    id: "2",
    title: "Water supply disruption in Sector 5",
    description: "No water supply for 3 days in residential area",
    category: "water",
    status: "in-progress",
    created_date: "2024-01-14",
    location: "Noida, Uttar Pradesh",
    latitude: 28.5355,
    longitude: 77.391,
    citizen_name: "Citizen 2",
  },
  {
    id: "3",
    title: "Street light not working",
    description: "Street light at corner of MG Road is broken for a week",
    category: "utilities",
    status: "resolved",
    created_date: "2024-01-10",
    location: "Bangalore, Karnataka",
    latitude: 12.9716,
    longitude: 77.5946,
    citizen_name: "Citizen 3",
  },
];

export default function CitizenDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchLocation, setSearchLocation] = useState("");

  const { data: dbComplaints = [], isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => base44.entities.Complaint.list("-created_date"),
  });

  const complaints = dbComplaints.length > 0 ? dbComplaints : SAMPLE_COMPLAINTS;

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-teal-400" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "pending":
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      case "in-progress":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "pending":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = selectedStatus === "all" || complaint.status === selectedStatus;
    const matchesLocation = complaint.location?.toLowerCase().includes(searchLocation.toLowerCase());
    return matchesStatus && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0a42] via-[#3a1a7e] to-[#2a1a60] text-white">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-md sticky top-0 z-50 bg-[#1a0a42]/95">
        <div className="px-6 md:px-12 py-4 flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/692f179dc247519d0fe6336b/986c722a7_image.png" 
              alt="CitizenConnect" 
              className="w-10 h-10 object-contain brightness-0 invert"
            />
            <div>
              <h1 className="text-xl font-bold">CitizenConnect</h1>
              <p className="text-xs text-gray-400">Citizen Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#my-issues" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">My Issues</a>
            <a href="#stats" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Stats</a>
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden md:inline">Logout</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="px-6 md:px-12 py-8 max-w-7xl mx-auto">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-8 h-48">
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&q=80"
            alt="City"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/95 via-purple-900/70 to-transparent flex items-center p-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
              <p className="text-gray-300 mb-4">Help improve your community by reporting civic issues</p>
              <Link
                to={createPageUrl("FileComplaint")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-teal-400 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
              >
                <Plus className="w-5 h-5" />
                File New Complaint
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div id="stats" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-xl p-4 text-center">
            <FileText className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">Total Filed</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-orange-900/10 border border-orange-500/30 rounded-xl p-4 text-center">
            <AlertCircle className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-orange-400">{stats.pending}</p>
            <p className="text-xs text-gray-400">Pending</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 border border-yellow-500/30 rounded-xl p-4 text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-yellow-400">{stats.inProgress}</p>
            <p className="text-xs text-gray-400">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-teal-500/10 to-teal-900/10 border border-teal-500/30 rounded-xl p-4 text-center">
            <CheckCircle className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-400">{stats.resolved}</p>
            <p className="text-xs text-gray-400">Resolved</p>
          </div>
        </div>

        {/* My Issues Section */}
        <div id="my-issues" className="mb-6">
          <h3 className="text-xl font-bold mb-4">My Issues</h3>
          
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search issues by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "in-progress", "resolved"].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedStatus === status
                      ? "bg-purple-500 text-white"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Complaints Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-6 animate-pulse">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-white/10 rounded w-full mb-2"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
            ))
          ) : filteredComplaints.length > 0 ? (
            filteredComplaints.map((complaint) => (
              <div
                key={complaint.id}
                className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-white/10 rounded-xl p-6 hover:border-purple-400/30 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                    {complaint.status?.replace("-", " ")}
                  </span>
                  {getStatusIcon(complaint.status)}
                </div>
                <h3 className="text-lg font-bold mb-2 group-hover:text-purple-300 transition-colors">
                  {complaint.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{complaint.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{complaint.location}</span>
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-gray-500">
                  <span>{complaint.category?.charAt(0).toUpperCase() + complaint.category?.slice(1)}</span>
                  <span>{new Date(complaint.created_date).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-400">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No complaints found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}