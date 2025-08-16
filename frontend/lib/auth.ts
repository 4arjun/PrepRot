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


export const getAuthAxios = async () => {
  let access = localStorage.getItem("access");

  try {
    await axios.get(`${API_URL}/token/verify/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
  } catch (err: any) {
    if (err.response?.status === 401) {
      access = await refreshAccessToken();
    }
  }

  return axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${access}` },
  });
};
