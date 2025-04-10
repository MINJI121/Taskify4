import React, { useState } from "react";
import { createCard } from "@/api/card";
import AssigneeSelect from "@/components/modalInput/AssigneeSelect";
import ModalInput from "@/components/modalInput/ModalInput";
import ModalTextarea from "@/components/modalInput/ModalTextarea";
import ModalImage from "@/components/modalInput/ModalImage";
import TextButton from "@/components/modalInput/TextButton";
import { toast } from "react-toastify";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  updateCard: () => void;
  teamId: string;
  dashboardId: number;
  columnId: number;
  members: {
    id: number;
    userId: number;
    nickname: string;
  }[];
}
interface TaskData {
  assignee: string; // nickname
  title: string;
  description: string;
  deadline: string;
  tags: string[];
  image?: string;
}

export default function TaskModal({
  onClose,
  updateCard,
  dashboardId,
  columnId,
  members,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    assignee: "",
    title: "",
    description: "",
    deadline: "",
    tags: [],
    image: "",
  });

  const handleChange = (field: keyof TaskData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid =
    formData.assignee &&
    formData.title &&
    formData.description &&
    formData.deadline;

  const handleSubmit = async () => {
    try {
      const selectedAssignee = members.find(
        (m) => m.nickname === formData.assignee
      );
      const assigneeUserId = selectedAssignee?.userId;

      if (!assigneeUserId) {
        toast("담당자를 선택해 주세요.");
        return;
      }

      await createCard({
        assigneeUserId,
        dashboardId,
        columnId,
        title: formData.title,
        description: formData.description,
        dueDate: formData.deadline,
        tags: formData.tags,
        imageUrl: formData.image || undefined,
      });
      onClose();
      if (updateCard) updateCard();
      toast.success("카드가 생성되었습니다.");
    } catch (err) {
      console.error("카드 생성 실패:", err);
      toast.error("카드 생성에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 p-4 z-50">
      <div className="w-full max-w-[584px] h-auto max-h-[90vh] rounded-lg bg-white p-4 sm:p-8 shadow-lg flex flex-col gap-4 sm:gap-8 overflow-y-auto">
        <h2 className="text-xl font-bold">할 일 생성</h2>

        <div className="flex flex-col gap-4 sm:gap-8">
          <AssigneeSelect
            label="담당자"
            value={formData.assignee}
            required
            users={members.map((m) => m.nickname)}
            onChange={(value) => handleChange("assignee", value)}
          />

          <ModalInput
            label="제목"
            required
            onValueChange={(value) => handleChange("title", value[0])}
          />

          <ModalTextarea
            label="설명"
            required
            isButton={false}
            onTextChange={(value) => handleChange("description", value)}
          />

          <ModalInput
            label="마감일"
            required
            onValueChange={(value) => handleChange("deadline", value[0])}
          />

          <ModalInput
            label="태그"
            onValueChange={(value) => handleChange("tags", value)}
          />

          <ModalImage
            label="이미지"
            columnId={columnId}
            onImageSelect={(url) => handleChange("image", url)}
          />
        </div>

        <div className="mt-auto flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 w-full">
          <TextButton
            color="third"
            buttonSize="md"
            onClick={onClose}
            className="w-full sm:w-[256px] h-[54px] border border-[var(--color-gray3)] bg-white text-black rounded-lg"
          >
            취소
          </TextButton>

          <TextButton
            color="primary"
            buttonSize="md"
            onClick={handleSubmit}
            className="w-full sm:w-[256px] h-[54px] bg-[var(--primary)] text-white rounded-lg"
            disabled={!isFormValid}
          >
            생성
          </TextButton>
        </div>
      </div>
    </div>
  );
}
