import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Icons } from "../ui/InputIcons";
import { forgotPassword } from "../../redux/slices/Thunks/authThunks";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setError("");

    try {
      await dispatch(forgotPassword({ email: data.email })).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setError(err || "Failed to send reset email. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-form-wrapper">
        <div className="auth-message auth-success-message fade-in">
          <div className="success-icon">
            <Icons.Check />
          </div>
          <h3>Check Your Email</h3>
          <p>
            We've sent password reset instructions to your email address. Please
            check your inbox and follow the instructions.
          </p>
          <p className="auth-footer" style={{ marginTop: "1rem" }}>
            Didn't receive the email?{" "}
            <button
              type="button"
              className="text-button"
              onClick={() => setIsSuccess(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--primary-600)",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </p>
        </div>
        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header fade-in">
        <h2>Forgot Password?</h2>
        <p>Enter your email to reset your password</p>
      </div>

      {error && (
        <div className="auth-message auth-error fade-in">
          <Icons.AlertCircle />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="input-group">
          <div className="input-wrapper">
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={errors.email ? "error" : ""}
            />
            <span className="input-icon">
              <Icons.Mail />
            </span>
            <label htmlFor="email">Email Address</label>
          </div>
          {errors.email && (
            <span className="input-error-message">
              <Icons.AlertCircle />
              {errors.email.message}
            </span>
          )}
        </div>

        <button type="submit" className="auth-button">
          Send Reset Link
        </button>
      </form>

      <p className="auth-footer">
        Remember your password? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
