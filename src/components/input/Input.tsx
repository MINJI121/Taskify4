import clsx from "clsx";
import { HTMLInputTypeAttribute, useId, useRef, useState } from "react";

type GeneralInputType = "text" | "number" | "hidden" | "search" | "tel" | "url";

interface GeneralInputProps {
  type: GeneralInputType;
  label?: string;
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value?: string;
  readOnly?: boolean; //입력방지 추가
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  forceInvalid?: boolean;
}

interface SignInputProps extends Omit<GeneralInputProps, "type"> {
  type: Extract<HTMLInputTypeAttribute, "text" | "email" | "password">;
  name: "email" | "nickname" | "password" | "passwordCheck";
  pattern?: string;
  invalidMessage?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  forceInvalid?: boolean;
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
    forceInvalid,
    ...rest
  } = props as SignInputProps;

  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [htmlType, setHtmlType] = useState<HTMLInputTypeAttribute>(type);
  const [isInvalid, setIsInvalid] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (onChange) {
      onChange(value);
    }

    event.target.setCustomValidity("");

    if (pattern) {
      const regex = new RegExp(pattern);
      setIsInvalid(!regex.test(value));
    } else {
      setIsInvalid(false);
    }
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
    setHtmlType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className={clsx("flex flex-col items-start gap-1", wrapperClassName)}>
      {label && (
        <label
          htmlFor={id}
          className={clsx(
            "text-black3",
            labelClassName ? labelClassName : "text-16-r"
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
          onKeyDown={rest.onKeyDown}
          className={clsx(
            "peer flex h-[50px] w-full max-w-[520px] px-2 sm:px-4 py-2 rounded-lg transition-colors duration-200",
            "border border-gray3 focus:border-primary focus:ring-0 focus:outline-none",
            isInvalid || forceInvalid ? "border-red focus:border-red" : "",
            type === "password" ? "text-black4" : "text-black",
            className
          )}
          {...rest}
        />
        {type === "password" && (
          <button
            type="button"
            onClick={togglePasswordTypeOnClick}
            className="absolute right-4 inset-y-0 my-auto flex size-6 items-center justify-center"
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
      </div>

      {(isInvalid || forceInvalid) && invalidMessage && (
        <span className="text-14-r block text-red mt-1">{invalidMessage}</span>
      )}
    </div>
  );
}
