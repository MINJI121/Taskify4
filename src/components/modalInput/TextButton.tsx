import clsx from "clsx";
import React, { ReactNode } from "react";
// xxs 삭제, xs 입력,  sm 수락거절, md 취소 확인, lg 대시보드삭제하기,  xl로그인
interface ButtonProps {
  type?: "submit" | "reset" | "button";
  buttonSize?: "xxs" | "xs" | "sm" | "md" | "lg" | "xl";
  textSize?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "third";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const TextButton = ({
  type = "button",
  buttonSize,
  textSize = "sm",
  color,
  children,
  onClick,
  disabled = false,
  className,
  fullWidth,
}: ButtonProps) => {
  const buttonSizeClasses = clsx({
    "w-[84px] h-[28px]": buttonSize === "xxs",
    "px-[31px] py-[9px] sm:px-[31.5px] sm:py-[7px]": buttonSize === "xs",
    "px-[29.5px] py-[7.5px] md:px-[23.5px] md:py-[6.5px] sm:px-[44px] sm:py-[7px]":
      buttonSize === "sm",
    "px-[46px] py-[14.5px]  sm:px-[56px] sm:py-[12.5px]": buttonSize === "md",
    "py-[20.5px] px-[95.5px] sm:px-[84.5px] sm:py-[16.5px]":
      buttonSize === "lg",
    "px-[236.5px] py-[14.5px] sm:px-[152px]": buttonSize === "xl",
  });
  const textSizeClasses = clsx({
    "text-sm": textSize === "xs",
    "text-md sm:text-xs": textSize === "sm",
    "text-base sm:text-[14px] ": textSize === "md",
    "text-lg": textSize === "lg",
  });

  const colorClasses = clsx({
    [disabled
      ? "bg-gray4 text-white cursor-not-allowed border-[1px] border-gray4 rounded-lg"
      : "bg-violet2 border-[1px] border-violet2 text-white rounded-lg"]:
      color === "primary",
    "text-violet2 border-gray3 border-[1px] rounded-lg": color === "secondary",
    "border-gray3 border-[1px] rounded-lg": color === "third",
  });

  const buttonFullClasses = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`${className} ${textSizeClasses} ${colorClasses} ${buttonSizeClasses} ${buttonFullClasses} font-medium`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default TextButton;
