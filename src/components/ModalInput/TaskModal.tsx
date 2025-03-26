import { useState } from "react";
import ModalInput from "@/components/ModalInput/ModalInput";
import ModalTextarea from "@/components/ModalInput/ModalTextarea";
import ModalImage from "@/components/ModalInput/ModalImage";
import TextButton from "@/components/ModalInput/TextButton";
import StatusSelect from "@/components/ModalInput/StatusSelect";
import AssigneeSelect from "@/components/ModalInput/AssigneeSelect";

interface TaskModalProps {
  mode?: "create" | "edit";
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
  initialData?: Partial<TaskData>;
}

interface TaskData {
  status: string;
  assignee: string;
  title: string;
  description: string;
  deadline: string;
  tags: string[];
  image?: File;
}

export default function TaskModal({
  mode = "create",
  onClose,
  onSubmit,
  initialData = {},
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    status: initialData.status || "",
    assignee: initialData.assignee || "",
    title: initialData.title || "",
    description: initialData.description || "",
    deadline: initialData.deadline || "",
    tags: initialData.tags || [],
    image: initialData.image,
  });

  const handleChange = (
    field: keyof TaskData,
    value: string | string[] | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4 z-50">
      <div className="w-full max-w-[584px] h-auto max-h-[90vh] rounded-lg bg-white p-4 sm:p-8 shadow-lg flex flex-col gap-4 sm:gap-8 overflow-y-auto">
        <h2 className="text-xl font-bold">
          {mode === "edit" ? "할 일 수정" : "할 일 생성"}
        </h2>

        <div className="flex flex-col gap-4 sm:gap-8">
          {/* 상태 및 담당자 드롭다운 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <StatusSelect
              label="상태"
              value={formData.status}
              required
              onChange={(value) => handleChange("status", value)}
            />

            <AssigneeSelect
              label="담당자"
              value={formData.assignee}
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
            onImageSelect={(file) => handleChange("image", file)}
          />
        </div>

        <div className="mt-auto flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 w-full">
          <TextButton
            color="third"
            buttonSize="md"
            onClick={onClose}
            className="w-full sm:w-[256px] h-[54px] border border-gray bg-white text-black rounded-lg"
          >
            취소
          </TextButton>

          <TextButton
            color="primary"
            buttonSize="md"
            onClick={() => onSubmit(formData)}
            className="w-full sm:w-[256px] h-[54px] bg-[var(--primary)] text-white rounded-lg"
          >
            {mode === "edit" ? "수정" : "생성"}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
