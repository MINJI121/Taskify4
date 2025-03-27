import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface CardButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
  title?: string;
  showCrown?: boolean;
  color?: string;
}

const CardButton: React.FC<CardButtonProps> = ({
  fullWidth,
  className,
  title = "비브리지",
  showCrown = true,
  color = "#7ac555", // 기본 색상
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-between items-center bg-white transition-all",
        "rounded-lg px-4 py-3 font-semibold",
        "border border-gray-300 hover:border-purple-500",
        fullWidth ? "w-full" : "w-[260px] md:w-[247px] lg:w-[332px]",
        "h-[58px] md:h-[68px] lg:h-[70px]",
        "mt-[10px] md:mt-[16px] lg:mt-[20px]",
        "text-lg md:text-2lg lg:text-2lg",
        className
      )}
      {...props}
    >
      {/* 왼쪽: 색상 도트 + 제목 + 왕관 */}
      <div className="flex items-center gap-[10px] overflow-hidden">
        {/* 색상 원 */}
        <svg width="8" height="8" viewBox="0 0 8 8" fill={color}>
          <circle cx="4" cy="4" r="4" />
        </svg>

        {/* 제목 */}
        <span className="font-semibold truncate">{title}</span>

        {/* 왕관 */}
        {showCrown && (
          <Image
            src="/svgs/icon-crown.svg"
            alt="crown Icon"
            width={20}
            height={20}
            className="w-[20px] h-[20px]"
          />
        )}
      </div>

      {/* 오른쪽: 화살표 아이콘 */}
      <Image
        src="/svgs/arrow-forward-black.svg"
        alt="arrow icon"
        width={16}
        height={16}
        className="ml-2"
      />
    </button>
  );
};

export default CardButton;
