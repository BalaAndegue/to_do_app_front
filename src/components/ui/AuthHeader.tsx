"use client";
import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";

export default function AuthHeader() {
  const { token, logout } = useAuth();
  // TODO: Récupérer l'utilisateur courant si besoin
  // const user = ...
  return (
    <div className="flex items-center gap-2">
      {token ? (
        <>
          <Link href="/profile" className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1">
            <div className="w-8 h-8 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-white font-bold text-sm">
              {/* Afficher l'avatar ou l'initiale du user ici si disponible */}
              <span className="text-black">U</span>
            </div>
            <span className="hidden sm:inline text-sm font-semibold text-black pr-1">Profil</span>
          </Link>
          <button
            onClick={logout}
            className="rounded-full border border-gray-200 bg-black px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Deconnexion
          </button>
        </>
      ) : (
        <Link
          href="/spaces"
          className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-100"
        >
          Espace public
        </Link>
      )}
    </div>
  );
}
