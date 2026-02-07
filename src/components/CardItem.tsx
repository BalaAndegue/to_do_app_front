import { Card } from "@/lib";

interface CardItemProps {
  card: Card;
}

export default function CardItem({ card }: CardItemProps) {
  return (
    <div className="ibm-card p-4 shadow-sm hover:shadow-md bg-white border-l-4 border-l-[#f1c40f] cursor-grab active:cursor-grabbing">
      <div className="text-sm font-semibold text-[#161616] mb-1">{card.title}</div>
      {card.description && (
        <p className="text-xs text-gray-500 line-clamp-3 mb-2">{card.description}</p>
      )}
      <div className="flex items-center justify-between mt-3">
        <div className="flex -space-x-2">
          {/* Placeholder for members if API doesn't provide them nested */}
          <div className="w-5 h-5 rounded-full bg-[#0f62fe] border border-white text-[8px] flex items-center justify-center text-white">
            JD
          </div>
        </div>
        {card.due_date && (
          <span className="text-[10px] text-gray-400 font-mono">
            {new Date(card.due_date).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
