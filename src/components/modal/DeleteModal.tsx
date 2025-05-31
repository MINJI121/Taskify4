import React from "react";
import { Modal } from "@/components/modal/Modal";
import { CustomBtn } from "../button/CustomButton";

interface DeleteModalProps {
  isOpen: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  title = "이 항목",
  description,
  onConfirm,
  onCancel,
}) => {
  return (
    <>
      <Modal
        width="sm:w-[320px] w-[260px]"
        height="sm:h-[190px] h-[160px]"
        isOpen={isOpen}
        onClose={onCancel}
        className="flex items-center justify-center text-center"
      >
        <div className="flex flex-col items-center gap-2 text-center sm:min-h-[40px] min-h-[30px]">
          <span className="text-black3 font-medium sm:text-[18px] text-[16px]">
            {title} 삭제하시겠습니까?
          </span>
          {description && (
            <span className="text-black3 font-medium text-[16px]">
              {description}
            </span>
          )}
        </div>
        <div className="flex items-center justify-center gap-2">
          <CustomBtn
            onClick={onCancel}
            className="cursor-pointer border px-3 py-1 rounded-md
            sm:w-[100px] sm:h-[40px] w-[84px] h-[32px]
            text-primary border-gray3"
          >
            취소
          </CustomBtn>
          <CustomBtn
            onClick={onConfirm}
            className="cursor-pointer bg-primary px-3 py-1 rounded-md
            sm:w-[100px] sm:h-[40px] w-[84px] h-[32px]
            text-white"
          >
            확인
          </CustomBtn>
        </div>
      </Modal>
    </>
  );
};
