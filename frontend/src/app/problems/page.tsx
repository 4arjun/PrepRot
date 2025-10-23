"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { isAuthenticated } from "../../../lib/auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface Problem {
  id: number;
  title: string;
  difficulty: string;
  topic: string;
  source: string;
  source_url: string;
  company_tags: string;
  is_solved: boolean;
  created_at: string;
}

interface ProblemStats {
  solved: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
  total: {
    easy: number;
    medium: number;
    hard: number;
    total: number;
  };
}

interface Filters {
  difficulty: string;
  topic: string;
  search: string;
}

export default function Problems() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [stats, setStats] = useState<ProblemStats | null>(null);
  const [filters, setFilters] = useState<Filters>({
    difficulty: 'all',
    topic: 'all',
    search: ''
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchProblems = useCallback(async () => {
    try {
      const token = localStorage.getItem("access");
      const params = new URLSearchParams();
      
      if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);
      if (filters.topic !== 'all') params.append('topic', filters.topic);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_URL}/problems/?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProblems(response.data);
    } catch (error) {
      console.error("Failed to fetch problems:", error);
    }
  }, [filters]);

  const fetchStats = useCallback(async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_URL}/problems/stats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/login");
          return;
        }
        setIsAuth(true);
        await Promise.all([fetchProblems(), fetchStats()]);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, fetchProblems, fetchStats]);

  const handleMarkProblem = async (problemId: number, currentStatus: boolean) => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem("access");
      const action = currentStatus ? 'unsolve' : 'solve';
      
      await axios.post(`${API_URL}/problems/${problemId}/solve/`, {
        action: action
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update the problem in the list
      setProblems(prevProblems => 
        prevProblems.map(problem => 
          problem.id === problemId 
            ? { ...problem, is_solved: !currentStatus }
            : problem
        )
      );
      
      // Refresh stats
      await fetchStats();
    } catch (error) {
      console.error("Failed to update problem status:", error);
      alert("Failed to update problem status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    if (isAuth) {
      fetchProblems();
    }
  }, [filters, isAuth, fetchProblems]);

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
              <h1 className="text-2xl font-bold text-gray-900">Problem Tracker</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.solved?.total || 0} / {stats?.total?.total || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Easy</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.solved?.easy || 0} / {stats?.total?.easy || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Medium</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.solved?.medium || 0} / {stats?.total?.medium || 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <span className="text-2xl">🔥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Hard</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats?.solved?.hard || 0} / {stats?.total?.hard || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Problem List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h3 className="text-xl font-bold text-gray-900">Problems ({problems.length})</h3>
              <div className="flex flex-wrap gap-2">
                <select 
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange({...filters, difficulty: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <select 
                  value={filters.topic}
                  onChange={(e) => handleFilterChange({...filters, topic: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Topics</option>
                  <option value="Arrays">Arrays</option>
                  <option value="Strings">Strings</option>
                  <option value="Linked Lists">Linked Lists</option>
                  <option value="Trees">Trees</option>
                  <option value="Dynamic Programming">Dynamic Programming</option>
                  <option value="Graphs">Graphs</option>
                </select>
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange({...filters, search: e.target.value})}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm min-w-48"
                />
              </div>
            </div>
          </div>
          
          {problems.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {problems.map((problem) => (
                <div key={problem.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <button
                          onClick={() => handleMarkProblem(problem.id, problem.is_solved)}
                          disabled={isUpdating}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            problem.is_solved
                              ? 'bg-green-500 border-green-500 text-white'
                              : 'border-gray-300 hover:border-green-500'
                          }`}
                        >
                          {problem.is_solved && <span className="text-sm">✓</span>}
                        </button>
                        
                        <h4 className={`text-lg font-medium ${
                          problem.is_solved ? 'text-green-600 line-through' : 'text-gray-900'
                        }`}>
                          {problem.title}
                        </h4>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          problem.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                          problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                        </span>
                        
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {problem.topic}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Source: {problem.source}</span>
                        {problem.company_tags && (
                          <span>Companies: {problem.company_tags}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {problem.source_url && (
                        <a
                          href={problem.source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                          Solve on LeetCode →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No problems found</h4>
              <p className="text-gray-600">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
