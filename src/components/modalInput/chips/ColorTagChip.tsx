import clsx from "clsx";

const tagColorSet = [
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

export function getTagColor(index: number) {
  return tagColorSet[index % tagColorSet.length];
}

export default function ColorTagChip({
  children,
  onTagClick,
  className,
}: {
  children: string;
  onTagClick?: (children: string) => void;
  className?: string;
}): React.JSX.Element {
  const handleClick = () => {
    onTagClick?.(children);
  };

  return (
    <button
      onClick={handleClick}
      className={clsx(
        "px-3 py-1 rounded-[4px] text-12-r whitespace-nowrap",
        className
      )}
    >
      {children}
    </button>
  );
}
