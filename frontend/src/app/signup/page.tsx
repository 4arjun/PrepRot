"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signup, isAuthenticated } from "../../../lib/auth";

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          router.push("/home");
          return;
        }
      } catch (authError) {
        console.error("Auth check failed:", authError);
      }
    };

    checkAuth();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      return;
    }

    if (password.length < 6) {
      setErrors({ password: "Password must be at least 6 characters long" });
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(username, email, password);
      
      if (result.success) {
        setMessage("Account created successfully! Please log in.");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setTimeout(() => {
          router.push("/login");
        }, 1000);
      } else {
        setErrors(result.errors);
        setMessage(result.message);
      }
    } catch {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>

        {message && (
          <p className={`text-sm text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <div>
          <input
            className="w-full p-2 border rounded-lg"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        <div>
          <input
            className="w-full p-2 border rounded-lg"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div>
          <input
            className="w-full p-2 border rounded-lg"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <div>
          <input
            className="w-full p-2 border rounded-lg"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-600 hover:text-blue-700 underline"
            >
              Log in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
