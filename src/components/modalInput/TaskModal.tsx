import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createCard, editCard } from "@/api/card";
import { getColumn } from "@/api/columns";
import ModalInput from "@/components/modalInput/ModalInput";
import ModalTextarea from "@/components/modalInput/ModalTextarea";
import ModalImage from "@/components/modalInput/ModalImage";
import TextButton from "@/components/modalInput/TextButton";
import StatusSelect from "@/components/modalInput/StatusSelect";
import AssigneeSelect from "@/components/modalInput/AssigneeSelect";
import { toast } from "react-toastify";

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
  cardId?: number; // 수정 모드일 때만 사용
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

interface ColumnType {
  id: number;
  title: string;
  status: string;
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
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TaskData>({
    status: initialData.status || "",
    assignee: initialData.assignee || "",
    title: initialData.title || "",
    description: initialData.description || "",
    deadline: initialData.deadline || "",
    tags: initialData.tags || [],
    image: initialData.image || "",
  });

  const { data: columns = [] } = useQuery<ColumnType[]>({
    queryKey: ["columns", dashboardId],
    queryFn: () => getColumn({ dashboardId, columnId }),
  });

  const matchedColumn = useMemo(() => {
    if (!columns.length) return undefined;
    return columns.find((col) => col.title === formData.status);
  }, [columns, formData.status]);

  const updatedColumnId = matchedColumn?.id ?? columnId;

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

  const handleSubmit = async () => {
    try {
      const selectedAssignee = members.find(
        (m) => m.nickname === formData.assignee
      );
      const assigneeUserId = selectedAssignee?.userId;

      if (!assigneeUserId) {
        toast.error("담당자를 선택해 주세요.");
        return;
      }

      if (mode === "create") {
        await createCard({
          assigneeUserId,
          dashboardId,
          columnId: updatedColumnId,
          title: formData.title,
          description: formData.description,
          dueDate: formData.deadline,
          tags: formData.tags,
          imageUrl: formData.image || undefined,
        });
        toast.success("카드가 생성되었습니다.");
      } else {
        if (!cardId) {
          toast.error("카드 ID가 없습니다.");
          return;
        }

        await editCard(cardId, {
          assigneeUserId,
          columnId: updatedColumnId,
          title: formData.title,
          description: formData.description,
          dueDate: formData.deadline,
          tags: formData.tags,
          imageUrl: formData.image || undefined,
        });
        queryClient.invalidateQueries({ queryKey: ["cards"] });
        toast.success("카드가 수정되었습니다.");
      }

      onSubmit?.(formData);
      onClose();
    } catch (err) {
      console.error("카드 처리 실패:", err);
      toast.error(`카드 ${mode === "edit" ? "수정" : "생성"}에 실패했습니다.`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 z-50">
      <div className="sm:w-[584px] w-[327px] h-auto max-h-[90vh] rounded-lg bg-white p-4 sm:p-8 shadow-lg flex flex-col gap-4 sm:gap-8 overflow-y-auto">
        <h2 className="font-bold text-black3 text-[16px] sm:text-[24px]">
          {mode === "edit" ? "할 일 수정" : "할 일 생성"}
        </h2>

        <div className="flex flex-col gap-4 sm:gap-8">
          {/* 상태 및 담당자 */}
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

        <div className="mt-auto flex sm:flex-row justify-between gap-2 sm:gap-3 w-full">
          <TextButton
            color="third"
            buttonSize="md"
            onClick={onClose}
            className="sm:w-[256px] w-[144px] h-[54px] border border-[var(--color-gray3)] bg-white
            text-[var(--color-gray1)] font-16m rounded-lg cursor-pointer"
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
