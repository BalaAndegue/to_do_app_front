import { useState } from "react";

interface CommentSectionProps {
  comments: { id: number; text: string; author: string }[];
}

export default function CommentSection({ comments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    // Ajout du commentaire via CommentsService
    // ...
    setNewComment("");
  };

  return (
    <div className="bg-white dark:bg-black rounded p-3 border border-orange-200 mt-4">
      <h4 className="text-lg font-bold text-orange-500 mb-2">Commentaires</h4>
      <ul className="flex flex-col gap-2 mb-2">
        {comments.map(comment => (
          <li key={comment.id} className="text-black dark:text-white">
            <span className="font-bold text-orange-500 mr-2">{comment.author}</span>
            {comment.text}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={e => setNewComment(e.target.value)}
          placeholder="Ajouter un commentaire..."
          className="p-2 rounded border border-yellow-300 bg-yellow-50 dark:bg-zinc-900 text-black dark:text-white flex-1"
        />
        <button
          onClick={handleAddComment}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded"
        >
          Ajouter
        </button>
      </div>
    </div>
  );
}
