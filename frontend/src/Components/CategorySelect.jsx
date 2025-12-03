import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CATEGORIES = [
  { value: "road", label: "Road & Infrastructure" },
  { value: "water", label: "Water & Sanitation" },
  { value: "utilities", label: "Utilities" },
  { value: "health", label: "Health & Safety" },
  { value: "other", label: "Other" },
];

export default function CategorySelect({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedCategory = CATEGORIES.find((cat) => cat.value === value);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/20 text-white focus:outline-none focus:border-purple-400/50 transition-all flex items-center justify-between hover:border-white/30"
      >
        <span>{selectedCategory?.label || "Select Category"}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
{/* jffhythdcf */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a0a42] border border-white/20 rounded-lg shadow-2xl z-50 overflow-hidden">
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => {
                onChange(category.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left transition-colors ${
                value === category.value
                  ? "bg-purple-500/30 text-purple-300 border-l-2 border-purple-400"
                  : "text-white hover:bg-white/10"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}