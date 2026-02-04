import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icons } from "../ui/InputIcons";
import { loginUser } from "../../redux/slices/Thunks/authThunks";

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    try {
      const result = await dispatch(loginUser(data)).unwrap();

      // Check if user is admin
      if (result.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        // Non-admin users get access denied
        setError("Access Denied: Only administrators can access this portal.");
        // Clear the auth state
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if already authenticated as admin
  if (isAuthenticated && user?.role === "admin") {
    navigate("/admin", { replace: true });
  }

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header fade-in">
        <h2>Admin Portal</h2>
        <p>Sign in to access the admin dashboard</p>
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

        <div className="input-group">
          <div className="input-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
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
            <label htmlFor="password">Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
            </button>
          </div>
          {errors.password && (
            <span className="input-error-message">
              <Icons.AlertCircle />
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="form-options">
          <label className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox-input"
              {...register("rememberMe")}
            />
            <span className="checkbox-custom">
              <Icons.Check />
            </span>
            <span className="checkbox-label">Remember me</span>
          </label>
          <Link to="/forgot-password" className="forgot-password-link">
            Forgot Password?
          </Link>
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner spinner-sm"></span>
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="auth-footer">
        Admin access only. Contact system administrator for access.
      </p>
    </div>
  );
};

export default LoginForm;
