import React from "react";

interface PaginationButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  direction?: "left" | "right";
  disabled?: boolean;
}

export const PaginationButton: React.FC<PaginationButtonProps> = ({
  direction = "left",
  disabled = false,
  ...props
}) => {
  const baseStyle =
    "w-[40px] h-[40px] flex justify-center items-center bg-white border border-gray3 rounded-md text-[16px] font-medium transition";

  const enabledTextColor = "text-gray1 bg-white hover:bg-gray5 cursor-pointer";
  const disabledTextColor = "bg-gray4 text-gray3 cursor-default";
  const finalStyle = `${baseStyle} ${disabled ? disabledTextColor : enabledTextColor}`;

  return (
    <button className={finalStyle} disabled={disabled} {...props}>
      {direction === "left" ? "<" : ">"}
    </button>
  );
};
