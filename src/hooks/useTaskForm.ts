import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { createCard, editCard } from "@/api/card";
import { TaskData } from "@/components/modalInput/TaskModal";

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
  updatedColumnId: number;
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
}

export function useTaskForm({
  mode,
  initialData,
  members,
  dashboardId,
  cardId,
  updatedColumnId,
  onClose,
  onSubmit,
}: UseTaskFormProps) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<TaskData>({
    status: initialData.status || "",
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
          dueDate: formData.deadline.trim() ? formData.deadline : undefined,
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
          dueDate: formData.deadline.trim() ? formData.deadline : undefined,
          tags: formData.tags,
          imageUrl: formData.image || undefined,
        });
        queryClient.invalidateQueries({ queryKey: ["cards"] });
        toast.success("카드가 수정되었습니다.");
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
