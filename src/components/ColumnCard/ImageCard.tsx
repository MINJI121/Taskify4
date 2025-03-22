// ImageCard.tsx
import Image from "next/image";
import { TaskType } from "@/types/task";

export default function ImageCard({
  title = "new Task",
  dueDate,
  tags,
  assignee = "Team4",
  imageUrl = "/svgs/img.svg",
}: TaskType) {
  return (
    <div className="w-[314px] border border-gray-300 rounded-md p-4">
      <Image
        className="w-full h-40 object-cover rounded-md"
        src={imageUrl}
        width={300}
        height={160}
        alt="Task Image"
      />
      <h3 className="font-medium mt-2">{title}</h3>
      <div className="flex items-center gap-2 mt-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="bg-blue-200 text-blue-700 px-2 py-1 rounded-md text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2.5">
        <div className="flex items-center gap-2.5 text-gray-500 text-sm">
          <Image
            src="/svgs/calendar.svg"
            alt="calendar icon"
            width={16}
            height={16}
            priority
          />
          <p>{dueDate}</p>
        </div>
        <div className="w-7 h-7 flex items-center justify-center bg-[#A3C4A2] text-white font-bold rounded-full text-sm">
          {assignee[0]}
        </div>
      </div>
    </div>
  );
}
