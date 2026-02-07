import CardItem from "./CardItem";
import { List, Card } from "@/lib";

interface ListColumnProps {
  list: List;
  cards: Card[];
}

export default function ListColumn({ list, cards }: ListColumnProps) {
  return (
    <div className="bg-[#f4f4f4] p-4 min-w-[300px] max-w-[300px] flex flex-col h-fit border border-[#e0e0e0]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-[#161616] uppercase tracking-wider">{list.name}</h2>
        <span className="text-xs text-gray-400 font-mono">({cards.length})</span>
      </div>

      <div className="flex flex-col gap-3">
        {cards.length > 0 ? (
          cards.map(card => <CardItem key={card.card_id} card={card} />)
        ) : (
          <div className="py-8 border-2 border-dashed border-[#e0e0e0] flex items-center justify-center text-xs text-gray-400">
            Empty list
          </div>
        )}
      </div>

      <button className="text-[#0f62fe] hover:bg-[#e0e0e0] text-xs font-medium py-2 px-1 text-left mt-4 transition-colors">
        + Add a card
      </button>
    </div>
  );
}
