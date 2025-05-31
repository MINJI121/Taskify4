import Image from "next/image";
import Input from "@/components/input/Input";

interface FormModalProps {
  title: string;
  inputLabel: string;
  inputValue: string;
  inputPlaceholder: string;
  isInputValid: boolean;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitText: string;
  leftButtonText?: string;
  onLeftButtonClick?: () => void;
  errorMessage?: string;
  charCount?: {
    current: number;
    max: number;
  };
}

export default function FormModal({
  title,
  inputLabel,
  inputValue,
  inputPlaceholder,
  isInputValid,
  onInputChange,
  onSubmit,
  onClose,
  submitText,
  leftButtonText = "취소",
  onLeftButtonClick,
  errorMessage,
  charCount,
}: FormModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[327px] sm:w-[568px] min-h-[280px]">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-black3">
            {title}
          </h2>
          <Image
            src="/svgs/close-white.svg"
            alt="닫기"
            width={25}
            height={25}
            className="cursor-pointer"
            onClick={onClose}
          ></Image>
        </div>

        <div className="relative w-full">
          <Input
            type="text"
            value={inputValue}
            onChange={onInputChange}
            label={inputLabel}
            labelClassName="font-medium text-black3 sm:text-[18px] text-[16px] mt-6"
            placeholder={inputPlaceholder}
            className="max-w-[620px] mb-1 pr-14
          text-black3 font-normal sm:text-[18px] text-[16px]
          placeholder:sm:text-[18px] placeholder:text-[16px]"
          />
          {charCount && (
            <span
              className="absolute right-3 top-2/5 translate-y-6.5 font-light
            text-[12px] sm:text-[14px] text-gray1 sm:pr-1.5"
            >
              {charCount.current} / {charCount.max}
            </span>
          )}
        </div>
        {errorMessage && (
          <p className="text-14-r block text-red mt-1">{errorMessage}</p>
        )}

        <div className="mt-8 gap-2 flex justify-between">
          <button
            onClick={onLeftButtonClick || onClose}
            className="cursor-pointer
            sm:w-[256px] sm:h-[54px] w-[144px] h-[54px] rounded-[8px]
            border border-gray3 text-gray1"
          >
            {leftButtonText}
          </button>
          <button
            onClick={onSubmit}
            disabled={!inputValue || !isInputValid}
            className={`sm:w-[256px] sm:h-[54px] w-[144px] h-[54px] rounded-[8px] 
                border border-gray3 text-white 
                ${!inputValue || !isInputValid ? "bg-gray-300" : "bg-primary cursor-pointer"}`}
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
