import Checklist from "./Checklist";
import CommentSection from "./CommentSection";
import LabelTag from "./LabelTag";
import MemberAvatar from "./MemberAvatar";

interface CardDetailsProps {
  card: {
    id: number;
    title: string;
    description?: string;
    labels?: { id: number; name: string; color: string }[];
    members?: { id: number; name: string; avatarUrl?: string }[];
    checklists?: any[];
    comments?: any[];
  };
}

export default function CardDetails({ card }: CardDetailsProps) {
  return (
    <div className="bg-white dark:bg-black rounded-lg shadow-lg p-6 border border-orange-300 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold text-orange-500 mb-2">{card.title}</h2>
      {card.description && <p className="mb-4 text-black dark:text-white">{card.description}</p>}
      <div className="flex gap-2 mb-4">
        {card.labels && card.labels.map(label => (
          <LabelTag key={label.id} label={label} />
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        {card.members && card.members.map(member => (
          <MemberAvatar key={member.id} member={member} />
        ))}
      </div>
      {card.checklists && card.checklists.map(checklist => (
        <Checklist key={checklist.id} checklist={checklist} />
      ))}
      <CommentSection comments={card.comments || []} />
    </div>
  );
}
