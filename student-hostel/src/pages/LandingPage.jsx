import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Star, 
  Shield, 
  Clock, 
  Home, 
  Building2, 
  Users,
  ArrowRight,
  CheckCircle,
  Menu,
  X
} from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Featured accommodations (mock data for landing page)
  const featuredProperties = [
    {
      id: 1,
      name: "University View Hostel",
      location: "123 Campus Drive, Nairobi",
      type: "Hostel",
      price: 450,
      rating: 4.8,
      reviews: 124,
      image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      amenities: ["WiFi", "Security", "Study Room", "Cafeteria"]
    },
    {
      id: 2,
      name: "Central Student Living",
      location: "456 Main Street, Nairobi",
      type: "Apartment",
      price: 520,
      rating: 4.6,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      amenities: ["WiFi", "Gym", "Parking", "Laundry"]
    },
    {
      id: 3,
      name: "Campus Edge Apartments",
      location: "789 University Ave, Nairobi",
      type: "Apartment",
      price: 380,
      rating: 4.5,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800",
      amenities: ["WiFi", "Security", "Pool", "Garden"]
    }
  ];

  // Features list
  const features = [
    {
      icon: <Search size={32} />,
      title: "Easy Search",
      description: "Find your perfect accommodation with our powerful search and filtering options"
    },
    {
      icon: <Shield size={32} />,
      title: "Verified Listings",
      description: "All properties are verified by our team to ensure safety and quality"
    },
    {
      icon: <Clock size={32} />,
      title: "Instant Booking",
      description: "Book your stay instantly with our seamless booking process"
    },
    {
      icon: <Star size={32} />,
      title: "Honest Reviews",
      description: "Read real reviews from students who have stayed at these properties"
    }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className={`landing-nav ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="logo">
            <Building2 size={28} />
            <span>StudentHostel</span>
          </Link>

          <div className="nav-links desktop-nav">
            <a href="#properties">Properties</a>
            <a href="#features">Features</a>
            <a href="#how-it-works">How It Works</a>
          </div>

          <div className="nav-actions desktop-nav">
            <Link to="/login" className="btn-login">Log In</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </div>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <a href="#properties" onClick={() => setMobileMenuOpen(false)}>Properties</a>
            <a href="#features" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>How It Works</a>
            <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
            <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Find Your Perfect Student Home</h1>
          <p>Discover safe, affordable, and quality accommodations near your campus</p>
          
          <form className="search-box" onSubmit={handleSearch}>
            <div className="search-input-wrapper">
              <MapPin size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search by location, university, or area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button type="submit" className="search-btn">
              <Search size={20} />
              Search
            </button>
          </form>

          <div className="search-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Properties</span>
            </div>
            <div className="stat">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Students</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.5+</span>
              <span className="stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="properties" className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Featured Properties</h2>
            <p>Handpicked accommodations for students</p>
          </div>

          <div className="properties-grid">
            {featuredProperties.map((property) => (
              <div key={property.id} className="property-card" onClick={() => navigate(`/accommodations/${property.id}`)}>
                <div className="property-image">
                  <img src={property.image} alt={property.name} />
                  <span className="property-type">{property.type}</span>
                </div>
                <div className="property-content">
                  <h3>{property.name}</h3>
                  <p className="property-location">
                    <MapPin size={14} />
                    {property.location}
                  </p>
                  <div className="property-amenities">
                    {property.amenities.slice(0, 3).map((amenity, idx) => (
                      <span key={idx} className="amenity-tag">{amenity}</span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="amenity-tag">+{property.amenities.length - 3}</span>
                    )}
                  </div>
                  <div className="property-footer">
                    <div className="property-price">
                      <span className="price">KSh {property.price}</span>
                      <span className="period">/month</span>
                    </div>
                    <div className="property-rating">
                      <Star size={14} fill="#f59e0b" color="#f59e0b" />
                      <span>{property.rating}</span>
                      <span className="reviews">({property.reviews})</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="section-cta">
            <Link to="/accommodations" className="view-all-btn">
              View All Properties
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Why Choose StudentHostel?</h2>
            <p>We make finding student accommodation easy and safe</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Book your perfect accommodation in 3 simple steps</p>
          </div>

          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-icon"><Search size={32} /></div>
              <h3>Search</h3>
              <p>Browse through our verified listings and find the perfect place near your campus</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-icon"><Home size={32} /></div>
              <h3>Book</h3>
              <p>Choose your dates, select your room, and book instantly with secure payment</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-icon"><Users size={32} /></div>
              <h3>Move In</h3>
              <p>Receive confirmation and move into your new home with peace of mind</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Find Your New Home?</h2>
          <p>Join thousands of students who found their perfect accommodation</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn-primary">
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link to="/accommodations" className="btn-secondary">
              Browse Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo">
              <Building2 size={24} />
              <span>StudentHostel</span>
            </div>
            <p>Finding the perfect student accommodation made easy.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Help Center</a>
              <a href="#">Safety</a>
              <a href="#">FAQ</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 StudentHostel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

