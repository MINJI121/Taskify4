// 태그 색상 변경용 태그 컬러칩
import clsx from "clsx";

const tagColors = [
  {
    textColor: "text-sortTextBlue",
    bgColor: "bg-sortTextBgBlue",
  },
  {
    textColor: "text-sortTextPink",
    bgColor: "bg-sortTextBgPink",
  },
  {
    textColor: "text-sortTextGreen",
    bgColor: "bg-sortTextBgGreen",
  },
  {
    textColor: "text-sortTextOrange",
    bgColor: "bg-sortTextBgOrange",
  },
];

interface Tag {
  text: string;
  textColor: string;
  bgColor: string;
}

interface TagColorChipProps {
  tags: Tag[];
  selectedTagIndex: number | null;
  setTags: (tags: Tag[]) => void;
  onValueChange: (newTags: string[]) => void;
}

export function TagColorChip({
  tags,
  selectedTagIndex,
  setTags,
  onValueChange,
}: TagColorChipProps) {
  return (
    <>
      {selectedTagIndex !== null && (
        <div className="flex gap-2">
          {tagColors.map((color, colorIdx) => (
            <div
              key={colorIdx}
              onClick={() => {
                const updatedTags = [...tags];
                updatedTags[selectedTagIndex] = {
                  ...updatedTags[selectedTagIndex],
                  textColor: color.textColor,
                  bgColor: color.bgColor,
                };
                setTags(updatedTags);
                onValueChange(updatedTags.map((tag) => tag.text));
              }}
              className={clsx(
                "w-5 h-5 rounded-full cursor-pointer",
                color.bgColor,
                selectedTagIndex !== null &&
                  tags[selectedTagIndex]?.bgColor === color.bgColor &&
                  "ring-[1.5px] ring-primary"
              )}
            />
          ))}
        </div>
      )}
    </>
  );
}
