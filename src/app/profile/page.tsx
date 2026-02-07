"use client";

import { useEffect, useState } from "react";
import { UsersService, type User } from "@/lib";
import { useAuth } from "@/components/AuthContext";

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useAuth();

  useEffect(() => {
    // In a real app, we'd fetch the current user's profile
    // For now, we list users and take the first one as "me"
    UsersService.usersList()
      .then((res: any) => {
        const users = res?.data || res;
        if (Array.isArray(users) && users.length > 0) setUser(users[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="text-gray-500">No profile data found.</div>;
  }

  return (
    <div className="max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[#161616]">User Profile</h1>
        <p className="text-gray-500 mt-2">Manage your account settings and preferences.</p>
      </header>

      <div className="bg-white border border-[#e0e0e0] p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-[#e0e0e0]">
          <div className="w-20 h-20 rounded-full bg-[#0f62fe] text-white flex items-center justify-center text-3xl font-bold">
            {user.username.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#161616]">{user.username}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account ID</span>
            <span className="text-[#161616] font-mono">{user.user_id}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Language</span>
            <span className="text-[#161616]">English (US)</span>
          </div>
        </div>

        <div className="mt-12 flex gap-4">
          <button className="bg-[#0f62fe] text-white px-6 py-2 hover:bg-[#0353e9] transition-colors">
            Edit Profile
          </button>
          <button
            onClick={logout}
            className="bg-white border border-red-600 text-red-600 px-6 py-2 hover:bg-red-50 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
