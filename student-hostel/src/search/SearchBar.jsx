import { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchAccommodations } from "../redux/slices/Thunks/accommodationThunks";
import { setFilters } from "../redux/slices/accommodationSlice";
import {
  Search,
  MapPin,
  X,
  Clock,
  Building,
  Star,
  History,
} from "lucide-react";
import "./SearchBar.css";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.accommodation);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState(filters.location || "");
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches");
      }
    }
  }, []);

  const popularLocations = [
    {
      name: "Nairobi",
      icon: "🏙️",
      universities: ["University of Nairobi", "Kenyatta University"],
    },
    {
      name: "Mombasa",
      icon: "🏖️",
      universities: ["Mombasa Technical University"],
    },
    { name: "Kisumu", icon: "🌆", universities: ["Maseno University"] },
    {
      name: "Nakuru",
      icon: "🏞️",
      universities: ["Egerton University (Nakuru Campus)"],
    },
    { name: "Eldoret", icon: "🏔️", universities: ["Moi University"] },
    { name: "Thika", icon: "🏘️", universities: ["Jomo Kenyatta University"] },
    { name: "Malindi", icon: "🏖️", universities: ["Coast University"] },
    { name: "Kitale", icon: "🌾", universities: ["University of Eldoret"] },
  ];

  const universities = [
    "University of Nairobi",
    "Kenyatta University",
    "Jomo Kenyatta University",
    "Moi University",
    "Egerton University",
    "Maseno University",
    "Kenyatta University",
    "Technical University of Kenya",
    "Strathmore University",
    "Mount Kenya University",
    "Africa Nazarene University",
    "Daystar University",
  ];

  const saveRecentSearch = useCallback((query) => {
    if (!query.trim()) return;

    setRecentSearches((prev) => {
      const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 10);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  }, []);

  const debouncedSearch = useCallback(
    (query) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (query.trim()) {
          dispatch(
            searchAccommodations({
              query: query.trim(),
              location: query.trim(),
              ...filters,
            }),
          );
          saveRecentSearch(query);
        }
      }, 300);
    },
    [dispatch, filters, saveRecentSearch],
  );

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      dispatch(setFilters({ location: searchQuery.trim() }));
      dispatch(
        searchAccommodations({
          query: searchQuery.trim(),
          location: searchQuery.trim(),
          ...filters,
        }),
      );
      saveRecentSearch(searchQuery.trim());
    } else {
      dispatch(searchAccommodations({ ...filters }));
    }
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleLocationSelect = (location) => {
    setSearchQuery(location);
    dispatch(setFilters({ location }));
    dispatch(
      searchAccommodations({
        query: location,
        location,
        ...filters,
      }),
    );
    saveRecentSearch(location);
    setShowSuggestions(false);
  };

  const handleUniversitySelect = (university) => {
    setSearchQuery(university);
    dispatch(setFilters({ location: university, university }));
    dispatch(
      searchAccommodations({
        query: university,
        location: university,
        university,
        ...filters,
      }),
    );
    saveRecentSearch(university);
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    dispatch(setFilters({ location: "" }));
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (e, query) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== query);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      return updated;
    });
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(true);
    debouncedSearch(value);
  };

  return (
    <div className={`search-bar-container ${isFocused ? "focused" : ""}`}>
      <form onSubmit={handleSearch} className="search-bar-form">
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search by location, university, or keyword..."
            value={searchQuery}
            onChange={handleInputChange}
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(true);
            }}
            onBlur={() => {
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            className="search-input"
            aria-label="Search accommodations"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="clear-button"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <button type="submit" className="search-button">
          <Search size={18} />
          <span>Search</span>
        </button>
      </form>

      {showSuggestions && (
        <div className="search-suggestions">
          {searchQuery ? (
            <div className="suggestions-list">
              <div className="suggestions-header">
                <Search size={14} />
                <span>Searching for "{searchQuery}"</span>
              </div>

              <button
                onClick={() => handleLocationSelect(searchQuery)}
                className="suggestion-item"
              >
                <MapPin size={16} />
                <div className="suggestion-content">
                  <span className="suggestion-main">Search all in</span>
                  <span className="suggestion-sub">{searchQuery}</span>
                </div>
              </button>

              {popularLocations
                .filter((loc) =>
                  loc.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .slice(0, 3)
                .map((location) => (
                  <button
                    key={location.name}
                    onClick={() => handleLocationSelect(location.name)}
                    className="suggestion-item"
                  >
                    <span className="location-emoji">{location.icon}</span>
                    <div className="suggestion-content">
                      <span className="suggestion-main">{location.name}</span>
                      <span className="suggestion-sub">City</span>
                    </div>
                  </button>
                ))}

              {universities
                .filter((uni) =>
                  uni.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .slice(0, 2)
                .map((university) => (
                  <button
                    key={university}
                    onClick={() => handleUniversitySelect(university)}
                    className="suggestion-item"
                  >
                    <Building size={16} />
                    <div className="suggestion-content">
                      <span className="suggestion-main">{university}</span>
                      <span className="suggestion-sub">University</span>
                    </div>
                  </button>
                ))}
            </div>
          ) : (
            <>
              {recentSearches.length > 0 && (
                <div className="recent-searches">
                  <div className="suggestions-header">
                    <Clock size={14} />
                    <span>Recent Searches</span>
                    <button
                      className="clear-all-btn"
                      onClick={clearRecentSearches}
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="recent-list">
                    {recentSearches.slice(0, 5).map((query) => (
                      <button
                        key={query}
                        onClick={() => handleLocationSelect(query)}
                        className="suggestion-item recent-item"
                      >
                        <History size={16} />
                        <span className="recent-query">{query}</span>
                        <button
                          className="remove-recent"
                          onClick={(e) => removeRecentSearch(e, query)}
                        >
                          <X size={14} />
                        </button>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="popular-locations">
                <div className="suggestions-header">
                  <Star size={14} />
                  <span>Popular Locations</span>
                </div>
                <div className="locations-grid">
                  {popularLocations.map((location) => (
                    <button
                      key={location.name}
                      onClick={() => handleLocationSelect(location.name)}
                      className="location-chip"
                    >
                      <span className="location-icon">{location.icon}</span>
                      <span className="location-name">{location.name}</span>
                      <MapPin size={12} className="chip-pin" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="quick-universities">
                <div className="suggestions-header">
                  <Building size={14} />
                  <span>Find Near Your University</span>
                </div>
                <div className="universities-scroll">
                  {universities.slice(0, 6).map((university) => (
                    <button
                      key={university}
                      onClick={() => handleUniversitySelect(university)}
                      className="university-chip"
                    >
                      <Building size={14} />
                      <span>{university}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
