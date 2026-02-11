import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Home,
  Calendar,
  Heart,
  Star,
  Search,
  ArrowRight,
  Clock,
  MapPin,
  TrendingUp,
} from "lucide-react";
import "./StudentOverview.css";

const StudentOverview = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { studentBookings } = useSelector((state) => state.booking);
  const { items: wishlistItems } = useSelector((state) => state.wishlist);

  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // Mock data for demonstration
  const mockStats = {
    totalBookings: 5,
    upcomingTrips: 2,
    wishlistCount: 8,
    reviewsGiven: 3,
  };

  const mockRecentBookings = [
    {
      id: 1,
      accommodation_name: "University View Hostel",
      location: "123 College Ave, Nairobi",
      check_in: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      check_out: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "confirmed",
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400",
    },
    {
      id: 2,
      accommodation_name: "Central Student Living",
      location: "456 Main Street, Nairobi",
      check_in: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      check_out: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
      status: "pending",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
    },
  ];

  const mockRecommended = [
    {
      id: 1,
      name: "Green Valley Hostel",
      location: "789 Park Road, Nairobi",
      price_per_night: 5500,
      rating: 4.0,
      image:
        "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400",
    },
    {
      id: 2,
      name: "Lakeside Accommodation",
      location: "321 Lake View, Kisumu",
      price_per_night: 7500,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1562503542-2a1e6f03b16b?w=400",
    },
    {
      id: 3,
      name: "Coastal View Hostel",
      location: "555 Ocean Drive, Mombasa",
      price_per_night: 7000,
      rating: 4.3,
      image:
        "https://images.unsplash.com/photo-1590508794514-f2a3c8b8edd4?w=400",
    },
  ];

  const mockUpcomingTrips = mockRecentBookings.filter(
    (booking) => new Date(booking.check_in) > new Date(),
  );

  return (
    <div className="student-overview">
      {/* Hero Section */}
      <div className="overview-hero">
        <div className="hero-content">
          <h1>
            {greeting}, {user?.first_name || "Student"}! 👋
          </h1>
          <p>Find your next home away from home</p>

          <div className="quick-search" onClick={() => navigate("/search")}>
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by location, university..."
            />
            <button className="search-btn">Search</button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dbeafe" }}>
            <Calendar size={24} color="#3b82f6" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{mockStats.totalBookings}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#dcfce7" }}>
            <Home size={24} color="#16a34a" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{mockStats.upcomingTrips}</span>
            <span className="stat-label">Upcoming Trips</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fee2e2" }}>
            <Heart size={24} color="#ef4444" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{mockStats.wishlistCount}</span>
            <span className="stat-label">Saved Properties</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: "#fef3c7" }}>
            <Star size={24} color="#f59e0b" />
          </div>
          <div className="stat-content">
            <span className="stat-value">{mockStats.reviewsGiven}</span>
            <span className="stat-label">Reviews Given</span>
          </div>
        </div>
      </div>

      {/* Upcoming Trips */}
      {mockUpcomingTrips.length > 0 && (
        <section className="overview-section">
          <div className="section-header">
            <h2>
              <Clock size={20} />
              Upcoming Trips
            </h2>
            <button
              className="view-all-btn"
              onClick={() => navigate("/student/my-bookings")}
            >
              View All
              <ArrowRight size={16} />
            </button>
          </div>

          <div className="trips-grid">
            {mockUpcomingTrips.map((booking) => (
              <div key={booking.id} className="trip-card">
                <img
                  src={booking.image}
                  alt={booking.accommodation_name}
                  className="trip-image"
                />
                <div className="trip-content">
                  <h3>{booking.accommodation_name}</h3>
                  <div className="trip-location">
                    <MapPin size={14} />
                    {booking.location}
                  </div>
                  <div className="trip-dates">
                    <Calendar size={14} />
                    {new Date(booking.check_in).toLocaleDateString()} -{" "}
                    {new Date(booking.check_out).toLocaleDateString()}
                  </div>
                  <span className={`trip-status ${booking.status}`}>
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick Actions */}
      <section className="overview-section">
        <div className="section-header">
          <h2>
            <TrendingUp size={20} />
            Quick Actions
          </h2>
        </div>

        <div className="quick-actions">
          <button className="action-card" onClick={() => navigate("/search")}>
            <Search size={28} />
            <span>Find Accommodation</span>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/student/wishlist")}
          >
            <Heart size={28} />
            <span>View Wishlist</span>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/student/my-bookings")}
          >
            <Calendar size={28} />
            <span>My Bookings</span>
          </button>

          <button
            className="action-card"
            onClick={() => navigate("/student/reviews")}
          >
            <Star size={28} />
            <span>My Reviews</span>
          </button>
        </div>
      </section>

      {/* Recommended for You */}
      <section className="overview-section">
        <div className="section-header">
          <h2>
            <Home size={20} />
            Recommended for You
          </h2>
          <button className="view-all-btn" onClick={() => navigate("/search")}>
            View All
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="recommended-grid">
          {mockRecommended.map((property) => (
            <div
              key={property.id}
              className="recommended-card"
              onClick={() => navigate(`/accommodations/${property.id}`)}
            >
              <img
                src={property.image}
                alt={property.name}
                className="recommended-image"
              />
              <div className="recommended-content">
                <h3>{property.name}</h3>
                <div className="recommended-location">
                  <MapPin size={14} />
                  {property.location}
                </div>
                <div className="recommended-footer">
                  <div className="recommended-rating">
                    <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    {property.rating}
                  </div>
                  <div className="recommended-price">
                    <span className="price">
                      KSh {property.price_per_night.toLocaleString()}
                    </span>
                    <span className="label">/night</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default StudentOverview;
