import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DashboardHeader from "../components/dashboard/admin/components/Header";
import DashboardSidebar from "../components/dashboard/admin/components/Sidebar";
import { Icons } from "../components/ui/InputIcons";

const Dashboard = () => {
  const user = JSON.parse(
    localStorage.getItem("user") || '{"name":"User","first_name":"Student"}',
  );
  const navigate = useNavigate();

  const userInitial = (user.name || user.first_name || "U")
    .charAt(0)
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const [activeTab, setActiveTab] = useState("overview");

  const menuItems = [
    { id: "overview", label: "Overview", icon: "Home" },
    { id: "bookings", label: "My Bookings", icon: "Calendar" },
    { id: "saved", label: "Saved Hostels", icon: "Heart" },
    { id: "payments", label: "Payments", icon: "CreditCard" },
    { id: "settings", label: "Settings", icon: "Settings" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  // Handle dashboard action clicks
  const handleActionClick = (actionType, destination) => {
    if (destination) {
      navigate(destination);
    } else {
      alert(`Navigating to ${actionType}... (Demo)`);
    }
  };

  return (
    <div className="dashboard">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <DashboardSidebar
        menuItems={menuItems}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

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
            <Link
              to="/dashboard"
              className="action-btn primary"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Browse Hostels", "/browse");
              }}
            >
              <Icons.Search />
              Browse Hostels
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("My Bookings", "/bookings");
              }}
            >
              <Icons.Calendar />
              My Bookings
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Saved List", "/wishlist");
              }}
            >
              <Icons.Heart />
              Saved List
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Settings", "/settings");
              }}
            >
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
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("University View Hostel", "/accommodations");
              }}
            >
              <Icons.MapPin />
              University View Hostel
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Central Student Living", "/accommodations");
              }}
            >
              <Icons.MapPin />
              Central Student Living
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Campus Edge Apartments", "/accommodations");
              }}
            >
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
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Study Group", "/events");
              }}
            >
              <Icons.Book />
              Study Group Tonight
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Coffee & Chat", "/events");
              }}
            >
              <Icons.Coffee />
              Coffee & Chat
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Career Workshop", "/events");
              }}
            >
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
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("View Invoices", "/invoices");
              }}
            >
              <Icons.CreditCard />
              View Invoices
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Payment Methods", "/payment-methods");
              }}
            >
              <Icons.Settings />
              Payment Methods
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Payment History", "/payment-history");
              }}
            >
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
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("FAQ", "/faq");
              }}
            >
              <Icons.Book />
              FAQ
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Contact Support", "/contact");
              }}
            >
              <Icons.Mail />
              Contact Support
            </Link>
            <Link
              to="/dashboard"
              className="action-btn"
              onClick={(e) => {
                e.preventDefault();
                handleActionClick("Live Chat", "/chat");
              }}
            >
              <Icons.MessageCircle />
              Live Chat
            </Link>
          </div>
        </div>
      </main>

      <style>{`
        .dashboard {
          min-height: 100vh;
          background-color: #f3f4f6;
        }

        .dashboard-content {
          margin-left: 260px;
          margin-top: 64px;
          padding: 24px;
          min-height: calc(100vh - 64px);
        }

        .dashboard-card {
          background-color: #ffffff;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 24px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          border: 1px solid #e5e7eb;
        }

        .dashboard-card-header {
          margin-bottom: 16px;
        }

        .dashboard-card-header h2 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .dashboard-card p {
          color: #6b7280;
          margin-bottom: 20px;
          line-height: 1.6;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .stat-item {
          text-align: center;
          padding: 16px;
          background-color: #f9fafb;
          border-radius: 8px;
        }

        .stat-value {
          font-size: 28px;
          font-weight: 700;
          color: #0369a1;
          margin-bottom: 4px;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .action-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background-color: #f3f4f6;
          color: #374151;
          border-radius: 8px;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background-color: #e5e7eb;
        }

        .action-btn.primary {
          background-color: #0369a1;
          color: #ffffff;
        }

        .action-btn.primary:hover {
          background-color: #075985;
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
