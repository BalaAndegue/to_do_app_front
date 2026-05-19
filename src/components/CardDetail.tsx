"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  Tag, User, Paperclip, Archive, Trash2, X, Check, Plus,
  Calendar, AlignLeft, CheckSquare, MessageCircle, Pencil,
  Upload, Link2, AlertTriangle,
} from "lucide-react";
import { CardsService } from "@/lib/services/CardsService";
import { CommentsService } from "@/lib/services/CommentsService";
import { ChecklistsService } from "@/lib/services/ChecklistsService";
import { ChecklistItemsService } from "@/lib/services/ChecklistItemsService";
import { LabelsService } from "@/lib/services/LabelsService";
import { CardLabelsService } from "@/lib/services/CardLabelsService";
import { CardMembersService } from "@/lib/services/CardMembersService";
import { AttachmentsService } from "@/lib/services/AttachmentsService";
import { BoardsService } from "@/lib/services/BoardsService";
import { Card } from "@/lib/models/Card";
import { Comment } from "@/lib/models/Comment";
import { Checklist } from "@/lib/models/Checklist";
import { ChecklistItem } from "@/lib/models/ChecklistItem";
import { Label } from "@/lib/models/Label";
import { CardLabel } from "@/lib/models/CardLabel";
import { CardMember } from "@/lib/models/CardMember";
import { Attachment } from "@/lib/models/Attachment";
import { BoardMember } from "@/lib/models/BoardMember";
import { normalizeApiError } from "@/lib/api/client";
import { uploadFile, cloudinaryConfigured } from "@/lib/uploadFile";
import { useAuth } from "@/components/AuthContext";


interface CardDetailProps {
  cardId: number;
  boardId: number;
  onClose: () => void;
  onCardUpdated?: (card: Card) => void;
  onCardDeleted?: (cardId: number) => void;
}

export default function CardDetail({ cardId, boardId, onClose, onCardUpdated, onCardDeleted }: CardDetailProps) {
  const { user } = useAuth();

  const [card, setCard]               = useState<Card | null>(null);
  const [comments, setComments]       = useState<Comment[]>([]);
  const [checklists, setChecklists]   = useState<Checklist[]>([]);
  const [boardLabels, setBoardLabels] = useState<Label[]>([]);
  const [boardMembers, setBoardMembers] = useState<BoardMember[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState<string | null>(null);

  // Inline editing
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft]     = useState("");
  const [editingDesc, setEditingDesc]   = useState(false);
  const [descDraft, setDescDraft]       = useState("");
  const [savingCard, setSavingCard]     = useState(false);

  // Comments
  const [newComment, setNewComment]           = useState("");
  const [commentLoading, setCommentLoading]   = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [commentDraft, setCommentDraft]       = useState("");

  // Checklists
  const [newChecklistName, setNewChecklistName] = useState("");
  const [addingChecklist, setAddingChecklist]   = useState(false);
  const [newItemName, setNewItemName]           = useState<Record<number, string>>({});

  // Sidebar panels
  const [openPanel, setOpenPanel] = useState<"labels" | "members" | "dates" | "attachments" | null>(null);

  // Dates
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate]     = useState("");

  // Attachments — file upload
  const fileInputRef              = useRef<HTMLInputElement>(null);
  const [attachUrl, setAttachUrl]           = useState("");
  const [attachFilename, setAttachFilename] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError]       = useState<string | null>(null);
  const [urlMode, setUrlMode]               = useState(!cloudinaryConfigured);

  const fetchAll = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const [cardData, commentsData, checklistsData, labelsData, membersData, attachData] = await Promise.all([
        CardsService.cardsRead(String(cardId)),
        CommentsService.commentsList({ card: cardId }),
        ChecklistsService.checklistsList({ card: cardId }),
        LabelsService.labelsList({ board: boardId }),
        BoardsService.boardsMembers(String(boardId)),
        AttachmentsService.attachmentsList({ card: cardId }),
      ]);
      setCard(cardData);
      setTitleDraft(cardData.title);
      setDescDraft(cardData.description ?? "");
      setStartDate(cardData.start_date ? cardData.start_date.slice(0, 16) : "");
      setDueDate(cardData.due_date ? cardData.due_date.slice(0, 16) : "");
      setComments(commentsData.results);
      setChecklists(checklistsData.results);
      setBoardLabels(labelsData.results);
      setBoardMembers(membersData);
      setAttachments(attachData.results);
    } catch (err) { setError(normalizeApiError(err)); }
    finally { setLoading(false); }
  }, [cardId, boardId]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  // ── Carte ────────────────────────────────────────────────────
  const patchCard = async (data: Partial<Card>) => {
    if (!card) return;
    setSavingCard(true);
    try {
      const updated = await CardsService.cardsPartialUpdate(String(cardId), data);
      setCard(updated); onCardUpdated?.(updated);
    } catch (err) { setError(normalizeApiError(err)); }
    finally { setSavingCard(false); }
  };

  const saveTitle = () => {
    if (titleDraft.trim() && titleDraft !== card?.title) patchCard({ title: titleDraft.trim() });
    setEditingTitle(false);
  };

  const saveDesc = () => {
    if (descDraft !== card?.description) patchCard({ description: descDraft || null });
    setEditingDesc(false);
  };

  const saveDates = async () => {
    await patchCard({
      start_date: startDate ? new Date(startDate).toISOString() : null,
      due_date:   dueDate   ? new Date(dueDate).toISOString()   : null,
    });
    setOpenPanel(null);
  };

  const archiveCard = async () => {
    try { await CardsService.cardsArchive(String(cardId)); onCardDeleted?.(cardId); onClose(); }
    catch (err) { setError(normalizeApiError(err)); }
  };

  const deleteCard = async () => {
    if (!confirm("Supprimer définitivement cette carte ?")) return;
    try { await CardsService.cardsDelete(String(cardId)); onCardDeleted?.(cardId); onClose(); }
    catch (err) { setError(normalizeApiError(err)); }
  };

  // ── Commentaires ─────────────────────────────────────────────
  const postComment = async () => {
    if (!newComment.trim()) return;
    setCommentLoading(true);
    try {
      const c = await CommentsService.commentsCreate({ card: cardId, content: newComment.trim() } as Comment);
      setComments(prev => [...prev, c]);
      setNewComment("");
    } catch (err) { setError(normalizeApiError(err)); }
    finally { setCommentLoading(false); }
  };

  const saveComment = async (commentId: number) => {
    if (!commentDraft.trim()) return;
    try {
      const updated = await CommentsService.commentsPartialUpdate(String(commentId), { content: commentDraft.trim() });
      setComments(prev => prev.map(c => c.comment_id === commentId ? updated : c));
      setEditingCommentId(null);
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await CommentsService.commentsDelete(String(commentId));
      setComments(prev => prev.filter(c => c.comment_id !== commentId));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  // ── Checklists ───────────────────────────────────────────────
  const createChecklist = async () => {
    if (!newChecklistName.trim()) return;
    try {
      const cl = await ChecklistsService.checklistsCreate({
        card: cardId, name: newChecklistName.trim(), position: checklists.length,
      } as Checklist);
      setChecklists(prev => [...prev, { ...cl, items: [] }]);
      setNewChecklistName(""); setAddingChecklist(false);
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const deleteChecklist = async (checklistId: number) => {
    try {
      await ChecklistsService.checklistsDelete(checklistId);
      setChecklists(prev => prev.filter(cl => cl.checklist_id !== checklistId));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const addChecklistItem = async (checklistId: number) => {
    const name = (newItemName[checklistId] ?? "").trim();
    if (!name) return;
    try {
      const item = await ChecklistItemsService.checklistItemsCreate({
        checklist: checklistId, name,
        position: checklists.find(cl => cl.checklist_id === checklistId)?.items?.length ?? 0,
        checked: false,
      } as ChecklistItem);
      setChecklists(prev => prev.map(cl =>
        cl.checklist_id === checklistId ? { ...cl, items: [...(cl.items ?? []), item] } : cl
      ));
      setNewItemName(prev => ({ ...prev, [checklistId]: "" }));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const toggleItem = async (checklistId: number, item: ChecklistItem) => {
    if (item.item_id === undefined) return;
    try {
      const updated = await ChecklistItemsService.checklistItemsPartialUpdate(item.item_id, { checked: !item.checked });
      setChecklists(prev => prev.map(cl =>
        cl.checklist_id === checklistId
          ? { ...cl, items: cl.items?.map(i => i.item_id === item.item_id ? updated : i) }
          : cl
      ));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  const deleteItem = async (checklistId: number, itemId: number | undefined) => {
    if (itemId === undefined) return;
    try {
      await ChecklistItemsService.checklistItemsDelete(itemId);
      setChecklists(prev => prev.map(cl =>
        cl.checklist_id === checklistId
          ? { ...cl, items: cl.items?.filter(i => i.item_id !== itemId) }
          : cl
      ));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  // ── Labels ───────────────────────────────────────────────────
  const appliedLabelIds = new Set((card?.labels ?? []).map(cl => cl.label));

  const toggleLabel = async (label: Label) => {
    const existing = card?.labels?.find(cl => cl.label === label.label_id);
    if (existing) {
      await CardLabelsService.cardLabelsDelete(existing.id!);
      setCard(prev => prev ? { ...prev, labels: prev.labels?.filter(cl => cl.id !== existing.id) } : prev);
    } else {
      const created = await CardLabelsService.cardLabelsCreate({ card: cardId, label: label.label_id! } as CardLabel);
      setCard(prev => prev ? { ...prev, labels: [...(prev.labels ?? []), created] } : prev);
    }
  };

  // ── Membres ──────────────────────────────────────────────────
  const assignedUserIds = new Set((card?.members ?? []).map(m => m.user));

  const toggleMember = async (bm: BoardMember) => {
    const existing = card?.members?.find(m => m.user === bm.user);
    if (existing) {
      await CardMembersService.cardMembersDelete(existing.id!);
      setCard(prev => prev ? { ...prev, members: prev.members?.filter(m => m.id !== existing.id) } : prev);
    } else {
      const created = await CardMembersService.cardMembersCreate({ card: cardId, user: bm.user } as CardMember);
      setCard(prev => prev ? { ...prev, members: [...(prev.members ?? []), created] } : prev);
    }
  };

  // ── Pièces jointes ───────────────────────────────────────────
  const persistAttachment = async (url: string, filename: string, mime: string, size: number) => {
    const created = await AttachmentsService.attachmentsCreate({
      card: cardId, url, filename, mime_type: mime, size,
      uploaded_by: user?.user_id ?? 0,
    } as Attachment);
    setAttachments(prev => [...prev, created]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploadProgress(0);
    try {
      const result = await uploadFile(file, pct => setUploadProgress(pct));
      await persistAttachment(result.url, result.filename, result.mime_type, result.size);
      setUploadProgress(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Erreur d'upload");
      setUploadProgress(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleUrlAttachment = async () => {
    if (!attachUrl.trim() || !attachFilename.trim()) return;
    try {
      await persistAttachment(attachUrl.trim(), attachFilename.trim(), "application/octet-stream", 0);
      setAttachUrl(""); setAttachFilename("");
    } catch (err) { setUploadError(normalizeApiError(err)); }
  };

  const deleteAttachment = async (attachId: number) => {
    try {
      await AttachmentsService.attachmentsDelete(attachId);
      setAttachments(prev => prev.filter(a => a.attach_id !== attachId));
    } catch (err) { setError(normalizeApiError(err)); }
  };

  // ── Rendu ────────────────────────────────────────────────────
  if (loading) {
    return (
      <Overlay onClose={onClose}>
        <ModalShell>
          <div className="flex flex-col gap-4 p-8">
            {[...Array(4)].map((_, i) => <div key={i} className={`shimmer rounded-xl ${i === 0 ? "h-10" : "h-6"}`} />)}
          </div>
        </ModalShell>
      </Overlay>
    );
  }

  if (error || !card) {
    return (
      <Overlay onClose={onClose}>
        <ModalShell>
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertTriangle size={40} className="text-red-400" />
            <p className="text-sm font-semibold text-[var(--ink)]">{error ?? "Carte introuvable."}</p>
            <button onClick={onClose} className="mt-2 rounded-xl bg-[var(--surface-3)] px-4 py-2 text-sm font-bold text-[var(--ink)] hover:bg-[var(--line)] transition">Fermer</button>
          </div>
        </ModalShell>
      </Overlay>
    );
  }

  const dueDateObj = card.due_date ? new Date(card.due_date) : null;
  const isOverdue  = dueDateObj && !card.due_date_complete && dueDateObj < new Date();

  const hasLabels  = (card.labels?.length ?? 0) > 0;
  const hasMembers = (card.members?.length ?? 0) > 0;
  const hasDates   = !!(card.start_date || card.due_date);

  return (
    <Overlay onClose={onClose}>
      <ModalShell>
        {/* ── En-tête : titre + fermer ──────────────── */}
        <div className="flex items-start gap-3 border-b border-[var(--line)] px-5 pt-5 pb-4">
          <div className="mt-1 shrink-0 text-[var(--ink-3)]"><AlignLeft size={16} /></div>
          <div className="min-w-0 flex-1">
            {editingTitle ? (
              <input
                autoFocus
                className="w-full rounded-lg border-2 border-brand-500 bg-[var(--surface)] px-3 py-1.5 text-lg font-bold text-[var(--ink)] focus:outline-none"
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onBlur={saveTitle}
                onKeyDown={e => { if (e.key === "Enter") saveTitle(); if (e.key === "Escape") setEditingTitle(false); }}
              />
            ) : (
              <h2
                className="cursor-pointer text-lg font-bold leading-snug text-[var(--ink)] transition hover:text-brand-500"
                onClick={() => setEditingTitle(true)}
                title="Cliquer pour modifier"
              >
                {card.title}
              </h2>
            )}
            <p className="mt-0.5 text-xs text-[var(--ink-3)]">Carte #{card.card_id}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[var(--ink-3)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* ── Contenu principal ─────────────────────── */}
          <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-5 py-4">

            {/* Metadata strip: labels + membres + dates */}
            {(hasLabels || hasMembers || hasDates) && (
              <div className="flex flex-wrap gap-x-6 gap-y-3">
                {hasLabels && (
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">Étiquettes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {card.labels!.map(cl => (
                        <span
                          key={cl.id}
                          className="rounded-md px-2.5 py-1 text-xs font-bold text-white shadow-sm"
                          style={{ backgroundColor: cl.label_details?.color ?? "#888" }}
                        >
                          {cl.label_details?.name || "Label"}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {hasMembers && (
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">Membres</p>
                    <div className="flex -space-x-1.5">
                      {card.members!.map(m => (
                        <div
                          key={m.id}
                          title={m.user_details?.username ?? `#${m.user}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-brand-500 text-[10px] font-black text-white"
                        >
                          {(m.user_details?.username ?? "?")[0].toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {hasDates && (
                  <div>
                    <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--ink-3)]">Échéance</p>
                    {card.due_date && (
                      <label className={`flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                        card.due_date_complete
                          ? "bg-green-500 text-white"
                          : isOverdue
                            ? "bg-red-500 text-white"
                            : "bg-[var(--surface-3)] text-[var(--ink)]"
                      }`}>
                        <input
                          type="checkbox"
                          checked={!!card.due_date_complete}
                          onChange={() => patchCard({ due_date_complete: !card.due_date_complete })}
                          className="accent-white"
                        />
                        {dueDateObj!.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
                      </label>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <section>
              <SectionTitle icon={<AlignLeft size={14} />} label="Description" />
              {editingDesc ? (
                <div className="mt-2 flex flex-col gap-2">
                  <textarea
                    autoFocus rows={4}
                    className="w-full rounded-xl border-2 border-brand-500 bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] focus:outline-none"
                    value={descDraft}
                    onChange={e => setDescDraft(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Btn onClick={saveDesc} disabled={savingCard}>Sauvegarder</Btn>
                    <BtnGhost onClick={() => setEditingDesc(false)}>Annuler</BtnGhost>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => setEditingDesc(true)}
                  className={`mt-2 min-h-12 cursor-pointer rounded-xl border border-transparent p-3 text-sm transition hover:border-[var(--line)] hover:bg-[var(--surface-3)] ${
                    card.description ? "text-[var(--ink)]" : "italic text-[var(--ink-3)]"
                  }`}
                >
                  {card.description || "Ajouter une description…"}
                </div>
              )}
            </section>

            {/* Checklists */}
            {checklists.map(cl => {
              const total   = cl.items?.length ?? 0;
              const checked = cl.items?.filter(i => i.checked).length ?? 0;
              const pct     = total > 0 ? Math.round((checked / total) * 100) : 0;
              const barColor = pct === 100 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#3b82f6";
              return (
                <section key={cl.checklist_id}>
                  <div className="flex items-center justify-between">
                    <SectionTitle icon={<CheckSquare size={14} />} label={cl.name} />
                    <button onClick={() => deleteChecklist(cl.checklist_id!)}
                      className="rounded-lg border border-[var(--line)] px-2 py-0.5 text-xs font-semibold text-[var(--ink-3)] transition hover:border-red-400 hover:text-red-500">
                      Supprimer
                    </button>
                  </div>
                  {total > 0 && (
                    <div className="mt-2 mb-3 flex items-center gap-3">
                      <span className="w-8 text-right text-xs font-bold" style={{ color: barColor }}>{pct}%</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--line)]">
                        <div className="h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: barColor }} />
                      </div>
                    </div>
                  )}
                  <ul className="mt-2 flex flex-col gap-1">
                    {cl.items?.map(item => (
                      <li key={item.item_id} className="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[var(--surface-3)]">
                        <input type="checkbox" checked={item.checked}
                          onChange={() => toggleItem(cl.checklist_id!, item)}
                          className="accent-brand-500 flex-shrink-0" />
                        <span className={`flex-1 text-sm ${item.checked ? "text-[var(--ink-3)] line-through" : "text-[var(--ink)]"}`}>
                          {item.name}
                        </span>
                        <button onClick={() => deleteItem(cl.checklist_id!, item.item_id!)}
                          className="text-transparent transition group-hover:text-[var(--ink-3)] hover:!text-red-500">
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex gap-2">
                    <input placeholder="Nouvel élément…"
                      value={newItemName[cl.checklist_id!] ?? ""}
                      onChange={e => setNewItemName(prev => ({ ...prev, [cl.checklist_id!]: e.target.value }))}
                      onKeyDown={e => e.key === "Enter" && addChecklistItem(cl.checklist_id!)}
                      className="flex-1 rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
                    />
                    <button onClick={() => addChecklistItem(cl.checklist_id!)}
                      className="rounded-xl bg-brand-500 px-3 py-1.5 text-white transition hover:bg-brand-600">
                      <Plus size={14} />
                    </button>
                  </div>
                </section>
              );
            })}

            {addingChecklist ? (
              <div className="flex gap-2">
                <input autoFocus placeholder="Nom de la checklist…"
                  value={newChecklistName}
                  onChange={e => setNewChecklistName(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") createChecklist(); if (e.key === "Escape") setAddingChecklist(false); }}
                  className="flex-1 rounded-xl border-2 border-brand-500 bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:outline-none"
                />
                <Btn onClick={createChecklist}>Créer</Btn>
                <BtnGhost onClick={() => setAddingChecklist(false)}><X size={14} /></BtnGhost>
              </div>
            ) : (
              <button onClick={() => setAddingChecklist(true)}
                className="flex items-center gap-2 self-start rounded-xl border border-dashed border-[var(--line)] px-3 py-1.5 text-sm font-semibold text-[var(--ink-3)] transition hover:border-brand-500 hover:text-brand-500">
                <CheckSquare size={14} /> + Checklist
              </button>
            )}

            {/* Pièces jointes */}
            {attachments.length > 0 && (
              <section>
                <SectionTitle icon={<Paperclip size={14} />} label={`Pièces jointes (${attachments.length})`} />
                <div className="mt-2 flex flex-col gap-2">
                  {attachments.map(a => {
                    const ext = a.filename.split(".").pop()?.toUpperCase().slice(0, 4) ?? "FILE";
                    const isImage = a.mime_type.startsWith("image/");
                    return (
                      <div key={a.attach_id} className="group flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-3)] p-3 transition hover:border-[var(--line-strong)]">
                        {isImage ? (
                          <img src={a.url} alt={a.filename}
                            className="h-10 w-14 flex-shrink-0 rounded-lg object-cover border border-[var(--line)]"
                          />
                        ) : (
                          <div className="flex h-10 w-14 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs font-bold text-[var(--ink-3)]">
                            {ext}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <a href={a.url} target="_blank" rel="noopener noreferrer"
                            className="block truncate text-sm font-semibold text-brand-600 hover:underline dark:text-brand-400">
                            {a.filename}
                          </a>
                          {a.size > 0 && (
                            <p className="text-xs text-[var(--ink-3)]">{(a.size / 1024).toFixed(1)} Ko</p>
                          )}
                        </div>
                        <button onClick={() => deleteAttachment(a.attach_id!)}
                          className="text-[var(--ink-3)] opacity-0 transition group-hover:opacity-100 hover:text-red-500">
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Commentaires */}
            <section>
              <SectionTitle icon={<MessageCircle size={14} />} label={`Activité${comments.length > 0 ? ` (${comments.length})` : ""}`} />
              <div className="mt-3 mb-4 flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-black text-white">
                  {(user?.username ?? "?").substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="Écrire un commentaire…"
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    rows={2}
                    className="w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none transition"
                  />
                  {newComment.trim() && (
                    <div className="mt-2 flex gap-2">
                      <Btn onClick={postComment} disabled={commentLoading}>
                        {commentLoading ? "Envoi…" : "Envoyer"}
                      </Btn>
                      <BtnGhost onClick={() => setNewComment("")}>Annuler</BtnGhost>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {comments.map(c => (
                  <div key={c.comment_id} className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--surface-3)] text-xs font-bold text-[var(--ink-2)] border border-[var(--line)]">
                      {(c.user_details?.username ?? "?").substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-sm font-bold text-[var(--ink)]">
                          {c.user_details?.username ?? `#${c.user}`}
                        </span>
                        <span className="text-xs text-[var(--ink-3)]">
                          {c.created_at ? new Date(c.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                        {c.is_edited && <span className="text-xs italic text-[var(--ink-3)]">modifié</span>}
                      </div>
                      {editingCommentId === c.comment_id ? (
                        <div className="mt-1 flex flex-col gap-2">
                          <textarea autoFocus rows={2}
                            className="w-full rounded-xl border-2 border-brand-500 bg-[var(--surface)] px-3 py-1.5 text-sm text-[var(--ink)] focus:outline-none"
                            value={commentDraft}
                            onChange={e => setCommentDraft(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <Btn onClick={() => saveComment(c.comment_id!)}>Sauvegarder</Btn>
                            <BtnGhost onClick={() => setEditingCommentId(null)}>Annuler</BtnGhost>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="mt-1 rounded-xl bg-[var(--surface-3)] px-3 py-2 text-sm text-[var(--ink)] border border-[var(--line)]">
                            {c.content}
                          </p>
                          {c.user_details?.user_id === user?.user_id && (
                            <div className="mt-1 flex gap-3">
                              <button onClick={() => { setEditingCommentId(c.comment_id!); setCommentDraft(c.content); }}
                                className="flex items-center gap-1 text-xs text-[var(--ink-3)] transition hover:text-[var(--ink)]">
                                <Pencil size={10} /> Modifier
                              </button>
                              <button onClick={() => deleteComment(c.comment_id!)}
                                className="text-xs text-[var(--ink-3)] transition hover:text-red-500">
                                Supprimer
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">{error}</p>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────── */}
          <aside className="flex w-48 shrink-0 flex-col gap-1.5 overflow-y-auto border-l border-[var(--line)] px-3 py-4">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--ink-3)]">Ajouter à la carte</p>

            {/* Labels */}
            <SideAction icon={<Tag size={14} />} label="Labels"
              active={openPanel === "labels"} onClick={() => setOpenPanel(p => p === "labels" ? null : "labels")} />
            {openPanel === "labels" && (
              <div className="flex flex-col gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-3)] p-2">
                {boardLabels.length === 0 && <p className="text-xs text-[var(--ink-3)]">Aucun label sur ce board.</p>}
                {boardLabels.map(label => (
                  <button key={label.label_id} onClick={() => toggleLabel(label)}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold transition hover:opacity-80"
                    style={{ backgroundColor: (label.color ?? "#888") + "22", color: label.color ?? "#888" }}>
                    <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: label.color }} />
                    <span className="flex-1 truncate">{label.name || label.color}</span>
                    {label.label_id != null && appliedLabelIds.has(label.label_id) && <Check size={12} />}
                  </button>
                ))}
              </div>
            )}

            {/* Membres */}
            <SideAction icon={<User size={14} />} label="Membres"
              active={openPanel === "members"} onClick={() => setOpenPanel(p => p === "members" ? null : "members")} />
            {openPanel === "members" && (
              <div className="flex flex-col gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-3)] p-2">
                {boardMembers.length === 0 && <p className="text-xs text-[var(--ink-3)]">Aucun membre.</p>}
                {boardMembers.map(bm => (
                  <button key={bm.id} onClick={() => toggleMember(bm)}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-[var(--ink)] transition hover:bg-[var(--surface)] ${
                      assignedUserIds.has(bm.user) ? "bg-brand-100 dark:bg-brand-700/20" : ""
                    }`}>
                    <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-black text-white">
                      {(bm.user_details?.username ?? "?").substring(0, 2).toUpperCase()}
                    </span>
                    <span className="flex-1 truncate">{bm.user_details?.username ?? `#${bm.user}`}</span>
                    {assignedUserIds.has(bm.user) && <Check size={12} className="text-brand-500" />}
                  </button>
                ))}
              </div>
            )}

            {/* Dates */}
            <SideAction icon={<Calendar size={14} />} label="Dates"
              active={openPanel === "dates"} onClick={() => setOpenPanel(p => p === "dates" ? null : "dates")} />
            {openPanel === "dates" && (
              <div className="flex flex-col gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface-3)] p-3">
                <div>
                  <label className="text-xs font-bold text-[var(--ink-2)]">Début</label>
                  <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--ink)] focus:border-brand-500 focus:outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-[var(--ink-2)]">Échéance</label>
                  <input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)}
                    className="mt-1 block w-full rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-2 py-1 text-xs text-[var(--ink)] focus:border-brand-500 focus:outline-none" />
                </div>
                <Btn onClick={saveDates} disabled={savingCard}>Sauvegarder</Btn>
              </div>
            )}

            {/* Pièces jointes */}
            <SideAction
              icon={<Paperclip size={14} />}
              label={`Joindre${attachments.length > 0 ? ` (${attachments.length})` : ""}`}
              active={openPanel === "attachments"}
              onClick={() => setOpenPanel(p => p === "attachments" ? null : "attachments")}
            />
            {openPanel === "attachments" && (
              <div className="flex flex-col gap-2 rounded-xl border border-[var(--line)] bg-[var(--surface-3)] p-3">
                {/* Mode Cloudinary ou URL */}
                {!urlMode ? (
                  <>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadProgress !== null}
                      className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-400 bg-brand-50 px-3 py-3 text-xs font-semibold text-brand-600 transition hover:bg-brand-100 disabled:opacity-50 dark:bg-brand-900/20 dark:text-brand-400"
                    >
                      <Upload size={14} />
                      {uploadProgress !== null ? `Upload… ${uploadProgress}%` : "Choisir un fichier"}
                    </button>
                    {uploadProgress !== null && (
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--line)]">
                        <div className="h-1.5 rounded-full bg-brand-500 transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    )}
                    <button onClick={() => setUrlMode(true)}
                      className="flex items-center gap-1 text-xs text-[var(--ink-3)] transition hover:text-[var(--ink)]">
                      <Link2 size={11} /> Utiliser une URL
                    </button>
                  </>
                ) : (
                  <>
                    <input placeholder="Nom du fichier…" value={attachFilename}
                      onChange={e => setAttachFilename(e.target.value)}
                      className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none" />
                    <input placeholder="https://…" value={attachUrl}
                      onChange={e => setAttachUrl(e.target.value)}
                      className="rounded-xl border-2 border-[var(--line)] bg-[var(--surface)] px-2 py-1.5 text-xs text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-brand-500 focus:outline-none" />
                    <button onClick={handleUrlAttachment}
                      disabled={!attachUrl.trim() || !attachFilename.trim()}
                      className="flex items-center justify-center gap-1 rounded-xl bg-brand-500 py-1.5 text-xs font-bold text-white transition hover:bg-brand-600 disabled:opacity-40">
                      <Plus size={12} /> Ajouter
                    </button>
                    {cloudinaryConfigured && (
                      <button onClick={() => setUrlMode(false)}
                        className="flex items-center gap-1 text-xs text-[var(--ink-3)] transition hover:text-[var(--ink)]">
                        <Upload size={11} /> Upload fichier
                      </button>
                    )}
                  </>
                )}
                {uploadError && (
                  <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-900/20 dark:text-red-400">{uploadError}</p>
                )}
                {!cloudinaryConfigured && (
                  <p className="text-[10px] text-[var(--ink-3)] leading-relaxed">
                    Pour l'upload direct, configure Cloudinary dans <code className="text-brand-500">.env.local</code>.
                  </p>
                )}
              </div>
            )}

            <div className="my-2 h-px bg-[var(--line)]" />
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[var(--ink-3)]">Actions</p>

            <SideAction icon={<Archive size={14} />} label="Archiver" onClick={archiveCard} />
            <SideAction icon={<Trash2 size={14} />} label="Supprimer" onClick={deleteCard} danger />
          </aside>
        </div>
      </ModalShell>
    </Overlay>
  );
}

/* ── Composants internes ────────────────────────────────────── */

function Overlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-10 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      {children}
    </div>
  );
}

function ModalShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface)] shadow-2xl"
      style={{ maxWidth: "min(760px, 96vw)", maxHeight: "88vh" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[var(--ink-3)]">{icon}</span>
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--ink-3)]">{label}</p>
    </div>
  );
}

function SideAction({
  icon, label, onClick, active = false, danger = false,
}: {
  icon: React.ReactNode; label: string; onClick: () => void; active?: boolean; danger?: boolean;
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-xs font-semibold transition ${
        danger
          ? "border-red-200 text-red-500 hover:border-red-400 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20"
          : active
            ? "border-brand-400 bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
            : "border-[var(--line)] text-[var(--ink-2)] hover:bg-[var(--surface-3)] hover:text-[var(--ink)]"
      }`}>
      {icon}{label}
    </button>
  );
}

function Btn({ onClick, children, disabled }: { onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="rounded-xl bg-brand-500 px-4 py-1.5 text-sm font-bold text-white transition hover:bg-brand-600 disabled:opacity-40">
      {children}
    </button>
  );
}

function BtnGhost({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className="rounded-xl border border-[var(--line)] px-4 py-1.5 text-sm font-semibold text-[var(--ink-2)] transition hover:bg-[var(--surface-3)]">
      {children}
    </button>
  );
}
