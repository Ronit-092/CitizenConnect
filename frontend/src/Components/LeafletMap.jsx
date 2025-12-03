import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { Search, MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition, onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng, `${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function MapController({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

export default function LeafletMap({ onLocationSelect, initialLat = 28.6139, initialLng = 77.209 }) {
  const [position, setPosition] = useState([initialLat, initialLng]);
  const [searchInput, setSearchInput] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchInput
        )}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon, display_name } = data[0];
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);
        setPosition([latNum, lonNum]);
        setSelectedAddress(display_name);
        onLocationSelect(latNum, lonNum, display_name);
        setSearchInput("");
      } else {
        alert("Location not found. Please try a different search.");
      }
    } catch (error) {
      console.error("Error searching location:", error);
      alert("Error searching location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat, lng, address) => {
    setSelectedAddress(address);
    onLocationSelect(lat, lng, address);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Search location (e.g., Mumbai, Delhi)..."
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:border-purple-400/50 focus:bg-white/10 transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg bg-purple-500 text-white font-medium hover:bg-purple-600 transition-all disabled:opacity-50"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </div>

      {/* Map */}
      <div className="w-full rounded-lg overflow-hidden border border-white/20 shadow-xl relative z-0" style={{ height: "350px" }}>
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker
            position={position}
            setPosition={setPosition}
            onLocationSelect={handleLocationSelect}
          />
          <MapController center={position} />
        </MapContainer>
      </div>

      {/* Selected Location Display */}
      {selectedAddress && (
        <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-400/30">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-purple-300 font-medium">{selectedAddress}</p>
              <p className="text-xs text-gray-400 mt-1">
                Lat: {position[0].toFixed(4)}, Lng: {position[1].toFixed(4)}
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400">
        💡 Click anywhere on the map or use the search to select your location
      </p>
    </div>
  );
}