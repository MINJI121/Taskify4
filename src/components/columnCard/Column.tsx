// ColumnCard.tsx
import TodoButton from "@/components/button/TodoButton";
import { useState } from "react";
import { CardType } from "@/types/task";
import Card from "./Card";
import Image from "next/image";

type ColumnCardProps = {
  title?: string;
  tasks?: CardType[];
};

export default function ColumnCard({
  title = "new Task",
  tasks = [],
}: ColumnCardProps) {
  const [showCard, setShowCard] = useState(false);

  return (
    <div className="w-[354px] h-[1010px] border-[var(--color-gray4)] flex flex-col rounded-md border border-solid bg-gray-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">
            <span className="text-[var(--primary)]">•</span> {title}
          </h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </div>
        <Image
          src="/svgs/settings.svg"
          alt="setting icon"
          width={24}
          height={24}
          priority
        />
      </div>

      <div onClick={() => setShowCard(true)}>
        <TodoButton />
      </div>
      {showCard &&
        tasks.map((task) => (
          <Card
            key={task.id}
            {...task}
            imageUrl={task.imageUrl}
            assignee={task.assignee}
          />
        ))}
    </div>
  );
}
