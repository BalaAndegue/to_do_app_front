"use client";

import { useEffect, useState } from "react";
import { UsersService } from "@/lib/services/UsersService";
import { User } from "@/lib/models/User";
import { useAuth } from "@/components/AuthContext";
import { normalizeApiError } from "@/lib/api/client";
import { uiImages } from "@/lib/ui-images";

export default function ProfilePage() {
  const { user: authUser, logout, refreshUser, login } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [form, setForm] = useState({ first_name: "", last_name: "", bio: "", avatar_url: "" });
  const [pwForm, setPwForm] = useState({ new_password: "", confirm: "" });
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState<string | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  useEffect(() => {
    UsersService.usersMe()
      .then((u) => {
        setUser(u);
        setForm({
          first_name: u.first_name || "",
          last_name: u.last_name || "",
          bio: u.bio || "",
          avatar_url: u.avatar_url || "",
        });
      })
      .catch(() => setError("Impossible de charger le profil."))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    if (!user?.user_id) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updated = await UsersService.usersPartialUpdate(user.user_id, {
        first_name: form.first_name || undefined,
        last_name: form.last_name || undefined,
        bio: form.bio || undefined,
        avatar_url: form.avatar_url || undefined,
        username: user.username,
        email: user.email,
        password: "",
      });
      setUser(updated);
      await refreshUser();
      setEditing(false);
      setSuccess("Profil mis à jour avec succès.");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (pwForm.new_password !== pwForm.confirm) {
      setPwError("Les mots de passe ne correspondent pas.");
      return;
    }
    setPwLoading(true);
    setPwError(null);
    setPwSuccess(null);
    try {
      const res = await UsersService.usersChangePassword({ new_password: pwForm.new_password });
      if (res.data?.token) login(res.data.token);
      setPwSuccess("Mot de passe modifié. Nouveau token appliqué automatiquement.");
      setPwForm({ new_password: "", confirm: "" });
    } catch (err) {
      setPwError(normalizeApiError(err));
    } finally {
      setPwLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-gray-500">Chargement du profil...</div>;

  const displayName = user?.username || authUser?.username || "?";
  const initials = displayName.substring(0, 2).toUpperCase();

  return (
    <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col gap-6 px-6 pb-12">
      <header
        className="rounded-3xl border border-gray-200 bg-cover bg-center p-8 text-white"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5)), url(${uiImages.profileBanner})` }}
      >
        <h1 className="text-3xl font-black uppercase">Mon profil</h1>
        <p className="mt-2 text-gray-100">Gérez vos informations personnelles.</p>
      </header>

      {error && <div className="border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
      {success && <div className="border-l-4 border-green-500 bg-green-50 p-3 text-sm text-green-700">{success}</div>}

      {/* Infos profil */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-6 flex items-center gap-5 border-b border-gray-200 pb-6">
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-yellow-400 text-2xl font-black text-black">
            {initials}
          </div>
          <div>
            <p className="text-xl font-black text-black">{user?.username}</p>
            <p className="text-gray-500">{user?.email}</p>
            {user?.created_at && (
              <p className="mt-1 text-xs text-gray-400">
                Membre depuis {new Date(user.created_at).toLocaleDateString("fr-FR")}
              </p>
            )}
          </div>
        </div>

        {!editing ? (
          <>
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoRow label="Prénom" value={user?.first_name} />
              <InfoRow label="Nom" value={user?.last_name} />
              <InfoRow label="Bio" value={user?.bio} className="sm:col-span-2" />
            </dl>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditing(true)}
                className="rounded-xl border-2 border-yellow-400 bg-yellow-400 px-5 py-2 font-bold text-black transition hover:bg-orange-500"
              >
                Modifier le profil
              </button>
              <button
                onClick={logout}
                className="rounded-xl border-2 border-gray-300 px-5 py-2 font-bold text-gray-700 transition hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Prénom" value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
              <Field label="Nom" value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} />
            </div>
            <Field label="Bio" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
            <Field label="URL avatar" value={form.avatar_url} onChange={v => setForm(f => ({ ...f, avatar_url: v }))} />
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-xl border-2 border-yellow-400 bg-yellow-400 px-5 py-2 font-bold text-black transition hover:bg-orange-500 disabled:bg-gray-200"
              >
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="rounded-xl border-2 border-gray-300 px-5 py-2 font-bold text-gray-700 transition hover:bg-gray-100"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Changer le mot de passe */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="mb-4 text-xl font-black uppercase text-black">Changer le mot de passe</h2>
        {pwError && <div className="mb-3 border-l-4 border-red-500 bg-red-50 p-3 text-sm text-red-700">{pwError}</div>}
        {pwSuccess && <div className="mb-3 border-l-4 border-green-500 bg-green-50 p-3 text-sm text-green-700">{pwSuccess}</div>}
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4 sm:max-w-md">
          <Field
            label="Nouveau mot de passe"
            value={pwForm.new_password}
            onChange={v => setPwForm(f => ({ ...f, new_password: v }))}
            type="password"
          />
          <Field
            label="Confirmer le mot de passe"
            value={pwForm.confirm}
            onChange={v => setPwForm(f => ({ ...f, confirm: v }))}
            type="password"
          />
          <button
            type="submit"
            disabled={pwLoading || !pwForm.new_password}
            className="w-fit rounded-xl border-2 border-yellow-400 bg-yellow-400 px-5 py-2 font-bold text-black transition hover:bg-orange-500 disabled:bg-gray-200"
          >
            {pwLoading ? "Modification..." : "Modifier le mot de passe"}
          </button>
        </form>
      </div>
    </div>
  );
}

function InfoRow({ label, value, className = "" }: { label: string; value?: string | null; className?: string }) {
  return (
    <div className={className}>
      <dt className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="mt-1 text-black">{value || <span className="italic text-gray-400">—</span>}</dd>
    </div>
  );
}

function Field({
  label, value, onChange, multiline, type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
  type?: string;
}) {
  const cls = "w-full rounded-xl border-2 border-yellow-400 px-3 py-2 text-black focus:border-yellow-500 focus:outline-none";
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-black">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} className={`${cls} min-h-20`} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} />
      )}
    </div>
  );
}
