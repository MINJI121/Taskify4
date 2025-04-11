import { ChangeEvent, useRef } from "react";
import TextButton from "./TextButton";
import clsx from "clsx";

export interface CardInputProps {
  value: string;
  placeholder?: string;
  hasButton?: boolean;
  className?: string;
  small?: boolean;
  onTextChange: (value: string) => void;
  onButtonClick: () => void;
}

export default function CardInput({
  value,
  onTextChange,
  placeholder = "",
  hasButton = false,
  onButtonClick = () => {},
  className = "",
  small = false,
}: CardInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={clsx(
          "sm:p-4 p-2 w-full resize-none",
          "sm:h-[110px] h-[55px]",
          "bg-white rounded-md border border-[var(--color-gray3)]",
          "text-black3 font-normal sm:text-[14px] text-[12px]",
          "focus:border-[var(--primary)] outline-none",
          className
        )}
        style={{
          overflowY: "auto", // 내용이 넘치면 스크롤 생성
          wordWrap: "break-word",
          whiteSpace: "pre-wrap",
          boxSizing: "border-box", // padding과 border를 높이에 포함
        }}
      />
      {hasButton && (
        <div className="flex justify-end mt-[2px]">
          <TextButton
            disabled={value.trim().length === 0}
            color="secondary"
            buttonSize="xs"
            onClick={onButtonClick}
            className="bottom-4 right-2.5 z-10 flex items-center justify-center
          lg:w-[83px]
          md:w-[77px] md:h-[32px]
          w-[84px] h-[28px] rounded-sm
          border-[var(--color-gray3)] hover:bg-gray-100
          text-[var(--primary)] font-12m
          cursor-pointer whitespace-nowrap"
          >
            입력
          </TextButton>
        </div>
      )}
    </div>
  );
}
