import Image from "next/image";

interface AddButtonProps {
  bgColor?: string;
  size?: string;
}

export default function AddButton({ bgColor, size }: AddButtonProps) {
  return (
    <Image
      src="/svgs/add.svg"
      width={14}
      height={14}
      alt="더하기 아이콘"
      className={`
        rounded-sm ${bgColor ? bgColor : "bg-[var(--primary)]"} 
        ${size === "todoSize" ? "size-[28px]" : "size-[16px] sm:size-[14.5px]"}
      `}
    />
  );
}
