import axios from "axios";
const API_URL = "http://localhost:8000/api";

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
  } catch (err: any) {
    if (err.response?.status === 401) {
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
