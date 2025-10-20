"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated, logout } from "../../../lib/auth";

export default function Dashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/login");
          return;
        }
        setIsAuth(true);
        // TODO: Fetch user data from API
        setUser({ username: "User" }); // Placeholder
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
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

  const dashboardItems = [
    {
      title: "LeetCode Leaderboard",
      description: "View rankings and compete with peers",
      icon: "🏆",
      href: "/leaderboard",
      color: "bg-gradient-to-br from-yellow-400 to-orange-500"
    },
    {
      title: "Mock Interviews",
      description: "Schedule and participate in practice interviews",
      icon: "🎯",
      href: "/interviews",
      color: "bg-gradient-to-br from-blue-500 to-purple-600"
    },
    {
      title: "Problem Tracker",
      description: "Track your coding problem solutions",
      icon: "📝",
      href: "/problems",
      color: "bg-gradient-to-br from-green-500 to-teal-600"
    },
    {
      title: "User Profile",
      description: "Manage your profile and preferences",
      icon: "👤",
      href: "/profile",
      color: "bg-gradient-to-br from-purple-500 to-pink-600"
    },
    {
      title: "Interview Experiences",
      description: "Share and read interview experiences",
      icon: "💼",
      href: "/experiences",
      color: "bg-gradient-to-br from-indigo-500 to-blue-600"
    },
    {
      title: "Referral Network",
      description: "Connect for job referrals",
      icon: "🤝",
      href: "/referrals",
      color: "bg-gradient-to-br from-red-500 to-pink-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PrepRot</h1>
              <span className="ml-2 text-sm text-gray-500">Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">Welcome, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back!</h2>
          <p className="text-gray-600">Ready to level up your interview prep? Choose what you'd like to work on today.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Problems Solved</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mock Interviews</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Leaderboard Rank</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Streak</p>
                <p className="text-2xl font-bold text-gray-900">-- days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardItems.map((item, index) => (
            <div
              key={index}
              onClick={() => router.push(item.href)}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
            >
              <div className="bg-white rounded-xl shadow-sm hover:shadow-lg border p-6 h-full">
                <div className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl">{item.icon}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  <span>Get started</span>
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Section */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h3>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📊</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h4>
              <p className="text-gray-600">Start solving problems or schedule interviews to see your activity here.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
