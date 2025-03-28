import React from "react";

interface CustomBtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  iAmOptional?: string;
  children: React.ReactNode;
  variant?: "primary" | "primaryDisabled" | "outline" | "outlineDisabled";
  size?:
    | "large"
    | "medium"
    | "small"
    | "tabletSmall"
    | "mobileMedium"
    | "mobileSmall";
  disabled?: boolean;
}

export const CustomBtn: React.FC<CustomBtnProps> = ({
  children,
  variant = "primary",
  size = "medium",
  disabled = false,
  ...props
}) => {
  const baseStyle =
    "flex justify-center items-center rounded-lg cursor-pointer transition";

  const sizeStyles: Record<NonNullable<CustomBtnProps["size"]>, string> = {
    large: "w-[520px] h-[50px] font-18m",
    medium: "w-[256px] h-[54px] font-16sb",
    small: "w-[84px] h-[32px] font-14m rounded-sm",
    tabletSmall: "w-[72px] h-[30px] font-14m rounded-sm",
    mobileMedium: "w-[144px] h-[54px] font-16m rounded-lg",
    mobileSmall: "w-[109px] h-[32px] font-12m rounded-sm",
  };

  const variantStyles: Record<
    NonNullable<CustomBtnProps["variant"]>,
    string
  > = {
    primary: "bg-[var(--primary)] text-white",
    primaryDisabled: "bg-[var(--color-gray2)] text-white",
    outline: "border border-[var(--color-gray3)] text-[var(--primary)]",
    outlineDisabled: "border border-[var(--color-gray3)] text-gray1",
  };

  const finalStyle = `${baseStyle} ${sizeStyles[size]} ${
    disabled
      ? variant === "outlineDisabled"
        ? variantStyles.outlineDisabled
        : variant === "primaryDisabled"
          ? variantStyles.primaryDisabled
          : variantStyles.primaryDisabled
      : variantStyles[variant]
  }`;

  return (
    <button className={finalStyle} disabled={disabled} {...props}>
      {children}
    </button>
  );
};
