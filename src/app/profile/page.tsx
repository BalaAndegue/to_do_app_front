"use client";

import { useEffect, useState } from "react";
import { Camera, Lock, LogOut, Pencil, X, Check } from "lucide-react";
import { UsersService } from "@/lib/services/UsersService";
import { User } from "@/lib/models/User";
import { useAuth } from "@/components/AuthContext";
import { normalizeApiError } from "@/lib/api/client";
import { useToast } from "@/components/ToastContext";

export default function ProfilePage() {
  const { user: authUser, logout, refreshUser, loginWithUser } = useAuth();
  const { toast } = useToast();
  const [user, setUser]         = useState<User | null>(null);
  const [loading, setLoading]   = useState(true);
  const [editing, setEditing]   = useState(false);
  const [saving, setSaving]     = useState(false);

  const [form, setForm] = useState({
    username: "", first_name: "", last_name: "", bio: "", avatar_url: "",
  });

  const [pwForm, setPwForm]   = useState({ new_password: "", confirm: "" });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  useEffect(() => {
    UsersService.usersMe()
      .then((u) => {
        setUser(u);
        setForm({
          username:   u.username   ?? "",
          first_name: u.first_name ?? "",
          last_name:  u.last_name  ?? "",
          bio:        u.bio        ?? "",
          avatar_url: u.avatar_url ?? "",
        });
      })
      .catch(() => toast("Impossible de charger le profil.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await UsersService.usersUpdateMe({
        username:   form.username   || undefined,
        first_name: form.first_name || undefined,
        last_name:  form.last_name  || undefined,
        bio:        form.bio        || undefined,
        avatar_url: form.avatar_url || undefined,
      });
      setUser(updated);
      await refreshUser();
      setEditing(false);
      toast("Profil mis à jour.", "success");
    } catch (err) {
      toast(normalizeApiError(err), "error");
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
    try {
      const res = await UsersService.usersChangePassword({ new_password: pwForm.new_password });
      if (res.data?.token && user) loginWithUser(res.data.token, user);
      toast("Mot de passe modifié.", "success");
      setPwForm({ new_password: "", confirm: "" });
    } catch (err) {
      setPwError(normalizeApiError(err));
    } finally {
      setPwLoading(false);
    }
  };

  const initials = (user?.username ?? authUser?.username ?? "?").substring(0, 2).toUpperCase();
  const displayName = user?.username ?? authUser?.username ?? "—";

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="shimmer mb-4 h-10 w-48 rounded-xl" />
        <div className="shimmer h-64 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-500">Compte</p>
        <h1 className="mt-1 text-3xl font-black uppercase text-[var(--ink)]">Mon profil</h1>
      </div>

      {/* ── Avatar + identité ───────────────────────────────── */}
      <div className="mb-4 flex items-center gap-5 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-card">
        <div className="relative shrink-0">
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={displayName}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-brand-500/30"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-500 text-2xl font-black text-white ring-4 ring-brand-500/20">
              {initials}
            </div>
          )}
          {editing && (
            <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-[var(--surface)] shadow border border-[var(--line)] text-[var(--ink-3)] hover:text-brand-500 transition">
              <Camera size={13} />
            </label>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-xl font-black text-[var(--ink)]">{displayName}</p>
          <p className="text-sm text-[var(--ink-3)]">{user?.email}</p>
          {user?.bio && !editing && (
            <p className="mt-1 text-sm text-[var(--ink-2)]">{user.bio}</p>
          )}
          {user?.created_at && (
            <p className="mt-1 text-xs text-[var(--ink-3)]">
              Membre depuis {new Date(user.created_at).toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
            </p>
          )}
        </div>

        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--ink-2)] transition hover:border-brand-500 hover:text-brand-500"
          >
            <Pencil size={13} /> Modifier
          </button>
        )}
      </div>

      {/* ── Formulaire d'édition ────────────────────────────── */}
      {editing && (
        <div className="mb-4 rounded-2xl border border-brand-500/30 bg-[var(--surface)] p-6 shadow-card">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">Modifier le profil</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nom d'utilisateur" value={form.username}   onChange={v => setForm(f => ({ ...f, username: v }))} />
            <Field label="Prénom"             value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} />
            <Field label="Nom"                value={form.last_name}  onChange={v => setForm(f => ({ ...f, last_name: v }))} />
            <Field label="URL avatar"         value={form.avatar_url} onChange={v => setForm(f => ({ ...f, avatar_url: v }))} placeholder="https://…" />
            <div className="sm:col-span-2">
              <Field label="Bio" value={form.bio} onChange={v => setForm(f => ({ ...f, bio: v }))} multiline />
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40"
            >
              <Check size={14} />{saving ? "Enregistrement…" : "Enregistrer"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-semibold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
            >
              <X size={14} />Annuler
            </button>
          </div>
        </div>
      )}

      {/* ── Changer le mot de passe ─────────────────────────── */}
      <div className="mb-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-card">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">
          <Lock size={14} /> Mot de passe
        </h2>
        {pwError && (
          <p className="mb-3 rounded-xl bg-red-50 p-3 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">{pwError}</p>
        )}
        <form onSubmit={handleChangePassword} className="flex flex-col gap-3 sm:max-w-sm">
          <Field label="Nouveau mot de passe" value={pwForm.new_password}
            onChange={v => setPwForm(f => ({ ...f, new_password: v }))} type="password" />
          <Field label="Confirmer" value={pwForm.confirm}
            onChange={v => setPwForm(f => ({ ...f, confirm: v }))} type="password" />
          <button
            type="submit"
            disabled={pwLoading || !pwForm.new_password}
            className="w-fit rounded-xl bg-brand-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40"
          >
            {pwLoading ? "Modification…" : "Modifier le mot de passe"}
          </button>
        </form>
      </div>

      {/* ── Déconnexion ─────────────────────────────────────── */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-card">
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-[var(--ink-3)]">Session</h2>
        <button
          onClick={logout}
          className="flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-500 transition hover:border-red-400 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
        >
          <LogOut size={14} /> Se déconnecter
        </button>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, multiline, type = "text", placeholder,
}: {
  label: string; value: string; onChange: (v: string) => void;
  multiline?: boolean; type?: string; placeholder?: string;
}) {
  const cls = "w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition";
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-[var(--ink-2)]">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} placeholder={placeholder} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} className={cls} placeholder={placeholder} />
      }
    </div>
  );
}
