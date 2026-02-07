interface LabelTagProps {
  label: { id: number; name: string; color: string };
}

export default function LabelTag({ label }: LabelTagProps) {
  return (
    <span
      className="px-2 py-1 rounded text-xs font-bold mr-1"
      style={{ backgroundColor: label.color, color: label.color === '#fff' ? '#000' : '#fff' }}
    >
      {label.name}
    </span>
  );
}
