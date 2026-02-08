import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const navigate = useNavigate();
  const {
    login,
    signup,
    requestPasswordReset,
    loading,
    error,
    successMessage,
    isAuthenticated,
    clearErrorMessage,
    clearSuccess,
  } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  // Clear messages when component unmounts or tab changes
  useEffect(() => {
    return () => {
      clearErrorMessage();
      clearSuccess();
    };
  }, [clearErrorMessage, clearSuccess]);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(loginData);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const data = {
      first_name: signupData.first_name,
      last_name: signupData.last_name,
      email: signupData.email,
      phone: signupData.phone,
      password: signupData.password,
      role: signupData.role,
    };

    try {
      await signup(data);
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestPasswordReset(forgotEmail);
      setEmailSent(true);
    } catch (err) {
      console.error("Password reset request failed:", err);
    }
  };

  const renderTabs = () => (
    <div className="auth-tabs">
      <button
        className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
        onClick={() => {
          setActiveTab("login");
          clearErrorMessage();
          clearSuccess();
          setEmailSent(false);
        }}
      >
        Login
      </button>
      <button
        className={`tab-btn ${activeTab === "signup" ? "active" : ""}`}
        onClick={() => {
          setActiveTab("signup");
          clearErrorMessage();
          clearSuccess();
          setEmailSent(false);
        }}
      >
        Sign Up
      </button>
    </div>
  );

  const renderLoginForm = () => (
    <form onSubmit={handleLoginSubmit}>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={loginData.email}
        onChange={handleLoginChange}
        required
        disabled={loading}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleLoginChange}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p>
        <button
          type="button"
          className="link-btn"
          onClick={() => {
            setActiveTab("forgot");
            clearErrorMessage();
            clearSuccess();
            setEmailSent(false);
          }}
        >
          Forgot Password?
        </button>
      </p>
    </form>
  );

  const renderSignupForm = () => (
    <form onSubmit={handleSignupSubmit}>
      <div className="name-row">
        <input
          name="first_name"
          placeholder="First Name"
          value={signupData.first_name}
          onChange={handleSignupChange}
          required
          disabled={loading}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={signupData.last_name}
          onChange={handleSignupChange}
          required
          disabled={loading}
        />
      </div>
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={signupData.email}
        onChange={handleSignupChange}
        required
        disabled={loading}
      />
      <input
        name="phone"
        type="tel"
        placeholder="Phone Number"
        value={signupData.phone}
        onChange={handleSignupChange}
        required
        disabled={loading}
      />
      <select
        name="role"
        value={signupData.role}
        onChange={handleSignupChange}
        disabled={loading}
      >
        <option value="student">Student</option>
        <option value="host">Host</option>
      </select>
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={signupData.password}
        onChange={handleSignupChange}
        required
        disabled={loading}
      />
      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={signupData.confirmPassword}
        onChange={handleSignupChange}
        required
        disabled={loading}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating Account..." : "Create Account"}
      </button>
    </form>
  );

  const renderForgotForm = () => (
    <div>
      {emailSent ? (
        <div className="success-container">
          <p>Password reset link has been sent to your email.</p>
          <p>Please check your inbox and follow the instructions.</p>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setActiveTab("login");
              setEmailSent(false);
            }}
          >
            Back to Login
          </button>
        </div>
      ) : (
        <>
          <form onSubmit={handleForgotSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setActiveTab("login");
              clearErrorMessage();
              clearSuccess();
              setEmailSent(false);
            }}
          >
            Back to Login
          </button>
        </>
      )}
    </div>
  );

  const getTitle = () => {
    switch (activeTab) {
      case "login":
        return "Login";
      case "signup":
        return "Sign Up";
      case "forgot":
        return "Forgot Password";
      default:
        return "Login";
    }
  };

  const getSubtitle = () => {
    switch (activeTab) {
      case "login":
        return "Welcome back! Please login to your account";
      case "signup":
        return "Create your account to get started";
      case "forgot":
        return "Enter your email to receive a password reset link";
      default:
        return "";
    }
  };

  return (
    <div className="auth-container">
      <h2>{getTitle()}</h2>
      {getSubtitle() && <p className="auth-subtitle">{getSubtitle()}</p>}

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {activeTab !== "forgot" && renderTabs()}
      {activeTab === "login" && renderLoginForm()}
      {activeTab === "signup" && renderSignupForm()}
      {activeTab === "forgot" && renderForgotForm()}

      {activeTab === "login" && (
        <p className="auth-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setActiveTab("signup");
              clearErrorMessage();
              clearSuccess();
            }}
          >
            Sign up
          </button>
        </p>
      )}

      {activeTab === "signup" && (
        <p className="auth-footer">
          Already have an account?{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setActiveTab("login");
              clearErrorMessage();
              clearSuccess();
            }}
          >
            Login
          </button>
        </p>
      )}
    </div>
  );
};

export default AuthPage;
