import React from "react";
import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

const ColumnsButton: React.FC<ButtonProps> = ({
  fullWidth,
  className,
  children = "새로운 칼럼 추가하기",
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center gap-[10px] bg-white transition-all",
        "rounded-lg px-4 py-3 font-semibold",
        "border border-gray-200 hover:border-purple-500",
        fullWidth ? "w-full" : "w-[260px] sm:w-[560px] lg:w-[354px]",
        "h-[70px] md:h-[70px] lg:h-[70px]",
        "mt-[6px] md:mt-[8px]",
        "text-black3 text-lg md:text-2lg",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <span className="font-semibold">{children}</span>

      <span className="w-[23px] h-[23px] flex items-center justify-center text-[#5534DA] text-[20px] font-extralight rounded-md bg-[#F1EFFD]">
        +
      </span>
    </button>
  );
};

export default ColumnsButton;
