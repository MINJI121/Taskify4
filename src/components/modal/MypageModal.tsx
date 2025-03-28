import { Modal } from "./Modal";
import { CustomBtn } from "../button/CustomButton";
import { ReactNode } from "react";

interface MypageModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  width?: string;
  height?: string;
  children?: ReactNode;
}

export default function MypageModal({
  isOpen,
  onClose,
  message,
  confirmLabel = "확인",
  onConfirm,
  width = "w-[357px]",
  height = "h-[192px]",
  children,
}: MypageModalProps) {
  return (
    <Modal width={width} height={height} isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-10 text-center">
        <p className="text-xl mt-1.5">{message}</p>
        {children}
        <div className="flex justify-between gap-3">
          <CustomBtn
            variant="outline"
            onClick={onConfirm || onClose}
            className="cursor-pointer w-full sm:w-[400px] h-[54px] bg-[#5A3FFF] text-white rounded-[8px] text-lg font-medium mt-3"
          >
            {confirmLabel}
          </CustomBtn>
        </div>
      </div>
    </Modal>
  );
}
