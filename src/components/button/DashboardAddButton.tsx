import React from "react";
import clsx from "clsx";
import Image from "next/image";

const DashboardAddButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ className, children = "새로운 대시보드", ...props }) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center gap-[10px] bg-white transition-all",
        "rounded-lg px-4 py-3",
        "border border-gray-300 hover:border-purple-500",
        "min-w-0 w-full max-w-[260px] md:max-w-[247px] lg:max-w-[332px]", // 반응형 너비
        "h-[58px] md:h-[68px] lg:h-[70px]", // 반응형 높이
        "mt-[2px]", // 여백
        "text-[14px] sm:text-[16px]",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="text-black3 font-semibold">{children}</span>
      <Image
        src="/svgs/add.svg"
        alt="Plus Icon"
        width={24}
        height={24}
        className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px] p-1 rounded-[4px] bg-[var(--color-violet8)]"
      />
    </button>
  );
};

export default DashboardAddButton;
