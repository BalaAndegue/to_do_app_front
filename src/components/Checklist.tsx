interface ChecklistProps {
  checklist: {
    id: number;
    title: string;
    items: { id: number; text: string; checked: boolean }[];
  };
}

export default function Checklist({ checklist }: ChecklistProps) {
  return (
    <div className="bg-yellow-50 dark:bg-zinc-900 rounded p-3 border border-yellow-300 mb-4">
      <h4 className="text-lg font-bold text-orange-500 mb-2">{checklist.title}</h4>
      <ul className="flex flex-col gap-2">
        {checklist.items.map(item => (
          <li key={item.id} className="flex items-center gap-2">
            <input type="checkbox" checked={item.checked} readOnly className="accent-orange-500" />
            <span className={item.checked ? "line-through text-zinc-400" : "text-black dark:text-white"}>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
