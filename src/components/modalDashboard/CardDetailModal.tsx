import { useMemo, useRef, useState } from "react";
import { MoreVertical, X } from "lucide-react";
import CardDetail from "./CardDetail";
import CommentList from "./CommentList";
import CardInput from "@/components/modalInput/CardInput";
import { Representative } from "@/components/modalDashboard/Representative";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/api/comment";
import {
  deleteCard,
  EditCard,
  getDashboardMembers,
  EditCardPayload,
} from "@/api/card";
import type { CardDetailType } from "@/types/cards";
import TaskModal from "@/components/modalInput/TaskModal";
import { useClosePopup } from "@/hooks/useClosePopup";
import { getColumn } from "@/api/columns";
import { toast } from "react-toastify";

interface CardDetailModalProps {
  card: CardDetailType;
  currentUserId: number;
  dashboardId: number;
  onClose: () => void;
  onChangeCard?: () => void;
}

interface ColumnType {
  id: number;
  title: string;
  status: string;
}

export default function CardDetailPage({
  card,
  currentUserId,
  dashboardId,
  onClose,
  onChangeCard,
}: CardDetailModalProps) {
  const [cardData, setCardData] = useState<CardDetailType>(card);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const popupRef = useRef(null);
  useClosePopup(popupRef, () => setShowMenu(false));

  const { data: columns = [] } = useQuery<ColumnType[]>({
    queryKey: ["columns", dashboardId],
    queryFn: () => getColumn({ dashboardId, columnId: card.columnId }),
  });

  const { data: invitedMembers = [] } = useQuery({
    queryKey: ["dashboardMembers", dashboardId],
    queryFn: () => getDashboardMembers({ dashboardId }),
  });

  const columnName = useMemo(() => {
    return (
      columns.find((col) => String(col.id) === String(cardData.columnId))
        ?.title || "알 수 없음"
    );
  }, [columns, cardData.columnId]);

  const { mutate: createCommentMutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", card.id] });
    },
  });

  const { mutate: deleteCardMutate } = useMutation({
    mutationFn: () => deleteCard(card.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      if (onChangeCard) onChangeCard();
      onClose();
      toast.success("카드가 삭제되었습니다.");
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    createCommentMutate({
      content: commentText,
      cardId: card.id,
      columnId: card.columnId,
      dashboardId,
    });
  };

  const { mutateAsync: updateCardMutate } = useMutation({
    mutationFn: (data: EditCardPayload) => EditCard(cardData.id, data),
    onSuccess: (updatedCard) => {
      setCardData(updatedCard);
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/35 z-50 flex items-center justify-center px-4 sm:px-6">
        <div className="relative flex flex-col overflow-y-auto max-w-[730px] max-h-[calc(100vh-4rem)] lg:w-[730px] sm:w-[678px] w-[327px] bg-white rounded-lg shadow-lg">
          <div className="flex items-center justify-center px-6 pt-6 pb-2">
            <div className="flex flex-col lg:w-[674px] sm:w-[614px] w-[295px]">
              <div className="flex justify-between sm:mb-4 mb-2">
                <h2 className="text-black3 font-bold sm:text-[20px] text-[16px]">
                  {cardData.title}
                </h2>
                <div
                  className="relative flex items-center sm:gap-[24px] gap-[16px]"
                  ref={popupRef}
                >
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="sm:w-[28px] sm:h-[28px] w-[20px] h-[20px] flex items-center justify-center hover:cursor-pointer"
                    title="수정하기"
                    type="button"
                  >
                    <MoreVertical className="w-8 h-8 text-black3 cursor-pointer" />
                  </button>
                  {showMenu && (
                    <div className="absolute right-0 top-9.5 p-2 z-40 flex flex-col items-center justify-center sm:gap-[6px] gap-[11px] sm:w-28 w-20 sm:h-24 bg-white border border-[#D9D9D9] rounded-lg">
                      <button
                        className="w-full h-full rounded-sm font-normal sm:text-[14px] text-[12px] text-black3 hover:bg-[var(--color-violet8)] hover:text-[var(--primary)] cursor-pointer"
                        type="button"
                        onClick={() => {
                          setIsEditModalOpen(true);
                          setShowMenu(false);
                        }}
                      >
                        수정하기
                      </button>
                      <button
                        className="w-full h-full rounded-sm font-normal sm:text-[14px] text-[12px] text-black3 hover:bg-[var(--color-violet8)] hover:text-[var(--primary)] cursor-pointer"
                        type="button"
                        onClick={() => deleteCardMutate()}
                      >
                        삭제하기
                      </button>
                    </div>
                  )}
                  <button onClick={handleClose} title="닫기">
                    <X className="sm:w-[28px] sm:h-[28px] w-[20px] h-[20px] flex items-center justify-center hover:cursor-pointer" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4">
                <CardDetail card={cardData} columnName={columnName} />
                <div>
                  <Representative card={cardData} />
                </div>
              </div>

              <div className="mt-4 w-full lg:max-w-[445px] md:max-w-[420px]">
                <p className="mb-1 text-black3 font-medium sm:text-[16px] text-[14px]">
                  댓글
                </p>
                <CardInput
                  hasButton
                  value={commentText}
                  onTextChange={setCommentText}
                  onButtonClick={handleCommentSubmit}
                  placeholder="댓글 작성하기"
                />
              </div>

              <div className="w-full lg:max-w-[445px] md:max-w-[420px] sm:max-h-[140px] max-h-[70px] my-2 overflow-y-auto">
                <CommentList
                  cardId={card.id}
                  currentUserId={currentUserId}
                  teamId={""}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <TaskModal
          mode="edit"
          columnId={card.columnId}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={async (data) => {
            const matchedColumn = columns.find(
              (col) => col.title === data.status
            );

            const selectedAssignee = invitedMembers.find(
              (m: { nickname?: string; email?: string; userId: number }) =>
                (m.nickname || m.email) === data.assignee
            ) as {
              userId: number;
              nickname?: string;
              email?: string;
              profileImageUrl?: string;
            };

            try {
              await updateCardMutate({
                columnId: matchedColumn?.id,
                assigneeUserId: selectedAssignee.userId,
                title: data.title,
                description: data.description,
                dueDate: data.deadline,
                tags: data.tags,
                imageUrl: data.image || undefined,
              });

              setCardData((prev) => ({
                ...prev,
                assignee: {
                  ...prev.assignee,
                  id: selectedAssignee.userId,
                  nickname:
                    selectedAssignee.nickname || selectedAssignee.email || "",
                  profileImageUrl: selectedAssignee.profileImageUrl || "",
                },
              }));

              if (onChangeCard) onChangeCard();
              setIsEditModalOpen(false);
              toast.success("카드가 수정되었습니다.");
            } catch (err) {
              console.error("카드 수정 실패:", err);
              toast.error("카드 수정에 실패했습니다.");
            }
          }}
          initialData={{
            status: columnName,
            assignee: cardData.assignee.nickname,
            title: cardData.title,
            description: cardData.description,
            deadline: cardData.dueDate,
            tags: cardData.tags,
            image: cardData.imageUrl ?? "",
          }}
          members={invitedMembers.map(
            (m: { nickname?: string; email?: string }) => ({
              nickname: m.nickname || m.email,
            })
          )}
        />
      )}
    </>
  );
}
