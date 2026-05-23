import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../lib/apiBase.js";

function Authentication({ onSuccess }) {
  const { setAuthSession } = useAuth();
  const [mode, setMode] = useState("signin");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isSignUp = mode === "signup";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleModeChange = () => {
    setMode(isSignUp ? "signin" : "signup");
    setError("");
    setSuccessMessage("");
    setShowPassword(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    if (isSignUp && !formData.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = isSignUp ? "/users/register" : "/users/login";
      const payload = isSignUp
        ? {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
          }
        : {
            email: formData.email.trim(),
            password: formData.password,
          };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Authentication failed");
      }

      setAuthSession({
        user: result.data || null,
        token: result.token || "",
      });

      setSuccessMessage(result.message || (isSignUp ? "Account created" : "Login successful"));
      setFormData({
        fullName: "",
        email: "",
        password: "",
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (submitError) {
      setError(submitError.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <main className="flex items-center justify-center w-full px-4">
        <form className="flex w-full max-w-96 flex-col" onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
              NOMAD.
            </p>
            <div className="mt-3 h-px w-16 bg-black/20" />
          </div>

          <h2 className="text-4xl font-medium text-gray-900">
            {isSignUp ? "Sign up" : "Sign in"}
          </h2>

          <p className="mt-4 text-base text-black/60">
            {isSignUp
              ? "Please enter your details to create your account."
              : "Please enter email and password to access."}
          </p>

          {isSignUp ? (
            <div className="mt-10">
              <label className="font-medium">Full Name</label>
              <input
                placeholder="Please enter your full name"
                className="mt-2 w-full rounded-md border border-black/10 bg-[#f7f4ee] px-3 py-3 outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/10"
                required
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          ) : null}

          <div className={isSignUp ? "mt-6" : "mt-10"}>
            <label className="font-medium">Email</label>
            <input
              placeholder="Please enter your email"
              className="mt-2 w-full rounded-md border border-black/10 bg-[#f7f4ee] px-3 py-3 outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/10"
              required
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mt-6">
            <label className="font-medium">Password</label>
            <div className="relative mt-2">
              <input
                placeholder="Please enter your password"
                className="w-full rounded-md border border-black/10 bg-[#f7f4ee] px-3 py-3 pr-12 outline-none transition focus:border-black/30 focus:ring-2 focus:ring-black/10"
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-black/60 transition-colors hover:text-black"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
          {successMessage ? <p className="mt-4 text-sm text-green-700">{successMessage}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full cursor-pointer rounded-md bg-black py-3 text-[#f7f4ee] transition hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : isSignUp ? "Create Account" : "Login"}
          </button>
          <p className="text-center py-8">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={handleModeChange}
              className="font-medium text-black hover:underline"
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </form>
      </main>
    </>
  );
}

export default Authentication;
