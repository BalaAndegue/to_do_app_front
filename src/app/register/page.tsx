"use client";

import { useState } from "react";
import { RegisterService } from "@/lib";
import { useRouter } from "next/navigation";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await RegisterService.registerCreate({
        username: email,
        email,
        password
      });
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f4]">
      <div className="bg-white p-12 w-full max-w-md border border-[#e0e0e0] shadow-sm">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-[#161616]">Create an account</h2>
          <p className="text-gray-500 mt-2">Join our professional workspace today.</p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Full name</label>
            <input
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={e => setName(e.target.value)}
              className="p-3 border-b border-[#8d8d8d] bg-[#f4f4f4] focus:border-[#0f62fe] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="p-3 border-b border-[#8d8d8d] bg-[#f4f4f4] focus:border-[#0f62fe] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="p-3 border-b border-[#8d8d8d] bg-[#f4f4f4] focus:border-[#0f62fe] focus:outline-none transition-colors"
              required
            />
          </div>

          {error && <div className="text-red-600 text-sm bg-red-50 p-2 border-l-4 border-red-600 font-medium">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="bg-[#0f62fe] hover:bg-[#0353e9] text-white font-medium py-3 px-4 transition-colors disabled:bg-gray-400 mt-4"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className="text-sm text-gray-600 mt-4">
            Already have an account? <a href="/login" className="text-[#0f62fe] hover:underline">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
