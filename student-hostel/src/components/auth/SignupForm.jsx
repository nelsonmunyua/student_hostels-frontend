import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Icons } from "../ui/InputIcons";
import { signupUser } from "../../redux/slices/Thunks/authThunks";
import { getRedirectPath } from "../../utils/roleRedirect.jsx";

const SignupForm = () => {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const { error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const result = await dispatch(signupUser(data)).unwrap();
      const redirectPath = getRedirectPath(result.user.role);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-form-header fade-in">
        <h2>Create Account</h2>
        <p>Join our student hostels platform today</p>
      </div>

      {error && (
        <div className="auth-message auth-error fade-in">
          <Icons.AlertCircle />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <div className="form-row">
          <div className="input-group">
            <div className="input-wrapper">
              <input
                id="firstName"
                type="text"
                placeholder="Enter first name"
                {...register("first_name", {
                  required: "First name is required",
                })}
                className={errors.first_name ? "error" : ""}
              />
              <span className="input-icon">
                <Icons.User />
              </span>
              <label htmlFor="firstName">First Name</label>
            </div>
            {errors.first_name && (
              <span className="input-error-message">
                <Icons.AlertCircle />
                {errors.first_name.message}
              </span>
            )}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <input
                id="lastName"
                type="text"
                placeholder="Enter last name"
                {...register("last_name", {
                  required: "Last name is required",
                })}
                className={errors.last_name ? "error" : ""}
              />
              <span className="input-icon">
                <Icons.User />
              </span>
              <label htmlFor="lastName">Last Name</label>
            </div>
            {errors.last_name && (
              <span className="input-error-message">
                <Icons.AlertCircle />
                {errors.last_name.message}
              </span>
            )}
          </div>
        </div>

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
              id="phone"
              type="tel"
              placeholder="Enter phone number"
              {...register("phone", {
                required: "Phone number is required",
              })}
              className={errors.phone ? "error" : ""}
            />
            <span className="input-icon">
              <Icons.Phone />
            </span>
            <label htmlFor="phone">Phone Number</label>
          </div>
          {errors.phone && (
            <span className="input-error-message">
              <Icons.AlertCircle />
              {errors.phone.message}
            </span>
          )}
        </div>

        <div className="input-group">
          <div className="input-wrapper">
            <select
              id="role"
              {...register("role", {
                required: "Please select a role",
              })}
              className={errors.role ? "error" : ""}
            >
              <option value="">Select your role</option>
              <option value="student">Student</option>
              <option value="host">Host</option>
            </select>
            <span className="input-icon">
              <Icons.User />
            </span>
            <label htmlFor="role">Role</label>
          </div>
          {errors.role && (
            <span className="input-error-message">
              <Icons.AlertCircle />
              {errors.role.message}
            </span>
          )}
        </div>

        <div className="form-row">
          <div className="input-group">
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create password"
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

          <div className="input-group">
            <div className="input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
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
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex={-1}
              >
                {showConfirmPassword ? <Icons.EyeOff /> : <Icons.Eye />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="input-error-message">
                <Icons.AlertCircle />
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>

        <div className="form-options">
          <label className="checkbox-group">
            <input
              type="checkbox"
              className="checkbox-input"
              {...register("terms", {
                required: "You must accept the terms",
              })}
            />
            <span className="checkbox-custom">
              <Icons.Check />
            </span>
            <span className="checkbox-label">
              I agree to the <a href="/terms">Terms of Service</a> and{" "}
              <a href="/privacy">Privacy Policy</a>
            </span>
          </label>
        </div>
        {errors.terms && (
          <span className="input-error-message" style={{ marginTop: "-1rem" }}>
            <Icons.AlertCircle />
            {errors.terms.message}
          </span>
        )}

        <button type="submit" className="auth-button">
          Create Account
        </button>
      </form>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default SignupForm;
