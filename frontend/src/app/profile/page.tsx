"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  college: string;
  role: string;
  leetcode_username: string;
  leetcode_score: number;
}

export default function Profile() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/login");
          return;
        }
        setIsAuth(true);
        await fetchUserData();
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = await response.json();
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

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
              <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                    value={user?.username || ""}
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                    value={user?.email || ""}
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={user?.college || ""}
                    placeholder="Your college name"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    To change your college, visit the leaderboard page
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={user?.role || ""}
                    placeholder="e.g., Student, Software Engineer"
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LeetCode Username</label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    value={user?.leetcode_username || ""}
                    placeholder="Your LeetCode username"
                    readOnly
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    To change your LeetCode username, visit the leaderboard page
                  </p>
                </div>
                
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Profile Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Profile Stats</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">LeetCode Score</span>
                  <span className="font-bold text-gray-900">{user?.leetcode_score || 0}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">College</span>
                  <span className="font-bold text-gray-900">{user?.college || "Not set"}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">LeetCode Username</span>
                  <span className="font-bold text-gray-900">{user?.leetcode_username || "Not connected"}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Role</span>
                  <span className="font-bold text-gray-900">{user?.role || "Not set"}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">Account Settings</h4>
              
              <div className="space-y-3">
                <button 
                  onClick={() => router.push("/leaderboard")}
                  className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-2 font-medium"
                >
                  Update LeetCode & College →
                </button>
                <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2">
                  Change Password
                </button>
                <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2">
                  Notification Settings
                </button>
                <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-2">
                  Privacy Settings
                </button>
                <hr />
                <button className="w-full text-left text-sm text-red-600 hover:text-red-800 py-2">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
