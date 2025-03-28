// components/column/ColumnManageModal.tsx
import { useState } from "react";
import Input from "../input/Input";
import { Modal } from "../modal/Modal";
import { CustomBtn } from "../button/CustomButton";

type ColumnManageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onDeleteClick: () => void;
  columnTitle: string;
  onEditSubmit: (newTitle: string) => void;
};

export default function ColumnManageModal({
  isOpen,
  onClose,
  onDeleteClick,
  columnTitle,
  onEditSubmit,
}: ColumnManageModalProps) {
  const [newTitle, setNewTile] = useState(columnTitle);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-bold">칼럼 관리</h2>
        <label className="font-medium flex flex-col gap-2">
          이름
          <Input
            type="text"
            value={newTitle}
            onChange={(value) => setNewTile(value)}
          />
        </label>
        <div className="flex justify-between mt-1.5">
          <CustomBtn variant="outlineDisabled" onClick={onDeleteClick}>
            삭제
          </CustomBtn>
          <CustomBtn onClick={() => onEditSubmit(newTitle)}>변경</CustomBtn>
        </div>
      </div>
    </Modal>
  );
}
