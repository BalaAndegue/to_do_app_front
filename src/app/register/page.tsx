"use client";

import { useState } from "react";
import { RegisterService } from "@/lib";
import { useRouter } from "next/navigation";
import { normalizeApiError, extractFieldErrors } from "@/lib/api/client";
import { useAuth } from "@/components/AuthContext";
import { uiImages } from "@/lib/ui-images";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { loginWithUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await RegisterService.registerCreate({ username: name, email, password });
      loginWithUser(res.token, res.user);
      router.push("/spaces");
    } catch (err: unknown) {
      setError(normalizeApiError(err));
      setFieldErrors(extractFieldErrors(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#f5f5f5] px-6 py-10">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm md:grid-cols-2">
        <div className="p-8 md:p-10">
          <header className="mb-8">
            <h2 className="text-3xl font-black uppercase text-black">Creer un compte</h2>
            <p className="mt-2 text-gray-500">Rejoignez votre espace collaboratif premium.</p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-black">Nom d&apos;utilisateur</label>
              <input
                type="text"
                placeholder="Votre nom"
                value={name}
                onChange={e => setName(e.target.value)}
                className="rounded-xl border-2 border-yellow-400 bg-white p-3 text-black transition-colors focus:border-yellow-500 focus:outline-none"
                required
              />
              {fieldErrors.username?.map((msg, i) => (
                <p key={i} className="text-xs text-red-500">{msg}</p>
              ))}
            </div>
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
              {fieldErrors.email?.map((msg, i) => (
                <p key={i} className="text-xs text-red-500">{msg}</p>
              ))}
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
              {fieldErrors.password?.map((msg, i) => (
                <p key={i} className="text-xs text-red-500">{msg}</p>
              ))}
            </div>
            {error && <div className="border-l-4 border-red-600 bg-red-50 p-2 text-sm font-medium text-red-600">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 rounded-xl border-2 border-yellow-400 bg-yellow-400 px-4 py-3 font-bold text-black transition-colors hover:bg-orange-500 disabled:bg-gray-200"
            >
              {loading ? "Creation..." : "Creer un compte"}
            </button>
            <div className="mt-4 text-sm text-gray-600">
              Deja un compte ? <a href="/login" className="text-yellow-600 hover:underline">Se connecter</a>
            </div>
          </form>
        </div>

        <div className="relative min-h-[300px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${uiImages.authTeam})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 p-8 text-white md:p-10">
            <p className="mb-2 text-xs uppercase tracking-[0.2em] text-yellow-300">New workspace</p>
            <h3 className="text-4xl font-black uppercase leading-none">Construisez votre systeme</h3>
            <p className="mt-4 max-w-md text-sm text-gray-100">
              Structurez vos projets en espaces, tableaux et cartes avec une experience digne des meilleures vitrines Pinterest.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
