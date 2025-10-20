"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Leaderboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [leetcodeUsername, setLeetcodeUsername] = useState("");
  const [college, setCollege] = useState("");
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [isUpdatingScore, setIsUpdatingScore] = useState(false);

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
        await fetchLeaderboard();
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
      const response = await axios.get(`${API_URL}/user/profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
      
      // Check if user has LeetCode username or college
      if (!response.data.leetcode_username || !response.data.college) {
        setShowUsernameModal(true);
        // Pre-fill existing values if available
        if (response.data.leetcode_username) {
          setLeetcodeUsername(response.data.leetcode_username);
        }
        if (response.data.college) {
          setCollege(response.data.college);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_URL}/leaderboard/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLeaderboardData(response.data);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    }
  };

  const handleSaveLeetcodeUsername = async () => {
    if (!leetcodeUsername.trim() || !college.trim()) {
      alert("Please fill in both LeetCode username and college.");
      return;
    }
    
    setIsUpdatingScore(true);
    try {
      const token = localStorage.getItem("access");
      
      // Save username, college and update score
      await axios.post(`${API_URL}/user/update-leetcode/`, {
        leetcode_username: leetcodeUsername,
        college: college
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowUsernameModal(false);
      await fetchUserData();
      await fetchLeaderboard();
    } catch (error) {
      console.error("Failed to update profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setIsUpdatingScore(false);
    }
  };

  const refreshScores = async () => {
    setIsUpdatingScore(true);
    try {
      const token = localStorage.getItem("access");
      await axios.post(`${API_URL}/leaderboard/refresh-scores/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchLeaderboard();
    } catch (error) {
      console.error("Failed to refresh scores:", error);
      alert("Failed to refresh scores. Please try again.");
    } finally {
      setIsUpdatingScore(false);
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
              <h1 className="text-2xl font-bold text-gray-900">LeetCode Leaderboard</h1>
              {user?.college && (
                <span className="ml-4 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {user.college}
                </span>
              )}
            </div>
            <button
              onClick={refreshScores}
              disabled={isUpdatingScore}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium"
            >
              {isUpdatingScore ? "Updating..." : "Refresh Scores"}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Stats */}
        {user && (
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Your Stats</h3>
                <p className="text-sm text-gray-600">
                  LeetCode: {user.leetcode_username || "Not connected"}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{user.leetcode_score || 0}</div>
                <div className="text-sm text-gray-600">Total Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">
              {user?.college ? `${user.college} Leaderboard` : "Leaderboard"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Rankings based on LeetCode problem-solving scores
            </p>
          </div>
          
          {leaderboardData.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {leaderboardData.map((entry, index) => (
                <div key={entry.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0 ? "bg-yellow-100 text-yellow-800" :
                      index === 1 ? "bg-gray-100 text-gray-800" :
                      index === 2 ? "bg-orange-100 text-orange-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium text-gray-900">{entry.username}</div>
                      <div className="text-sm text-gray-600">
                        LeetCode: {entry.leetcode_username}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">{entry.leetcode_score}</div>
                    <div className="text-sm text-gray-600">points</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🏆</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No rankings yet</h4>
              <p className="text-gray-600">
                Be the first to add your LeetCode username and start competing!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* LeetCode Username Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Complete Your Profile</h3>
              <p className="text-gray-600">
                Add your college and LeetCode username to join your college's leaderboard!
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  College Name *
                </label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g., MEC, NIT Calicut, IIT Delhi"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LeetCode Username *
                </label>
                <input
                  type="text"
                  value={leetcodeUsername}
                  onChange={(e) => setLeetcodeUsername(e.target.value)}
                  placeholder="Enter your LeetCode username"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowUsernameModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg"
              >
                Skip for now
              </button>
              <button
                onClick={handleSaveLeetcodeUsername}
                disabled={isUpdatingScore || !leetcodeUsername.trim() || !college.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isUpdatingScore ? "Saving..." : "Save & Join Leaderboard"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
