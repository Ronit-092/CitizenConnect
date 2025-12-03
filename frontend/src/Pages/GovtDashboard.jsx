import { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  LogOut,
  Edit2,
  Send,
} from "lucide-react";
import MiniMap from "@/components/MiniMap";

const SAMPLE_COMPLAINTS = [
  {
    id: "1",
    title: "Pothole on Rajpath",
    description: "Large pothole causing traffic issues and vehicle damage",
    category: "road",
    status: "pending",
    created_date: "2024-01-15",
    location: "New Delhi, India",
    citizen_name: "Citizen 1",
    latitude: 28.6139,
    longitude: 77.209,
  },
  {
    id: "2",
    title: "Water supply disruption in Sector 5",
    description: "No water supply for 3 days in residential area",
    category: "water",
    status: "in-progress",
    created_date: "2024-01-14",
    location: "Noida, Uttar Pradesh",
    citizen_name: "Citizen 2",
    latitude: 28.5355,
    longitude: 77.391,
  },
  {
    id: "3",
    title: "Street light not working",
    description: "Street light at corner of MG Road is broken for a week",
    category: "utilities",
    status: "resolved",
    created_date: "2024-01-10",
    location: "Bangalore, Karnataka",
    citizen_name: "Citizen 3",
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    id: "4",
    title: "Uncovered manhole near metro station",
    description: "Open manhole is a safety hazard for pedestrians",
    category: "health",
    status: "pending",
    created_date: "2024-01-13",
    location: "Mumbai, Maharashtra",
    citizen_name: "Citizen 4",
    latitude: 19.0761,
    longitude: 72.8806,
  },
  {
    id: "5",
    title: "Garbage not collected for a week",
    description: "Waste accumulation in front of residential building",
    category: "water",
    status: "in-progress",
    created_date: "2024-01-12",
    location: "Kolkata, West Bengal",
    citizen_name: "Citizen 5",
    latitude: 22.5726,
    longitude: 88.3639,
  },
];

export default function GovtDashboard() {
  const [selectedStatus, setSelectedStatus] = useState("pending");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [updateRemark, setUpdateRemark] = useState("");

  const queryClient = useQueryClient();

  const { data: dbComplaints = [], isLoading } = useQuery({
    queryKey: ["complaints"],
    queryFn: () => base44.entities.Complaint.list("-created_date"),
  });

  const complaints = dbComplaints.length > 0 ? dbComplaints : SAMPLE_COMPLAINTS;

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Complaint.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["complaints"]);
    },
  });

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
    const matchesStatus = complaint.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || complaint.category === selectedCategory;
    return matchesStatus && matchesCategory;
  });

  const handleStatusUpdate = (complaintId, newStatus) => {
    updateMutation.mutate({
      id: complaintId,
      data: { status: newStatus },
    });
    if (selectedComplaint?.id === complaintId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

  const handleAddRemark = () => {
    if (selectedComplaint && updateRemark.trim()) {
      updateMutation.mutate({
        id: selectedComplaint.id,
        data: { remark: updateRemark },
      });
      setUpdateRemark("");
      alert("Remark added successfully!");
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === "pending").length,
    inProgress: complaints.filter((c) => c.status === "in-progress").length,
    resolved: complaints.filter((c) => c.status === "resolved").length,
  };

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
              <p className="text-xs text-gray-400">Government Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="#stats" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Overview</a>
            <a href="#complaints" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">Complaints</a>
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
        {/* Stats Cards */}
        <div id="stats" className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-white/10 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-purple-400 mb-2">{stats.total}</p>
            <p className="text-gray-400">Total Complaints</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500/10 to-red-900/10 border border-orange-500/30 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-orange-400 mb-2">{stats.pending}</p>
            <p className="text-gray-400">Pending</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-900/10 border border-yellow-500/30 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-yellow-400 mb-2">{stats.inProgress}</p>
            <p className="text-gray-400">In Progress</p>
          </div>
          <div className="bg-gradient-to-br from-teal-500/10 to-blue-900/10 border border-teal-500/30 rounded-xl p-6 text-center">
            <p className="text-4xl font-bold text-teal-400 mb-2">{stats.resolved}</p>
            <p className="text-gray-400">Resolved</p>
          </div>
        </div>

        {/* Main Content */}
        <div id="complaints" className="grid md:grid-cols-3 gap-8">
          {/* Complaints List */}
          <div className="md:col-span-2">
            <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-white/10 rounded-xl p-6">
              <div className="mb-6 pb-4 border-b border-white/10">
                <p className="text-xs text-gray-400 mb-3 font-semibold">STATUS</p>
                <div className="flex gap-2 mb-4 pb-4 border-b border-white/10 flex-wrap">
                  {["pending", "in-progress", "resolved"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatus(status);
                        setSelectedComplaint(null);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedStatus === status
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-400 mb-3 font-semibold">CATEGORY</p>
                <div className="flex flex-wrap gap-2">
                  {["all", "road", "water", "utilities", "health"].map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedComplaint(null);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                        selectedCategory === category
                          ? "bg-purple-500 text-white"
                          : "bg-white/10 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      {category === "all" ? "All" : category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      onClick={() => setSelectedComplaint(complaint)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedComplaint?.id === complaint.id
                          ? "bg-purple-500/20 border border-purple-400/30"
                          : "bg-white/5 hover:bg-white/10 border border-transparent"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{complaint.title}</h3>
                        {getStatusIcon(complaint.status)}
                      </div>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">{complaint.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{complaint.location}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No complaints found</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Complaint Details */}
          <div>
            {selectedComplaint ? (
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-white/10 rounded-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-4">Complaint Details</h2>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Title</p>
                    <p className="font-medium">{selectedComplaint.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Description</p>
                    <p className="text-sm text-gray-300">{selectedComplaint.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <p className="text-sm mb-2">{selectedComplaint.location}</p>
                    <MiniMap 
                      latitude={selectedComplaint.latitude} 
                      longitude={selectedComplaint.longitude} 
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Citizen</p>
                    <p className="text-sm">{selectedComplaint.citizen_name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Status</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedComplaint.status)}`}>
                      {selectedComplaint.status?.replace("-", " ")}
                    </span>
                  </div>
                </div>

                {/* Status Update */}
                <div className="mb-6">
                  <p className="text-xs text-gray-400 mb-2">Update Status</p>
                  <div className="flex gap-2 flex-wrap">
                    {["pending", "in-progress", "resolved"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedComplaint.id, status)}
                        disabled={selectedComplaint.status === status}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          selectedComplaint.status === status
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 text-gray-400 hover:bg-white/20"
                        } disabled:opacity-50`}
                      >
                        {status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Remark */}
                <div>
                  <p className="text-xs text-gray-400 mb-2">Add Remark</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={updateRemark}
                      onChange={(e) => setUpdateRemark(e.target.value)}
                      placeholder="Enter update or remark..."
                      className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 text-sm"
                    />
                    <button
                      onClick={handleAddRemark}
                      className="px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/30 border border-white/10 rounded-xl p-6 text-center">
                <Edit2 className="w-12 h-12 mx-auto text-gray-500 mb-4" />
                <p className="text-gray-400">Select a complaint to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}