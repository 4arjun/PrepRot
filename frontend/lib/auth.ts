import axios from "axios";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const login = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${API_URL}/token/`, {
      username,
      password,
    });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    return true;
  } catch (err) {
    console.error("Login failed", err);
    return false;
  }
};

interface SignupResponse {
  success: boolean;
  message: string;
  errors: Record<string, string>;
}

export const signup = async (username: string, email: string, password: string): Promise<SignupResponse> => {
  try {
    const res = await axios.post(`${API_URL}/signup/`, {
      username,
      email,
      password,
    });
    return { success: true, message: res.data.message, errors: {} };
  } catch (err: unknown) {
    const axiosError = err as { response?: { data?: Record<string, string> & { message?: string } } };
    console.error("Signup failed", err);
    const errorData = axiosError.response?.data || {};
    const { message, ...errors } = errorData;
    return { 
      success: false, 
      message: message || "Signup failed",
      errors: errors as Record<string, string>
    };
  }
};


export const refreshAccessToken = async () => {
    try {
    const refresh = localStorage.getItem("refresh");
    if (!refresh) return null;
    const res = await axios.post(`${API_URL}/token/refresh/`, { refresh });
    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);
    return res.data.access;
    } catch (err) { 
    console.error("Refresh failed", err);
    return null;
    }
};

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const access = localStorage.getItem("access");
    if (!access) return false;

    await axios.post(`${API_URL}/token/verify/`, {token: access});
    return true;
  } catch (err: unknown) {
    const axiosError = err as { response?: { status?: number } };
    if (axiosError.response?.status === 401) {
      const newAccess = await refreshAccessToken();
      return newAccess !== null;
    }
    return false;
  }
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};
