import ModalInput from "@/components/modalInput/ModalInput";
import ModalTextarea from "@/components/modalInput/ModalTextarea";
import ModalImage from "@/components/modalInput/ModalImage";
import TextButton from "@/components/modalInput/TextButton";
import StatusSelect from "@/components/modalInput/StatusSelect";
import AssigneeSelect from "@/components/modalInput/AssigneeSelect";
import { useTaskForm } from "@/hooks/useTaskForm";
import { useColumnStatus } from "@/hooks/useColumnStatus";

interface TaskModalProps {
  mode?: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
  initialData?: Partial<TaskData>;
  members: {
    id: number;
    userId: number;
    nickname: string;
  }[];
  columnId: number;
  dashboardId: number;
  cardId?: number;
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
  dashboardId,
  cardId,
}: TaskModalProps) {
  const updatedColumnId = useColumnStatus(
    dashboardId,
    columnId,
    initialData.status || ""
  );

  const { formData, handleChange, isFormValid, handleSubmit } = useTaskForm({
    mode,
    initialData,
    members,
    dashboardId,
    columnId,
    cardId,
    updatedColumnId,
    onClose,
    onSubmit,
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 z-50">
      <div className="sm:w-[584px] w-[327px] h-[calc(var(--vh)_*_90)] rounded-lg bg-white p-4 sm:p-8 shadow-lg flex flex-col gap-4 sm:gap-8 overflow-y-auto">
        <h2 className="font-bold text-black3 text-[16px] sm:text-[24px]">
          {mode === "edit" ? "할 일 수정" : "할 일 생성"}
        </h2>

        <div className="flex flex-col gap-4 sm:gap-8">
          <div className="flex flex-col sm:flex-row gap-4 text-black3 font-normal text-[14px] sm:text-[16px]">
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
              users={members.map((m) => ({ id: m.id, name: m.nickname }))}
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
            required={false}
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

        <div className="mt-auto flex sm:flex-row justify-between gap-2 sm:gap-3 w-full">
          <TextButton
            color="third"
            buttonSize="md"
            onClick={onClose}
            className="sm:w-[256px] w-[144px] h-[54px] border border-[var(--color-gray3)] bg-white text-[var(--color-gray1)] font-16m rounded-lg cursor-pointer"
          >
            취소
          </TextButton>

          <TextButton
            color="primary"
            buttonSize="md"
            onClick={handleSubmit}
            className="sm:w-[256px] w-[144px] h-[54px] bg-[var(--primary)] text-white font-16m rounded-lg cursor-pointer"
            disabled={!isFormValid}
          >
            {mode === "edit" ? "수정" : "생성"}
          </TextButton>
        </div>
      </div>
    </div>
  );
}
