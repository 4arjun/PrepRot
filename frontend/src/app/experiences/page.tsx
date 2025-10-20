"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";

export default function Experiences() {
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
              <h1 className="text-2xl font-bold text-gray-900">Interview Experiences</h1>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Share Experience
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Companies</option>
              <option>Google</option>
              <option>Microsoft</option>
              <option>Amazon</option>
              <option>Meta</option>
            </select>
            
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>All Roles</option>
              <option>Software Engineer</option>
              <option>Data Scientist</option>
              <option>Product Manager</option>
              <option>DevOps Engineer</option>
            </select>
            
            <input
              type="text"
              placeholder="Search experiences..."
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-64"
            />
            
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium">
              Filter
            </button>
          </div>
        </div>

        {/* Experiences List */}
        <div className="space-y-6">
          {/* Sample Experience Card */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Software Engineer - Google</h3>
                <p className="text-sm text-gray-600">Shared by @anonymous • 2 days ago</p>
              </div>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                Positive
              </span>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Round Details:</h4>
              <p className="text-gray-600 text-sm">
                3 rounds: Technical phone screen, System design, Behavioral + Coding
              </p>
            </div>
            
            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">Overall Feedback:</h4>
              <p className="text-gray-600 text-sm">
                Great experience overall. Interviewers were friendly and the questions were fair. 
                Make sure to practice system design and have good examples for behavioral questions.
              </p>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>March 15, 2024</span>
              <div className="flex space-x-4">
                <button className="hover:text-blue-600">👍 12</button>
                <button className="hover:text-blue-600">💬 3</button>
                <button className="hover:text-blue-600">🔗 Share</button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No more experiences</h4>
            <p className="text-gray-600 mb-4">
              Be the first to share your interview experience and help others!
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
              Share Your Experience
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
