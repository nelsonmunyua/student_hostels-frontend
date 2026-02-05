import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icons } from "../ui/InputIcons";
import { loginUser } from "../../redux/slices/Thunks/authThunks";
import { getRedirectPath } from "../../utils/roleRedirect.jsx";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, user, loading, error } = useSelector(
    (state) => state.auth,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (isAuthenticated) {
      // Role-based redirect after login
      const redirectPath = getRedirectPath(user?.role);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(loginUser(data)).unwrap();

      // Role-based redirect after successful login
      const redirectPath = getRedirectPath(result.user.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header fade-in">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
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

        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? (
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
        Do not have an account?{" "}
        <Link to="/signup" className="auth-link">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
