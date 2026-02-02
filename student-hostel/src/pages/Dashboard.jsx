import { Link } from "react-router-dom";

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User"}');
  const userInitial = (user.name || user.first_name || "U")
    .charAt(0)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-brand">
            <div className="dashboard-brand-icon">
              <Icons.Building />
            </div>
            <span className="dashboard-brand-text">StudentHostel</span>
          </div>

          <div className="user-info">
            <div className="user-avatar">{userInitial}</div>
            <span className="user-name">
              Welcome, {user.name || user.first_name || "Student"}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              <Icons.Logout />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="dashboard-content">
        {/* Welcome Card */}
        <div className="dashboard-card fade-in">
          <div className="dashboard-card-header">
            <h2>
              <Icons.Home />
              Your Dashboard
            </h2>
          </div>
          <p>
            Welcome to your student hostel dashboard. Here you can manage your
            bookings, explore available hostels, and access all the features of
            our platform.
          </p>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Active Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">0</div>
              <div className="stat-label">Saved Hostels</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">2</div>
              <div className="stat-label">Notifications</div>
            </div>
            <div className="stat-item">
              <div className="stat-value">5</div>
              <div className="stat-label">Days Since Signup</div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div
          className="dashboard-card fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="dashboard-card-header">
            <h2>
              <Icons.Settings />
              Quick Actions
            </h2>
          </div>
          <p>
            Quickly access the most commonly used features of your dashboard.
          </p>
          <div className="action-buttons">
            <Link to="/dashboard" className="action-btn primary">
              <Icons.Search />
              Browse Hostels
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Calendar />
              My Bookings
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Heart />
              Saved List
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Settings />
              Settings
            </Link>
          </div>
        </div>

        {/* Featured Hostels Card */}
        <div
          className="dashboard-card fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="dashboard-card-header">
            <h2>
              <Icons.Star />
              Featured Hostels
            </h2>
          </div>
          <p>Check out our top-rated hostels selected for students like you.</p>
          <div className="action-buttons">
            <Link to="/dashboard" className="action-btn">
              <Icons.MapPin />
              University View Hostel
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.MapPin />
              Central Student Living
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.MapPin />
              Campus Edge Apartments
            </Link>
          </div>
        </div>

        {/* Upcoming Events Card */}
        <div
          className="dashboard-card fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="dashboard-card-header">
            <h2>
              <Icons.Calendar />
              Campus Events
            </h2>
          </div>
          <p>
            Stay updated with upcoming events and activities at your hostel.
          </p>
          <div className="action-buttons">
            <Link to="/dashboard" className="action-btn">
              <Icons.Book />
              Study Group Tonight
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Coffee />
              Coffee & Chat
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.GraduationCap />
              Career Workshop
            </Link>
          </div>
        </div>

        {/* Payment & Billing Card */}
        <div
          className="dashboard-card fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          <div className="dashboard-card-header">
            <h2>
              <Icons.CreditCard />
              Payment & Billing
            </h2>
          </div>
          <p>
            Manage your payments, view invoices, and update payment methods.
          </p>
          <div className="action-buttons">
            <Link to="/dashboard" className="action-btn">
              <Icons.CreditCard />
              View Invoices
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Settings />
              Payment Methods
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Check />
              Payment History
            </Link>
          </div>
        </div>

        {/* Support Card */}
        <div
          className="dashboard-card fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          <div className="dashboard-card-header">
            <h2>
              <Icons.Shield />
              Help & Support
            </h2>
          </div>
          <p>Need help? Our support team is here to assist you 24/7.</p>
          <div className="action-buttons">
            <Link to="/dashboard" className="action-btn">
              <Icons.Book />
              FAQ
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.Mail />
              Contact Support
            </Link>
            <Link to="/dashboard" className="action-btn">
              <Icons.MessageCircle />
              Live Chat
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
