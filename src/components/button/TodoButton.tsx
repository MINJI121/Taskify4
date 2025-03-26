import React from "react";
import clsx from "clsx";
import Image from "next/image";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean;
}

const TodoButton: React.FC<ButtonProps> = ({
  fullWidth = false,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={clsx(
        "flex justify-center items-center gap-[10px] bg-white transition-all",
        "rounded-lg px-4 py-3 font-semibold",
        "border border-gray-300 hover:border-purple-500",
        fullWidth ? "w-full" : "w-[284px] md:w-[544px] lg:w-[314px]", // 반응형 너비
        "h-[32px] md:h-[40px] lg:h-[40px]", // 반응형 높이
        "mt-[10px] md:mt-[16px] lg:mt-[20px]", // 여백
        "text-lg md:text-2lg lg:text-2lg",
        className
      )}
      {...props}
    >
      <span className="truncate">{children}</span>
      <Image
        src="/svgs/add.svg"
        alt="Plus Icon"
        width={24}
        height={24}
        className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 p-1 bg-purple-100 rounded-md"
      />
    </button>
  );
};

export default TodoButton;
