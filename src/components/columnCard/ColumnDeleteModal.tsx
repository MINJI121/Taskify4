// components/column/ColumnDeleteModal.tsx
import { Modal } from "../modal/Modal";
import { CustomBtn } from "../button/CustomButton";

type ColumnDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
};

export default function ColumnDeleteModal({
  isOpen,
  onClose,
  onDelete,
}: ColumnDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="w-[327px] sm:w-[568px]"
      height="h-[160px] sm:h-[174px]"
    >
      <div className="flex flex-col sm:gap-10 gap-6 text-center">
        <p className="text-black3 font-medium sm:text-[20px] text-[18px] mt-1.5">
          칼럼의 모든 카드가 삭제됩니다.
        </p>
        <div className="flex justify-between gap-3">
          <CustomBtn variant="outlineDisabled" onClick={onClose}>
            취소
          </CustomBtn>
          <CustomBtn variant="primary" onClick={onDelete}>
            삭제
          </CustomBtn>
        </div>
      </div>
    </Modal>
  );
}
