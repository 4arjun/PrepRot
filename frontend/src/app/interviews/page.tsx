"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";

export default function Interviews() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/login");
          return;
        }
        setIsAuth(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
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

  if (!isAuth) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-blue-600 hover:text-blue-800 mr-4"
              >
                ← Back to Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Mock Interviews</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Schedule Interview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Interview</h3>
            <p className="text-gray-600 mb-4">
              Book a mock interview session with experienced interviewers.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Schedule Now
            </button>
          </div>

          {/* My Interviews */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">My Interviews</h3>
            <p className="text-gray-600 mb-4">
              View your upcoming and completed interview sessions.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
              View History
            </button>
          </div>
        </div>

        {/* Recent Interviews */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Interviews</h3>
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h4>
            <p className="text-gray-600">
              Schedule your first mock interview to start practicing!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
