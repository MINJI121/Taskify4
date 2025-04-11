import { useMemo, useRef, useState } from "react";
import { MoreVertical, X } from "lucide-react";
import CardDetail from "./CardDetail";
import CommentList from "./CommentList";
import CardInput from "@/components/modalInput/CardInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/api/comment";
import { deleteCard, EditCard } from "@/api/card";
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
    mutationFn: (data: Partial<CardDetailType>) => EditCard(cardData.id, data),
    onSuccess: (updatedCard) => {
      setCardData(updatedCard);
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-4 sm:px-6">
        <div
          className="
      relative bg-white rounded-lg shadow-lg flex flex-col
      w-[327px] h-[710px]
      md:w-[678px] md:h-[766px]
      lg:w-[730px] lg:h-[763px]
    "
        >
          <div className="flex justify-between items-center px-6 pt-6 pb-2">
            <h2 className="font-24sb">{cardData.title}</h2>
            <div className="flex items-center gap-3 relative" ref={popupRef}>
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="w-7 h-7 flex items-center justify-center hover:cursor-pointer"
                title="수정하기"
                type="button"
              >
                <MoreVertical className="w-8 h-8 text-black cursor-pointer" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-10 p-2 w-27 bg-white border border-[#D9D9D9] z-40 rounded-lg">
                  <button
                    className="block w-full px-4 py-2 text-base text-gray-800 hover:bg-[#F1EFFD] hover:text-[#5534DA] rounded-sm cursor-pointer"
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowMenu(false);
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-base text-gray-800 hover:bg-[#F1EFFD] hover:text-[#5534DA] rounded-sm cursor-pointer"
                    type="button"
                    onClick={() => deleteCardMutate()}
                  >
                    삭제하기
                  </button>
                </div>
              )}
              <button onClick={handleClose} title="닫기">
                <X className="w-7 h-7 flex items-center justify-center hover:cursor-pointer" />
              </button>
            </div>
          </div>

          {/* 콘텐츠 (스크롤 없음) */}
          <div className="px-6 pb-4 flex flex-col gap-6 flex-1 overflow-hidden">
            {/* 카드 상세 */}
            <CardDetail card={cardData} columnName={columnName} />

            {/* 댓글 입력 */}
            <div className="w-full max-w-[450px]">
              <p className="text-sm font-semibold mb-2">댓글</p>
              <CardInput
                hasButton
                small
                value={commentText}
                onTextChange={setCommentText}
                onButtonClick={handleCommentSubmit}
                placeholder="댓글 작성하기"
              />
            </div>

            {/* 댓글 리스트 (스크롤 가능) */}
            <div className="w-full max-w-[450px] text-base max-h-[180px] overflow-y-auto scrollbar-hidden">
              <CommentList
                cardId={card.id}
                currentUserId={currentUserId}
                teamId={""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 수정 모달 */}
      {isEditModalOpen && (
        <TaskModal
          mode="edit"
          columnId={card.columnId}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={async (data) => {
            const matchedColumn = columns.find(
              (col) => col.title === data.status
            );
            try {
              await updateCardMutate({
                columnId: matchedColumn?.id,
                assignee: { ...cardData.assignee, nickname: data.assignee },
                title: data.title,
                description: data.description,
                dueDate: data.deadline,
                tags: data.tags,
                imageUrl: data.image || undefined,
              });

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
          members={[{ nickname: cardData.assignee.nickname }]}
        />
      )}
    </>
  );
}
