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
    large: "w-[520px] h-[50px] text-18-m",
    medium: "w-[256px] h-[54px] text-16-sb",
    small: "w-[84px] h-[32px] text-14-m rounded-sm",
    tabletSmall: "w-[72px] h-[30px] text-14-m rounded-sm",
    mobileMedium: "w-[144px] h-[54px] text-16-m rounded-lg",
    mobileSmall: "w-[109px] h-[32px] text-12-m rounded-sm",
  };

  const variantStyles: Record<
    NonNullable<CustomBtnProps["variant"]>,
    string
  > = {
    primary: "bg-primary text-white",
    primaryDisabled: "bg-gray2 text-white",
    outline: "border border-gray3 text-primary",
    outlineDisabled: "border border-gray3 text-gray1",
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
