// components/modal/AddColumnModal.tsx
import { Modal } from "@/components/modal/Modal";
import Input from "@/components/input/Input";
import { CustomBtn } from "@/components/button/CustomButton";

type AddColumnModalProps = {
  isOpen: boolean;
  onClose: () => void;
  newColumnTitle: string;
  setNewColumnTitle: (value: string) => void;
  onSubmit: () => void;
  isCreateDisabled: boolean;
  invalidMessage: string;
  pattern: string;
};

export default function AddColumnModal({
  isOpen,
  onClose,
  newColumnTitle,
  setNewColumnTitle,
  onSubmit,
  isCreateDisabled,
  invalidMessage,
  pattern,
}: AddColumnModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-bold">새 칼럼 생성</h2>

        <label className="font-medium flex flex-col gap-2">
          이름
          <Input
            type="text"
            placeholder="새로운 프로젝트"
            value={newColumnTitle}
            onChange={setNewColumnTitle}
            pattern={pattern}
            invalidMessage={invalidMessage}
          />
        </label>

        <div className="flex justify-between">
          <CustomBtn variant="outlineDisabled" onClick={onClose}>
            취소
          </CustomBtn>
          <CustomBtn
            variant={isCreateDisabled ? "primaryDisabled" : "primary"}
            disabled={isCreateDisabled}
            onClick={onSubmit}
          >
            생성
          </CustomBtn>
        </div>
      </div>
    </Modal>
  );
}
