import { useState } from "react";
import ModalInput from "@/components/modalInput/ModalInput";
import ModalTextarea from "@/components/modalInput/ModalTextarea";
import ModalImage from "@/components/modalInput/ModalImage";
import TextButton from "@/components/modalInput/TextButton";
import StatusSelect from "@/components/modalInput/StatusSelect";
import AssigneeSelect from "@/components/modalInput/AssigneeSelect";

interface TaskModalProps {
  mode?: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
  initialData?: Partial<TaskData>;
  members: { nickname: string }[];
  columnId: number;
  // ✅ teamId, dashboardId 제거됨
}

export interface TaskData {
  status: string;
  assignee: string;
  title: string;
  description: string;
  deadline: string;
  tags: string[];
  image?: string;
}

export default function TaskModal({
  mode = "create",
  onClose,
  onSubmit,
  initialData = {},
  members,
  columnId,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    status: initialData.status || "",
    assignee: initialData.assignee || "",
    title: initialData.title || "",
    description: initialData.description || "",
    deadline: initialData.deadline || "",
    tags: initialData.tags || [],
    image: initialData.image || "",
  });

  const handleChange = (field: keyof TaskData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid =
    formData.assignee &&
    formData.status &&
    formData.title &&
    formData.description &&
    formData.deadline;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 z-50">
      <div className="w-full max-w-[584px] h-auto max-h-[90vh] rounded-lg bg-white p-4 sm:p-8 shadow-lg flex flex-col gap-4 sm:gap-8 overflow-y-auto">
        <h2 className="font-bold text-black3 text-[16px] sm:text-[24px]">
          {mode === "edit" ? "할 일 수정" : "할 일 생성"}
        </h2>

        <div
          className="flex flex-col gap-4 sm:gap-8
        text-black3 font-medium text-[14px] sm:text-[18px]"
        >
          {/* 상태 및 담당자 드롭다운 */}
          <div
            className="flex flex-col sm:flex-row gap-4
          text-black3 font-normal text-[14px] sm:text-[16px]"
          >
            <StatusSelect
              label="상태"
              value={formData.status}
              required
              onChange={(value) => handleChange("status", value)}
            />

            <AssigneeSelect
              label="담당자"
              value={formData.assignee}
              users={members.map((m) => m.nickname)}
              required
              onChange={(value) => handleChange("assignee", value)}
            />
          </div>

          <ModalInput
            label="제목"
            required
            defaultValue={formData.title}
            onValueChange={(value) => handleChange("title", value[0])}
          />

          <ModalTextarea
            label="설명"
            required
            isButton={false}
            defaultValue={formData.description}
            onTextChange={(value) => handleChange("description", value)}
          />

          <ModalInput
            label="마감일"
            required
            defaultValue={formData.deadline}
            onValueChange={(value) => handleChange("deadline", value[0])}
          />

          <ModalInput
            label="태그"
            defaultValueArray={formData.tags}
            onValueChange={(value) => handleChange("tags", value)}
          />

          <ModalImage
            label="이미지"
            columnId={columnId}
            defaultImageUrl={formData.image}
            onImageSelect={(url) => handleChange("image", url)}
          />
        </div>

        <div className="mt-auto flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 w-full">
          <TextButton
            color="third"
            buttonSize="md"
            onClick={onClose}
            className="w-full sm:w-[256px] h-[54px] border border-[var(--color-gray3)] bg-white
            text-[var(--color-gray1)] font-16m rounded-lg cursor-pointer"
          >
            취소
          </TextButton>

          <TextButton
            color="primary"
            buttonSize="md"
            onClick={() => onSubmit(formData)}
            className="w-full sm:w-[256px] h-[54px] bg-[var(--primary)] text-white font-16m rounded-lg cursor-pointer"
            disabled={!isFormValid}
          >
            {mode === "edit" ? "수정" : "생성"}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
