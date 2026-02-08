import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const {
    requestPasswordReset,
    loading,
    error,
    successMessage,
    clearErrorMessage,
    clearSuccess,
  } = useAuth();

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      clearErrorMessage();
      clearSuccess();
    };
  }, [clearErrorMessage, clearSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await requestPasswordReset(email);
      setEmailSent(true);
    } catch (err) {
      // Error is already set in Redux state
      console.error("Password reset request failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Forgot Password</h2>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {emailSent ? (
        <div className="success-container">
          <p>Password reset link has been sent to your email.</p>
          <p>Please check your inbox and follow the instructions.</p>
          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <p>
            <Link to="/login">Back to Login</Link>
          </p>
        </>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
