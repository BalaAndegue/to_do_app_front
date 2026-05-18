"use client";

import { useState } from "react";
import { LoginService } from "@/lib";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { extractAuthToken, normalizeApiError } from "@/lib/api/client";
import { uiImages } from "@/lib/ui-images";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await LoginService.loginCreate({ email, password });
      const token = extractAuthToken(response);

      if (token) {
        login(token);
        router.push("/");
      } else {
        setError("Réponse du serveur invalide : token non trouvé.");
      }
    } catch (error: unknown) {
      setError(normalizeApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f5f5f5] px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm md:grid-cols-2">
        <div className="relative min-h-[300px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${uiImages.authDesk})` }}
          />
          <div className="absolute inset-0 bg-black/35" />
          <div className="relative z-10 p-8 text-white md:p-10">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-300">Welcome back</p>
            <h2 className="text-4xl font-black uppercase leading-none">Connectez-vous</h2>
            <p className="mt-4 max-w-md text-sm text-gray-100">
              Retrouvez vos espaces, vos tableaux et vos cartes avec une experience fluide inspirée des plus beaux dashboards.
            </p>
          </div>
        </div>

        <div className="p-8 md:p-10">
          <header className="mb-8">
            <h2 className="text-3xl font-black uppercase text-black">Connexion</h2>
            <p className="mt-2 text-gray-500">Entrez vos identifiants pour acceder a votre espace.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="rounded-xl border-2 border-yellow-400 bg-white p-3 text-black transition-colors focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black">Mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="rounded-xl border-2 border-yellow-400 bg-white p-3 text-black transition-colors focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            {error && <div className="border-l-4 border-red-600 bg-red-50 p-2 text-sm font-medium text-red-600">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-xl border-2 border-yellow-400 bg-yellow-400 px-4 py-3 font-bold text-black transition-colors hover:bg-orange-500 disabled:bg-gray-200"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

            <div className="mt-4 text-sm text-gray-600">
              Pas de compte ? <a href="/register" className="text-yellow-600 hover:underline">Creer un compte</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
