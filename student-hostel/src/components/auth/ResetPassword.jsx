


import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Icons } from "../ui/InputIcons";
import { resetPassword } from "../../redux/slices/Thunks/authThunks";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get("token");
  const errorParam = searchParams.get("error");

  // Handle errors from URL
  useEffect(() => {
    if (errorParam === "invalid_token") {
      setError("Invalid reset token. Please request a new password reset.");
    } else if (errorParam === "expired_token") {
      setError("Reset token has expired. Please request a new password reset.");
    } else if (errorParam === "token_required") {
      setError("Reset token is missing. Please request a new password reset.");
    }
  }, [errorParam]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      // Call the actual API via Redux thunk
      await dispatch(resetPassword({ 
        token: token, 
        password: data.password 
      })).unwrap();
      setIsSuccess(true);
    } catch (err) {
      setError(err || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="auth-form-wrapper">
        <div className="auth-message auth-success-message fade-in">
          <div className="success-icon">
            <Icons.Check />
          </div>
          <h3>Password Reset Complete</h3>
          <p>
            Your password has been reset successfully. You can now log in with your
            new password.
          </p>
          <Link to="/login" className="auth-button" style={{ marginTop: "1rem" }}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-form-wrapper">
        <div className="auth-message auth-error fade-in">
          <Icons.AlertCircle />
          <span>{error || "Invalid reset link. Please request a new password reset."}</span>
        </div>
        <p className="auth-footer">
          Remember your password? <Link to="/login">Sign in</Link>
        </p>
        <p className="auth-footer">
          <Link to="/forgot-password">Request new reset link</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header fade-in">
        <h2>Reset Password</h2>
        <p>Enter your new password</p>
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
              id="password"
              type="password"
              placeholder="Enter new password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={errors.password ? "error" : ""}
            />
            <span className="input-icon">
              <Icons.Lock />
            </span>
            <label htmlFor="password">New Password</label>
          </div>
          {errors.password && (
            <span className="input-error-message">
              <Icons.AlertCircle />
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              className={errors.confirmPassword ? "error" : ""}
            />
            <span className="input-icon">
              <Icons.Lock />
            </span>
            <label htmlFor="confirmPassword">Confirm Password</label>
          </div>
          {errors.confirmPassword && (
            <span className="input-error-message">
              <Icons.AlertCircle />
              {errors.confirmPassword.message}
            </span>
          )}
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner spinner-sm"></span>
              Resetting...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
      </form>

      <p className="auth-footer">
        Remember your password? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default ResetPassword;


