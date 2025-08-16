"use client";

import { useState } from "react";
import { login } from "../../../lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      window.location.href = "/home";
    } else {
      setError("Invalid username or password");
    }
  };

  // Redirect to Google OAuth
  const handleGoogleLogin = () => {
    const params = new URLSearchParams({
      client_id: "353607862709-5fhsk22m35ucilkd915jpo1rnl1lq3u9.apps.googleusercontent.com", // must be set in .env.local
      redirect_uri: "http://localhost:3000/auth/callback", // must match Google Console + backend settings
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-8 w-96 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        {/* Username / Password */}
        <input
          className="w-full p-2 border rounded-lg"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="w-full p-2 border rounded-lg"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google Login */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          >
            Continue with Google
          </button>
        </div>
      </form>
    </div>
  );
}
