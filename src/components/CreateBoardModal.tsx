"use client";

import { useState } from "react";
import { X, LayoutList } from "lucide-react";
import { BoardsService, type Board } from "@/lib";
import { normalizeApiError } from "@/lib/api/client";

interface CreateBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newBoard: Board) => void;
}

const VISIBILITY_OPTIONS = [
  { value: "private",   label: "Privé",     desc: "Visible uniquement par les membres invités" },
  { value: "workspace", label: "Workspace",  desc: "Visible par tous les membres du workspace" },
  { value: "public",    label: "Public",     desc: "Visible par tout le monde" },
] as const;

export default function CreateBoardModal({ isOpen, onClose, onSuccess }: CreateBoardModalProps) {
  const [name, setName]               = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility]   = useState<"private" | "workspace" | "public">("private");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const newBoard = await BoardsService.boardsCreate({
        name: name.trim(),
        description: description.trim() || undefined,
        visibility,
        position: 0,
      } as Board);
      onSuccess(newBoard);
      onClose();
      setName(""); setDescription(""); setVisibility("private");
    } catch (err) {
      setError(normalizeApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500 text-white">
              <LayoutList size={16} />
            </div>
            <h2 className="text-lg font-black text-[var(--ink)]">Nouveau tableau</h2>
          </div>
          <button onClick={onClose} className="text-[var(--ink-3)] transition hover:text-[var(--ink)]">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          {error && (
            <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Nom */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
              Nom du tableau <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus required
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex : Sprint Q2, Roadmap produit…"
              className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
              Description <span className="text-[var(--ink-3)] font-normal normal-case">(optionnel)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="À quoi sert ce tableau ?"
              rows={2}
              className="w-full resize-none rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
            />
          </div>

          {/* Visibilité */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">
              Visibilité
            </label>
            <div className="flex flex-col gap-2">
              {VISIBILITY_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition ${
                    visibility === opt.value
                      ? "border-brand-500 bg-brand-50 dark:bg-brand-900/20"
                      : "border-[var(--line)] hover:border-[var(--line-strong)]"
                  }`}
                >
                  <input
                    type="radio" name="visibility" value={opt.value}
                    checked={visibility === opt.value}
                    onChange={() => setVisibility(opt.value)}
                    className="accent-brand-500 mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-bold text-[var(--ink)]">{opt.label}</p>
                    <p className="text-xs text-[var(--ink-3)]">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button" onClick={onClose}
              className="flex-1 rounded-xl border-2 border-[var(--line)] py-2.5 text-sm font-bold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 rounded-xl bg-brand-500 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40"
            >
              {loading ? "Création…" : "Créer le tableau"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
