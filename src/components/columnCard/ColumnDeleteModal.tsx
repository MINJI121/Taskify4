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
      width="w-[568px]"
      height="h-[174px]"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-10 text-center">
        <p className="text-xl mt-1.5">칼럼의 모든 카드가 삭제됩니다.</p>
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
