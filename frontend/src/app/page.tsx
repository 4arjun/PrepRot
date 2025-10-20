"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../lib/auth";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (authenticated) {
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">PrepRot</h1>
          <p className="text-gray-600 mb-8">Your ultimate interview preparation platform</p>
          
          <div className="space-y-4">
            <Link 
              href="/login"
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Login
            </Link>
            
            <Link 
              href="/signup"
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
          
          <div className="mt-8 text-sm text-gray-500">
            <p>🏆 LeetCode Leaderboard • 🎯 Mock Interviews • 📝 Problem Tracking</p>
          </div>
        </div>
      </div>
    </div>
  );
}
