// 태그 색상 변경용 태그 컬러칩
import clsx from "clsx";

export const tagColors = [
  {
    textColor: "text-[var(--sortTextBlue)]",
    bgColor: "bg-[var(--sortTextBgBlue)]",
  },
  {
    textColor: "text-[var(--sortTextPink)]",
    bgColor: "bg-[var(--sortTextBgPink)]",
  },
  {
    textColor: "text-[var(--sortTextGreen)]",
    bgColor: "bg-[var(--sortTextBgGreen)]",
  },
  {
    textColor: "text-[var(--sortTextOrange)]",
    bgColor: "bg-[var(--sortTextBgOrange)]",
  },
];

interface SelectTagColorChipProps {
  selectedColorIndex: number;
  setSelectedColorIndex: (index: number) => void;
}

export function SelectTagColorChip({
  selectedColorIndex,
  setSelectedColorIndex,
}: SelectTagColorChipProps) {
  return (
    <div className="flex gap-2 mt-2">
      {tagColors.map((color, idx) => (
        <div
          key={idx}
          onClick={() => setSelectedColorIndex(idx)}
          className={clsx(
            "w-5 h-5 rounded-full cursor-pointer transition",
            color.bgColor,
            selectedColorIndex === idx && "ring-[1.5px] ring-[var(--primary)]"
          )}
        />
      ))}
    </div>
  );
}
