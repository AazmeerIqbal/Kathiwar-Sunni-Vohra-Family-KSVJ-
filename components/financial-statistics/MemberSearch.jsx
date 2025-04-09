import React, { useState, useEffect } from "react";
import { Search, Loader } from "lucide-react";

const MemberSearch = ({ onMemberSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/searchMembers/${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.members);
        setShowResults(true);
      } else {
        console.error("Error searching members:", data.message);
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle search when user types (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleMemberClick = (member) => {
    onMemberSelect(member);
    setShowResults(false);
  };

  return (
    <div className="w-full mb-6 relative">
      <div className="flex items-center w-full border border-gray-300 rounded-lg overflow-hidden">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or membership number..."
          className="flex-grow p-2 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 flex items-center"
        >
          {loading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </button>
      </div>

      {showResults && searchResults.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-y-auto">
          {searchResults.map((member) => (
            <div
              key={member.memberId}
              className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
              onClick={() => handleMemberClick(member)}
            >
              {member.PicPath && (
                <img
                  src={member.PicPath}
                  alt={member.MemberName}
                  className="w-8 h-8 rounded-full mr-2 object-cover"
                />
              )}
              <div>
                <div className="font-medium">{member.MemberName}</div>
                <div className="text-sm text-gray-600">
                  {member.MemberShipNo} • {member.CNICNo}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showResults && searchResults.length === 0 && !loading && (
        <div className="absolute z-10 w-full mt-1 bg-white shadow-lg rounded-lg border border-gray-300 p-3 text-center text-gray-500">
          No members found. Try a different search.
        </div>
      )}
    </div>
  );
};

export default MemberSearch;
