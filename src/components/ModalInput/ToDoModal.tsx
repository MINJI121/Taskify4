import { useState } from "react";
import ModalInput from "@/components/ModalInput/ModalInput";
import ModalTextarea from "@/components/ModalInput/ModalTextarea";
import ModalImage from "@/components/ModalInput/ModalImage";
import TextButton from "@/components/ModalInput/TextButton";
import AssigneeSelect from "@/components/ModalInput/AssigneeSelect";

interface TaskModalProps {
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
}

interface TaskData {
  assignee: string;
  title: string;
  description: string;
  deadline: string;
  tags: string[];
  image?: File;
}

export default function TaskModal({ onClose, onSubmit }: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>({
    assignee: "",
    title: "",
    description: "",
    deadline: "",
    tags: [],
  });

  const handleChange = (
    field: keyof TaskData,
    value: string | string[] | File
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    console.log("Updated formData:", formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 p-4">
      {/* ✅ 반응형 모달: 모바일에서는 풀 너비, 데스크탑에서는 584px */}
      <div className="w-full max-w-[584px] h-auto max-h-[90vh] rounded-lg bg-white p-4 sm:p-8 shadow-lg flex flex-col gap-4 sm:gap-8 overflow-y-auto">
        <h2 className="text-xl font-bold">할 일 생성</h2>

        {/* ✅ 반응형 입력 필드 그룹 */}
        <div className="flex flex-col gap-4 sm:gap-8">
          <AssigneeSelect
            label="담당자"
            value={formData.assignee}
            required
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

          {/* ✅ 반응형 이미지 업로드 */}
          <ModalImage
            label="이미지"
            onImageSelect={(file) => handleChange("image", file)}
          />
        </div>

        {/* ✅ 버튼 그룹: 모바일에서는 세로 정렬, 데스크탑에서는 가로 정렬 */}
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
            생성
          </TextButton>
        </div>
      </div>
    </div>
  );
}
