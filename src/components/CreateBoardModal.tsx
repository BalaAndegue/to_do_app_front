"use client";

import { useState } from "react";
import { BoardsService, type Board } from "@/lib";

interface CreateBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newBoard: Board) => void;
}

export default function CreateBoardModal({ isOpen, onClose, onSuccess }: CreateBoardModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Board model requires name. position can be 0.
            const boardData: any = {
                name,
                description,
                visibility: "private",
                position: 0
            };

            const response: any = await BoardsService.boardsCreate(boardData);

            // Handle wrapped response
            const newBoard = response?.data || response;

            onSuccess(newBoard);
            onClose();
            setName("");
            setDescription("");
        } catch (err: any) {
            setError(err.message || "Failed to create board.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md border border-[#e0e0e0] shadow-xl">
                <header className="p-6 border-b border-[#e0e0e0] flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#161616]">Create New Board</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-black">&times;</button>
                </header>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && <div className="text-red-600 text-sm bg-red-50 p-2 border-l-4 border-red-600">{error}</div>}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Board Name</label>
                        <input
                            autoFocus
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border border-[#e0e0e0] bg-[#f4f4f4] p-3 focus:outline-none focus:border-[#0f62fe] transition-colors"
                            placeholder="e.g. My Awesome Project"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase">Description (Optional)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border border-[#e0e0e0] bg-[#f4f4f4] p-3 focus:outline-none focus:border-[#0f62fe] transition-colors h-24 resize-none"
                            placeholder="What is this board about?"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white border border-[#e0e0e0] py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !name}
                            className="flex-1 bg-[#0f62fe] text-white py-3 text-sm font-medium hover:bg-[#0353e9] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating..." : "Create Board"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
