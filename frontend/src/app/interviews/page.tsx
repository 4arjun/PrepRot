"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface User {
  id: number;
  username: string;
  is_me: boolean;
}

interface Interview {
  id: number;
  interviewer: User;
  interviewee: User;
  scheduled_time: string;
  duration_minutes: number;
  interview_type: string;
  status: string;
  meeting_link: string;
  notes: string;
  score: number | null;
  feedback: string;
  technical_areas: string;
  created_at: string;
  role: 'interviewer' | 'interviewee';
}

interface Interviewer {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

interface InterviewStats {
  as_interviewee: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
  };
  as_interviewer: {
    total: number;
    completed: number;
    scheduled: number;
    cancelled: number;
  };
  average_score: number;
}

interface ScheduleFormData {
  interviewer_id: string;
  scheduled_time: string;
  duration_minutes: number;
  interview_type: string;
  notes: string;
  technical_areas: string;
  meeting_link: string;
}

interface FeedbackFormData {
  status: string;
  score: number;
  feedback: string;
  meeting_link: string;
}

export default function Interviews() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [interviewers, setInterviewers] = useState<Interviewer[]>([]);
  const [stats, setStats] = useState<InterviewStats | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    interviewer_id: '',
    scheduled_time: '',
    duration_minutes: 60,
    interview_type: 'technical',
    notes: '',
    technical_areas: '',
    meeting_link: ''
  });
  const [feedbackData, setFeedbackData] = useState<FeedbackFormData>({
    status: 'completed',
    score: 5,
    feedback: '',
    meeting_link: ''
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
        await Promise.all([
          fetchInterviews(),
          fetchInterviewers(),
          fetchStats()
        ]);
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_URL}/interviews/mock-interviews/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviews(response.data);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    }
  };

  const fetchInterviewers = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_URL}/interviews/mock-interviews/interviewers/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInterviewers(response.data);
    } catch (error) {
      console.error("Failed to fetch interviewers:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_URL}/interviews/mock-interviews/stats/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration_minutes' ? parseInt(value) || 60 : value
    }));
  };

  const handleFeedbackChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackData(prev => ({
      ...prev,
      [name]: name === 'score' ? parseInt(value) || 5 : value
    }));
  };

  const handleScheduleSubmit = async () => {
    if (!formData.interviewer_id || !formData.scheduled_time) {
      alert("Please select an interviewer and schedule time");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(`${API_URL}/interviews/mock-interviews/create/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowScheduleModal(false);
      setFormData({
        interviewer_id: '',
        scheduled_time: '',
        duration_minutes: 60,
        interview_type: 'technical',
        notes: '',
        technical_areas: '',
        meeting_link: ''
      });
      await fetchInterviews();
      await fetchStats();
      alert(response.data.message);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      console.error("Failed to schedule interview:", error);
      alert(axiosError.response?.data?.error || "Failed to schedule interview. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!selectedInterview) return;

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access");
      await axios.put(`${API_URL}/interviews/mock-interviews/${selectedInterview.id}/update/`, feedbackData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setShowFeedbackModal(false);
      setSelectedInterview(null);
      await fetchInterviews();
      await fetchStats();
      alert("Feedback submitted successfully");
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      console.error("Failed to submit feedback:", error);
      alert(axiosError.response?.data?.error || "Failed to submit feedback. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelInterview = async (interviewId: number) => {
    if (!confirm("Are you sure you want to cancel this interview?")) return;

    try {
      const token = localStorage.getItem("access");
      await axios.delete(`${API_URL}/interviews/mock-interviews/${interviewId}/cancel/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      await fetchInterviews();
      await fetchStats();
      alert("Interview cancelled successfully");
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      console.error("Failed to cancel interview:", error);
      alert(axiosError.response?.data?.error || "Failed to cancel interview. Please try again.");
    }
  };

  const openFeedbackModal = (interview: Interview) => {
    setSelectedInterview(interview);
    setFeedbackData({
      status: interview.status || 'completed',
      score: interview.score || 5,
      feedback: interview.feedback || '',
      meeting_link: interview.meeting_link || ''
    });
    setShowFeedbackModal(true);
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
              <h1 className="text-2xl font-bold text-gray-900">Mock Interviews</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Interviews</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.as_interviewee.total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.as_interviewee.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <span className="text-2xl">⏰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Scheduled</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.as_interviewee.scheduled}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 border">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-2xl">⭐</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Score</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.average_score}/10</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Schedule Interview */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Schedule Interview</h3>
            <p className="text-gray-600 mb-4">
              Book a mock interview session with experienced interviewers.
            </p>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
            >
              Schedule Now
            </button>
          </div>

          {/* Conduct Interviews */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Conduct Interviews</h3>
            <p className="text-gray-600 mb-4">
              Help others by conducting mock interviews and providing feedback.
            </p>
            <div className="text-sm text-gray-500">
              {stats?.as_interviewer?.total || 0} interviews conducted
            </div>
          </div>
        </div>

        {/* Interviews List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-xl font-bold text-gray-900">My Interviews</h3>
            <p className="text-sm text-gray-600 mt-1">
              Your scheduled and completed mock interviews
            </p>
          </div>
          
          {interviews.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {interviews.map((interview) => (
                <div key={interview.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">
                          {interview.role === 'interviewer' ? 'Interviewing' : 'Interview with'} {' '}
                          {interview.role === 'interviewer' ? interview.interviewee.username : interview.interviewer.username}
                        </h4>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                          interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                          interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          interview.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
                        </span>
                        
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                          {interview.interview_type.replace('_', ' ').charAt(0).toUpperCase() + interview.interview_type.replace('_', ' ').slice(1)}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Date & Time</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(interview.scheduled_time).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="text-sm font-medium text-gray-900">{interview.duration_minutes} minutes</p>
                        </div>
                        {interview.score && (
                          <div>
                            <p className="text-sm text-gray-500">Score</p>
                            <p className="text-sm font-medium text-gray-900">{interview.score}/10</p>
                          </div>
                        )}
                      </div>
                      
                      {interview.technical_areas && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Technical Areas</p>
                          <p className="text-sm text-gray-900">{interview.technical_areas}</p>
                        </div>
                      )}
                      
                      {interview.feedback && (
                        <div className="mb-3">
                          <p className="text-sm text-gray-500">Feedback</p>
                          <p className="text-sm text-gray-900">{interview.feedback}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex flex-col space-y-2 ml-4">
                      {interview.meeting_link && (
                        <a
                          href={interview.meeting_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium text-center"
                        >
                          Join Meeting
                        </a>
                      )}
                      
                      {interview.role === 'interviewer' && interview.status === 'scheduled' && (
                        <button
                          onClick={() => openFeedbackModal(interview)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Add Feedback
                        </button>
                      )}
                      
                      {interview.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelInterview(interview.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🎯</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No interviews yet</h4>
              <p className="text-gray-600 mb-4">
                Schedule your first mock interview to start practicing!
              </p>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
              >
                Schedule Interview
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Schedule Interview Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Schedule Mock Interview</h3>
              <p className="text-sm text-gray-600 mt-1">Book a practice interview session</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Interviewer *
                  </label>
                  <select
                    name="interviewer_id"
                    value={formData.interviewer_id}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose an interviewer</option>
                    {interviewers.map((interviewer) => (
                      <option key={interviewer.id} value={interviewer.id}>
                        {interviewer.username} {interviewer.first_name && `(${interviewer.first_name} ${interviewer.last_name})`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interview Type *
                  </label>
                  <select
                    name="interview_type"
                    value={formData.interview_type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="technical">Technical</option>
                    <option value="behavioral">Behavioral</option>
                    <option value="system_design">System Design</option>
                    <option value="coding">Coding</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="scheduled_time"
                    value={formData.scheduled_time}
                    onChange={handleInputChange}
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    name="duration_minutes"
                    value={formData.duration_minutes}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Areas to Focus On
                </label>
                <input
                  type="text"
                  name="technical_areas"
                  value={formData.technical_areas}
                  onChange={handleInputChange}
                  placeholder="e.g., Data Structures, Algorithms, System Design"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meeting_link"
                  value={formData.meeting_link}
                  onChange={handleInputChange}
                  placeholder="https://meet.google.com/... or https://zoom.us/..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any specific requirements or notes for the interviewer..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex space-x-4">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isSaving ? "Scheduling..." : "Schedule Interview"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedInterview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Interview Feedback</h3>
              <p className="text-sm text-gray-600 mt-1">
                Provide feedback for {selectedInterview.interviewee.username}
              </p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={feedbackData.status}
                    onChange={handleFeedbackChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="completed">Completed</option>
                    <option value="no_show">No Show</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Score (1-10)
                  </label>
                  <select
                    name="score"
                    value={feedbackData.score}
                    onChange={handleFeedbackChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting Link
                </label>
                <input
                  type="url"
                  name="meeting_link"
                  value={feedbackData.meeting_link}
                  onChange={handleFeedbackChange}
                  placeholder="https://meet.google.com/... or https://zoom.us/..."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Feedback
                </label>
                <textarea
                  name="feedback"
                  value={feedbackData.feedback}
                  onChange={handleFeedbackChange}
                  rows={4}
                  placeholder="Provide detailed feedback on performance, areas for improvement, strengths, etc."
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="p-6 border-t flex space-x-4">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                disabled={isSaving}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg"
              >
                {isSaving ? "Saving..." : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
