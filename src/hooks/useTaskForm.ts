import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { createCard, editCard } from "@/api/card";
import { TaskData } from "@/components/modalInput/TaskModal";
import { usePostGuard } from "@/hooks/usePostGuard";
import { ColumnType } from "@/types/task";

interface Member {
  id: number;
  userId: number;
  nickname: string;
}

interface UseTaskFormProps {
  mode: "create" | "edit";
  initialData: Partial<TaskData>;
  members: Member[];
  dashboardId: number;
  columnId: number;
  cardId?: number;
  columns: ColumnType[]; // ✅ 추가
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
}

export function useTaskForm({
  mode,
  initialData,
  members,
  dashboardId,
  columnId,
  cardId,
  columns,
  onClose,
  onSubmit,
}: UseTaskFormProps) {
  const queryClient = useQueryClient();
  const { guard: postGuard } = usePostGuard();

  const [formData, setFormData] = useState<TaskData>({
    status:
      initialData.status ||
      columns.find((col) => col.id === columnId)?.title ||
      "",
    assignee: initialData.assignee || "",
    title: initialData.title || "",
    description: initialData.description || "",
    deadline: initialData.deadline ?? "",
    tags: initialData.tags || [],
    image: initialData.image || "",
  });

  const handleChange = (field: keyof TaskData, value: string | string[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = useMemo(() => {
    return (
      formData.assignee &&
      formData.status &&
      formData.title.trim() &&
      formData.description.trim()
    );
  }, [formData]);

  const handleSubmit = async (updatedColumnId: number) => {
    try {
      const selectedAssignee = members.find(
        (m) => m.nickname === formData.assignee
      );
      const assigneeUserId = selectedAssignee?.userId;

      if (!assigneeUserId) {
        toast.error("담당자를 선택해 주세요.");
        return;
      }

      const matchedColumn = Array.isArray(columns)
        ? columns.find(
            (col) => col.title.toLowerCase() === formData.status?.toLowerCase()
          )
        : undefined;

      const updatedColumnId = matchedColumn?.id;

      if (!updatedColumnId) {
        toast.error("선택한 상태에 맞는 칼럼이 없습니다.");
        return;
      }

      if (mode === "create") {
        await postGuard(async () => {
          await createCard({
            assigneeUserId,
            dashboardId,
            columnId: updatedColumnId,
            title: formData.title,
            description: formData.description,
            dueDate: formData.deadline.trim() ? formData.deadline : undefined,
            tags: formData.tags,
            imageUrl: formData.image || undefined,
          });
          toast.success("카드가 생성되었습니다.");
        });
      } else {
        if (!cardId) {
          toast.error("카드 ID가 없습니다.");
          return;
        }

        await postGuard(async () => {
          await editCard(cardId, {
            assigneeUserId,
            columnId: updatedColumnId,
            title: formData.title,
            description: formData.description,
            dueDate: formData.deadline.trim() ? formData.deadline : undefined,
            tags: formData.tags,
            imageUrl: formData.image || undefined,
          });

          toast.success("카드가 수정되었습니다.");
        });
      }

      onSubmit(formData);
      onClose();
    } catch (err) {
      console.error("카드 처리 실패:", err);
      toast.error(`카드 ${mode === "edit" ? "수정" : "생성"}에 실패했습니다.`);
    }
  };

  return { formData, handleChange, isFormValid, handleSubmit };
}
