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
    "w-[40px] h-[40px] flex justify-center items-center border border-[var(--color-gray3)] rounded-md text-[16px] font-medium cursor-pointer transition";

  const enabledTextColor = "text-[var(--color-gray1)] hover:bg-gray-100";
  const disabledTextColor = "text-[var(--color-gray3)] ";

  const finalStyle = `${baseStyle} ${disabled ? disabledTextColor : enabledTextColor}`;

  return (
    <button className={finalStyle} disabled={disabled} {...props}>
      {direction === "left" ? "<" : ">"}
    </button>
  );
};
