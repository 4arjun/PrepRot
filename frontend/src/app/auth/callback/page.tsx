"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";

export default function GoogleCallback() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");
    if (!code) {
      console.error("No code found in URL");
      return;
    }

    const sendCodeToBackend = async () => {
      try {
        const res = await axios.post("http://localhost:8000/api/auth/google/", {
          code,
        });

        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);

        router.push("/");
      } catch (err) {
        console.error("Google login failed", err);
      }
    };

    sendCodeToBackend();
  }, [params, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p className="text-lg">Logging in with Google...</p>
    </div>
  );
}
