import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface DashboardAddButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

const DashboardAddButton: React.FC<DashboardAddButtonProps> = ({
  fullWidth = false,
  className,
  children = "새로운 대시보드",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center gap-[10px] bg-white transition-all",
        "rounded-lg px-4 py-3 font-semibold",
        "border border-gray-300 hover:border-purple-500",
        fullWidth ? "w-full" : "w-[260px] md:w-[247px] lg:w-[332px]", // 반응형 너비
        "h-[58px] md:h-[68px] lg:h-[70px]", // 반응형 높이
        "mt-[10px] md:mt-[16px] lg:mt-[20px]", // 여백
        "text-lg md:text-2lg lg:text-2lg",
        className
      )}
      {...props}
    >
      <span className="font-semibold">{children}</span>
      <Image
        src="/svgs/add.svg"
        alt="Plus Icon"
        width={24}
        height={24}
        className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] lg:w-[22px] lg:h-[22px] p-1 rounded-md bg-purple-100"
      />
    </button>
  );
};

export default DashboardAddButton;
