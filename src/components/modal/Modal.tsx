"use client";

import { createPortal } from "react-dom";
import { CustomBtn } from "../button/CustomBtn";

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "outline"; // 버튼 스타일 지정 가능 (기본값: primary)
  className?: string; // 추가적인 버튼 스타일 적용 가능
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // 모달 상단 제목 (선택 사항)
  children: React.ReactNode;
  buttons?: ButtonProps[];
  className?: string;
  contentClassName?: string;
  buttonContainerClassName?: string;
  width?: string;
  height?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  buttons,
  className = "",
  contentClassName = "",
  buttonContainerClassName = "",
  width = "w-[568px]", // 기본 너비 설정, 필요 시 변경 가능
  height = "h-[266px]", // 기본 높이 설정, 필요 시 변경 가능
}: ModalProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/35 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg p-6 ${width} ${height} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 제목 (선택 사항) */}
        {title && <h2 className="text-xl font-semibold">{title}</h2>}

        {/* 모달 컨텐츠 영역 */}
        <div className={`${contentClassName} flex flex-col gap-4`}>
          {children}
        </div>

        {/* 버튼 영역 - 필요하면 원하는 개수만큼 버튼 추가 가능 */}
        {buttons && buttons.length > 0 && (
          <div className="mt-6 flex flex-col gap-3">
            <div
              className={`flex justify-center gap-4 ${buttonContainerClassName}`}
            >
              {buttons.map((button, index) => (
                <CustomBtn
                  key={index}
                  onClick={button.onClick}
                  variant={button.variant ?? "primary"} // 기본값: primary
                  className={`px-4 ${button.className || ""}`} // 버튼 크기 조정 가능
                >
                  {button.label}
                </CustomBtn>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
