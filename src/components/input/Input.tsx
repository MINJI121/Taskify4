import clsx from "clsx";
import { HTMLInputTypeAttribute, useId, useRef, useState } from "react";

type GeneralInputType = "text" | "number" | "hidden" | "search" | "tel" | "url";

interface GeneralInputProps {
  type: GeneralInputType;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
}

interface SignInputProps extends Omit<GeneralInputProps, "type"> {
  type: Extract<HTMLInputTypeAttribute, "text" | "email" | "password">;
  name: "email" | "nickname" | "password" | "passwordCheck";
  pattern: string;
  invalidMessage: string;
  labelClassName?: string; // 폰트 스타일 조절
  wrapperClassName?: string; // 전체 div의 스타일을 조절
}

type InputProps = GeneralInputProps | SignInputProps;

export default function Input(props: InputProps) {
  const {
    type,
    name,
    label,
    placeholder,
    onChange,
    pattern,
    invalidMessage,
    className,
    labelClassName,
    wrapperClassName,
    ...rest
  } = props as SignInputProps;

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [htmlType, setHtmlType] = useState(type);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(event.target.value);
    }
    event.target.setCustomValidity("");
    setIsInvalid(false);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (pattern) {
      const input = event.target as HTMLInputElement;
      if (!input.validity.valid) {
        input.setCustomValidity(invalidMessage || "올바른 값을 입력하세요.");
        setIsInvalid(true);
      } else {
        input.setCustomValidity("");
        setIsInvalid(false);
      }
    }
  };

  const togglePasswordTypeOnClick = () => {
    setHtmlType((prev: HTMLInputTypeAttribute) =>
      prev === "password" ? "text" : "password"
    );
  };

  return (
    <div className={clsx("flex flex-col items-start gap-2", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "text-[var(--color-black)]",
            labelClassName ? labelClassName : "font-18sb"
          )}
        >
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          ref={inputRef}
          id={id}
          name={name}
          type={htmlType}
          placeholder={placeholder}
          onChange={handleChange}
          onBlur={handleBlur}
          required
          pattern={pattern}
          onInvalid={(e) => {
            const input = e.target as HTMLInputElement;
            input.setCustomValidity(
              invalidMessage || "올바른 값을 입력하세요."
            );
            setIsInvalid(true);
          }}
          className={clsx(
            "peer flex h-[50px] w-full max-w-[520px] px-2 sm:px-4 py-2 rounded-lg transition-colors duration-200",
            "border border-[var(--color-gray3)] focus:border-[var(--primary)] focus:ring-0 focus:outline-none",
            isInvalid
              ? "border-[var(--color-red)] focus:border-[var(--color-red)]"
              : "",
            type === "password"
              ? "text-[var(--color-black4)]"
              : "text-[var(--color-black)]",
            className
          )}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordTypeOnClick}
            className="cursor-pointer absolute right-4 top-2.5 flex size-6 items-center justify-center"
          >
            <img
              src={
                htmlType === "password"
                  ? "/svgs/eye-off.svg"
                  : "/svgs/eye-on.svg"
              }
              alt="비밀번호 표시 토글"
              className="w-5 h-5"
            />
          </button>
        )}
        {isInvalid && invalidMessage && (
          <span className="mt-2 font-16m block text-[var(--color-red)]">
            {invalidMessage}
          </span>
        )}
      </div>
    </div>
  );
}
