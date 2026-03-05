"use client";

import { useState } from "react";
import { api } from "@/services/api";
import type { LoginData } from "@/types/types";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<LoginData>({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await login(form);
      // AuthContext handles the redirection to /dashboard
    } catch (err) {
      setError("Invalid credentials. Please try again.");
      console.error("Login failed", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 text-black">
      <form onSubmit={handleSubmit} className="space-y-4 w-80 p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm mb-4">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Email Address</label>
          <input
            type="email"
            placeholder="name@example.com"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-black outline-none transition"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border rounded p-2 focus:ring-2 focus:ring-black outline-none transition"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition font-medium"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
