import { ChangeEvent, useEffect, useRef, useState } from "react";
import TextButton from "./TextButton";

interface ModalTextareaProps {
  label: string;
  required?: boolean;
  isButton: boolean;
  small?: boolean;
  defaultValue?: string; // ✅ 추가됨
  onTextChange: (value: string) => void;
  onButtonClick?: () => void;
}

export default function ModalTextarea({
  label,
  required = false,
  isButton,
  small = false,
  defaultValue = "",
  onTextChange,
  onButtonClick,
}: ModalTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [text, setText] = useState(defaultValue);
  const maxLength = 256;

  const handleTextareaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    setText(event.target.value);
    onTextChange(event.target.value);

    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // ✅ 초기 defaultValue 기준으로 height 조절
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [defaultValue]);

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full">
      <label
        htmlFor="comment"
        className="font-medium text-black3 text-[16px] sm:text-[18px]"
      >
        {label} {required && <span className="text-[var(--primary)]"> *</span>}
      </label>

      <div
        className={`
          relative rounded-md border border-[var(--color-gray3)] bg-white focus-within:border-[var(--primary)] transition-all duration-200
          ${small ? "w-full max-w-[287px] h-[70px]" : "w-full max-w-[520px] min-h-[110px]"}
        `}
      >
        <textarea
          ref={textareaRef}
          name="comment"
          id="comment"
          placeholder={
            label === "설명" ? `${label}을 입력해 주세요` : `${label} 작성하기`
          }
          value={text}
          maxLength={256}
          onChange={handleTextareaChange}
          className={`
            w-full resize-none rounded-md border-none px-4 py-3
            text-black3 text-[16px] sm:text-[18px] font:normal
            outline-none bg-transparent overflow-hidden
            ${small ? "h-[50px]" : "min-h-[110px]"}
          `}
        />
        <div className="font-light text-[12px] sm:text-[14px] text-[var(--color-gray1)] text-left px-4 py-2">
          {text.length} / {maxLength}
        </div>
        {isButton && text.length > 0 && (
          <TextButton
            color="secondary"
            buttonSize={small ? "xxs" : "xs"}
            onClick={onButtonClick}
            className="absolute bottom-3 right-3 flex h-8 shrink-0 items-center justify-center font-14r text-[var(--primary)]"
          >
            입력
          </TextButton>
        )}
      </div>
    </div>
  );
}
