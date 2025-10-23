"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function Experiences() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [filters, setFilters] = useState({
    company: 'all',
    role: 'all',
    experience_type: 'all',
    search: ''
  });
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    date: '',
    round_details: '',
    overall_feedback: '',
    experience_type: 'neutral',
    outcome: 'pending',
    difficulty_rating: 3,
    preparation_time: 0,
    tips_and_advice: '',
    is_anonymous: true
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        if (!authenticated) {
          router.push("/login");
          return;
        }
        setIsAuth(true);
        await fetchExperiences();
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchExperiences = async () => {
    try {
      const token = localStorage.getItem("access");
      const params = new URLSearchParams();
      
      if (filters.company !== 'all') params.append('company', filters.company);
      if (filters.role !== 'all') params.append('role', filters.role);
      if (filters.experience_type !== 'all') params.append('experience_type', filters.experience_type);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_URL}/interviews/experiences/?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExperiences(response.data);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              name === 'difficulty_rating' || name === 'preparation_time' ? parseInt(value) || 0 : value
    }));
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSubmit = async () => {
    if (!formData.company.trim() || !formData.role.trim() || !formData.date || 
        !formData.round_details.trim() || !formData.overall_feedback.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(`${API_URL}/interviews/experiences/create/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowCreateModal(false);
      setFormData({
        company: '',
        role: '',
        date: '',
        round_details: '',
        overall_feedback: '',
        experience_type: 'neutral',
        outcome: 'pending',
        difficulty_rating: 3,
        preparation_time: 0,
        tips_and_advice: '',
        is_anonymous: true
      });
      await fetchExperiences();
      alert(response.data.message);
    } catch (error: any) {
      console.error("Failed to create experience:", error);
      alert(error.response?.data?.error || "Failed to create experience. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      fetchExperiences();
    }
  }, [filters, isAuth]);

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
            <button 
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
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
            <select 
              value={filters.company}
              onChange={(e) => handleFilterChange({...filters, company: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Companies</option>
              <option value="Google">Google</option>
              <option value="Microsoft">Microsoft</option>
              <option value="Amazon">Amazon</option>
              <option value="Meta">Meta</option>
              <option value="Apple">Apple</option>
              <option value="Netflix">Netflix</option>
            </select>
            
            <select 
              value={filters.role}
              onChange={(e) => handleFilterChange({...filters, role: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Roles</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="Product Manager">Product Manager</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
            </select>
            
            <select 
              value={filters.experience_type}
              onChange={(e) => handleFilterChange({...filters, experience_type: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Types</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
            
            <input
              type="text"
              placeholder="Search experiences..."
              value={filters.search}
              onChange={(e) => handleFilterChange({...filters, search: e.target.value})}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm flex-1 min-w-64"
            />
          </div>
        </div>

        {/* Experiences List */}
        <div className="space-y-6">
          {experiences.length > 0 ? (
            experiences.map((experience) => (
              <div key={experience.id} className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {experience.role} - {experience.company}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Shared by {experience.author} • {new Date(experience.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      experience.experience_type === 'positive' ? 'bg-green-100 text-green-800' :
                      experience.experience_type === 'negative' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {experience.experience_type.charAt(0).toUpperCase() + experience.experience_type.slice(1)}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      experience.outcome === 'selected' ? 'bg-green-100 text-green-800' :
                      experience.outcome === 'rejected' ? 'bg-red-100 text-red-800' :
                      experience.outcome === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {experience.outcome.charAt(0).toUpperCase() + experience.outcome.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Difficulty</h4>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg ${
                            star <= experience.difficulty_rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Preparation Time</h4>
                    <p className="text-sm text-gray-900">{experience.preparation_time} weeks</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Interview Date</h4>
                    <p className="text-sm text-gray-900">{new Date(experience.date).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Round Details:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {experience.round_details}
                  </p>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Overall Feedback:</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {experience.overall_feedback}
                  </p>
                </div>
                
                {experience.tips_and_advice && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Tips & Advice:</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {experience.tips_and_advice}
                    </p>
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                  <span>{new Date(experience.date).toLocaleDateString()}</span>
                  {experience.is_own && (
                    <span className="text-blue-600 font-medium">Your Experience</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <div className="text-6xl mb-4">💼</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No experiences found</h4>
              <p className="text-gray-600 mb-4">
                Be the first to share your interview experience and help others!
              </p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Share Your Experience
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Create Experience Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Share Your Interview Experience</h3>
              <p className="text-sm text-gray-600 mt-1">Help others by sharing your interview experience</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="e.g., Google, Microsoft"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g., Software Engineer"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Type
                  </label>
                  <select
                    name="experience_type"
                    value={formData.experience_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Outcome
                  </label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                    <option value="pending">Pending</option>
                    <option value="withdrew">Withdrew</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Rating (1-5)
                  </label>
                  <select
                    name="difficulty_rating"
                    value={formData.difficulty_rating}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 - Very Easy</option>
                    <option value={2}>2 - Easy</option>
                    <option value={3}>3 - Medium</option>
                    <option value={4}>4 - Hard</option>
                    <option value={5}>5 - Very Hard</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preparation Time (weeks)
                  </label>
                  <input
                    type="number"
                    name="preparation_time"
                    value={formData.preparation_time}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="is_anonymous"
                      checked={formData.is_anonymous}
                      onChange={handleInputChange}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Share anonymously</span>
                  </label>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Round Details *
                </label>
                <textarea
                  name="round_details"
                  value={formData.round_details}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Describe the interview rounds, types of questions asked, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Overall Feedback *
                </label>
                <textarea
                  name="overall_feedback"
                  value={formData.overall_feedback}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Share your overall experience, what went well, what could be improved, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tips & Advice
                </label>
                <textarea
                  name="tips_and_advice"
                  value={formData.tips_and_advice}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any tips or advice for future candidates..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex space-x-4">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isSaving ? "Sharing..." : "Share Experience"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
