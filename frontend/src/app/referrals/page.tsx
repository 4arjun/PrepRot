"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";

export default function Referrals() {
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
              <h1 className="text-2xl font-bold text-gray-900">Referral Network</h1>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Create Profile
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Seek Referrals</h3>
            <p className="text-gray-600 mb-4">
              Connect with professionals who can refer you to their companies.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
              Browse Referrers
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-4xl mb-4">💼</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Offer Referrals</h3>
            <p className="text-gray-600 mb-4">
              Help others by referring qualified candidates to your company.
            </p>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium">
              Become Referrer
            </button>
          </div>
        </div>

        {/* My Referral Profile */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">My Referral Profile</h3>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📄</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No profile created</h4>
              <p className="text-gray-600 mb-4">
                Create your referral profile to start connecting with others.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium">
                Create Profile
              </button>
            </div>
          </div>
        </div>

        {/* Available Referrers */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">Available Referrers</h3>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>All Companies</option>
                  <option>Google</option>
                  <option>Microsoft</option>
                  <option>Amazon</option>
                  <option>Meta</option>
                </select>
                <input
                  type="text"
                  placeholder="Search..."
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="p-8 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No referrers found</h4>
            <p className="text-gray-600">
              Referrers will appear here once they create their profiles.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
