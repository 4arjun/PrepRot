"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "../../../lib/auth";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface ReferralProfile {
  id: number;
  preferred_company: string;
  target_role: string;
  why_refer_me: string;
  experience_years: number;
  key_skills: string;
  achievements: string;
  resume_link: string;
  linkedin_profile: string;
  github_profile: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  preferred_company: string;
  target_role: string;
  why_refer_me: string;
  experience_years: number;
  key_skills: string;
  achievements: string;
  resume_link: string;
  linkedin_profile: string;
  github_profile: string;
  status: string;
}

export default function Referrals() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [profile, setProfile] = useState<ReferralProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    preferred_company: '',
    target_role: '',
    why_refer_me: '',
    experience_years: 0,
    key_skills: '',
    achievements: '',
    resume_link: '',
    linkedin_profile: '',
    github_profile: '',
    status: 'active'
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
        await fetchReferralProfile();
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchReferralProfile = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get(`${API_URL}/interviews/referral-profile/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setFormData(response.data);
    } catch (error: unknown) {
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status !== 404) {
        console.error("Failed to fetch referral profile:", error);
      }
      // 404 means no profile exists yet, which is fine
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience_years' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async () => {
    if (!formData.preferred_company.trim() || !formData.why_refer_me.trim()) {
      alert("Please fill in the required fields: Preferred Company and Why Refer Me");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(`${API_URL}/interviews/referral-profile/create/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(response.data.profile);
      setIsEditing(false);
      alert(response.data.message);
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { error?: string } } };
      console.error("Failed to save referral profile:", error);
      alert(axiosError.response?.data?.error || "Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete your referral profile? This action cannot be undone.")) {
      return;
    }

    try {
      const token = localStorage.getItem("access");
      await axios.delete(`${API_URL}/interviews/referral-profile/delete/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setProfile(null);
      setFormData({
        preferred_company: '',
        target_role: '',
        why_refer_me: '',
        experience_years: 0,
        key_skills: '',
        achievements: '',
        resume_link: '',
        linkedin_profile: '',
        github_profile: '',
        status: 'active'
      });
      alert("Referral profile deleted successfully");
    } catch (error) {
      console.error("Failed to delete referral profile:", error);
      alert("Failed to delete profile. Please try again.");
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
        {/* My Referral Profile */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">My Referral Profile</h3>
              {profile && !isEditing && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                  >
                    Delete Profile
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-6">
            {!profile && !isEditing ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">📄</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No profile created</h4>
                <p className="text-gray-600 mb-4">
                  Create your referral profile to showcase why companies should refer you.
                </p>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                >
                  Create Profile
                </button>
              </div>
            ) : isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Company *
                    </label>
                    <input
                      type="text"
                      name="preferred_company"
                      value={formData.preferred_company}
                      onChange={handleInputChange}
                      placeholder="e.g., Google, Microsoft, Amazon"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Role
                    </label>
                    <input
                      type="text"
                      name="target_role"
                      value={formData.target_role}
                      onChange={handleInputChange}
                      placeholder="e.g., Software Engineer, Data Scientist"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience (Years)
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      value={formData.experience_years}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="hired">Hired</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why Should Someone Refer You? *
                  </label>
                  <textarea
                    name="why_refer_me"
                    value={formData.why_refer_me}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Highlight your skills, experience, achievements, and what value you would bring to the company..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Skills
                  </label>
                  <textarea
                    name="key_skills"
                    value={formData.key_skills}
                    onChange={handleInputChange}
                    rows={2}
                    placeholder="e.g., Python, React, Machine Learning, System Design..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notable Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Projects, awards, publications, or other notable accomplishments..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Resume Link
                    </label>
                    <input
                      type="url"
                      name="resume_link"
                      value={formData.resume_link}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      name="linkedin_profile"
                      value={formData.linkedin_profile}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Profile
                    </label>
                    <input
                      type="url"
                      name="github_profile"
                      value={formData.github_profile}
                      onChange={handleInputChange}
                      placeholder="https://github.com/..."
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg font-medium"
                  >
                    {isSaving ? "Saving..." : "Save Profile"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      if (profile) setFormData(profile);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : profile ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Preferred Company</h4>
                    <p className="text-lg font-semibold text-gray-900">{profile.preferred_company}</p>
                  </div>
                  {profile.target_role && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Target Role</h4>
                      <p className="text-lg font-semibold text-gray-900">{profile.target_role}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
                    <p className="text-lg font-semibold text-gray-900">{profile.experience_years} years</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      profile.status === 'active' ? 'bg-green-100 text-green-800' :
                      profile.status === 'hired' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {profile.why_refer_me && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Why Refer Me</h4>
                    <p className="text-gray-900 leading-relaxed">{profile.why_refer_me}</p>
                  </div>
                )}
                
                {profile.key_skills && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Key Skills</h4>
                    <p className="text-gray-900">{profile.key_skills}</p>
                  </div>
                )}
                
                {profile.achievements && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">Achievements</h4>
                    <p className="text-gray-900 leading-relaxed">{profile.achievements}</p>
                  </div>
                )}
                
                <div className="flex space-x-4">
                  {profile.resume_link && (
                    <a
                      href={profile.resume_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      View Resume →
                    </a>
                  )}
                  {profile.linkedin_profile && (
                    <a
                      href={profile.linkedin_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      LinkedIn →
                    </a>
                  )}
                  {profile.github_profile && (
                    <a
                      href={profile.github_profile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium"
                    >
                      GitHub →
                    </a>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Information Section */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
          <div className="flex items-start">
            <div className="text-3xl mr-4">🔒</div>
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">Privacy Notice</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Your referral profile information is stored securely and is not visible to other users. 
                This information is only used internally for matching purposes and will never be shared 
                publicly without your explicit consent.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
