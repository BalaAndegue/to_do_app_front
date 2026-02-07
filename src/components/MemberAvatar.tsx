// Création du composant MemberAvatar pour afficher l'avatar d'un membre sur une carte ou un board, avec le thème orange/blanc/jaune/noir.

interface MemberAvatarProps {
  member: { id: number; name: string; avatarUrl?: string };
}

export default function MemberAvatar({ member }: MemberAvatarProps) {
  return (
    <div className="inline-block w-8 h-8 rounded-full bg-orange-400 text-white flex items-center justify-center font-bold mr-1">
      {member.avatarUrl ? (
        <img src={member.avatarUrl} alt={member.name} className="w-8 h-8 rounded-full object-cover" />
      ) : (
        member.name.charAt(0)
      )}
    </div>
  );
}
