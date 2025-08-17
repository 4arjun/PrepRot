"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "../../../lib/auth";
import axios from "axios";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        const refresh = localStorage.getItem("refresh");

        if (refresh) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
          await axios.post(`${apiUrl}/token/logout/`, { refresh });
        }
      } catch (err) {
        console.error("Failed to blacklist token", err);
      } finally {
        logout();
        router.push("/login");
      }
    };

    performLogout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Logging out...</p>
    </div>
  );
}
