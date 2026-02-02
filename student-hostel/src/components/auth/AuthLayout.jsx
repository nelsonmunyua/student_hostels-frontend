import { Outlet } from "react-router-dom";
import { Icons } from "../ui/InputIcons";

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      {/* Animated Background Shapes */}
      <div className="auth-bg-shapes">
        <div className="auth-shape auth-shape-1"></div>
        <div className="auth-shape auth-shape-2"></div>
        <div className="auth-shape auth-shape-3"></div>
      </div>

      <div className="auth-container">
        {/* Left Side - Branding Panel */}
        <div className="auth-branding">
          <div className="branding-content">
            <div className="brand-logo">
              <div className="brand-icon">
                <Icons.Building />
              </div>
              <span className="brand-name">StudentHostel</span>
            </div>

            <h1 className="branding-title">Find Your Perfect Student Home</h1>
            <p className="branding-subtitle">
              Discover comfortable, affordable, and convenient hostels near your
              campus.
            </p>

            <div className="branding-features">
              <div className="feature-item">
                <div className="feature-icon">
                  <Icons.MapPin />
                </div>
                <span>Prime locations near universities</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Icons.Wifi />
                </div>
                <span>High-speed internet included</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Icons.Coffee />
                </div>
                <span>Common areas & study rooms</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Icons.Shield />
                </div>
                <span>Safe & secure environment</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <Icons.GraduationCap />
                </div>
                <span>Study-focused community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form Panel */}
        <div className="auth-form-panel">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
