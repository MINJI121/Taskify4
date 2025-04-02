import { useMemo, useRef, useState } from "react";
import { MoreVertical, X } from "lucide-react";
import CardDetail from "./CardDetail";
import CommentList from "./CommentList";
import CardInput from "@/components/modalInput/CardInput";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/api/comment";
import { deleteCard, EditCard } from "@/api/card"; // EditCard API 추가
import type { CardDetailType } from "@/types/cards";
import TaskModal from "@/components/modalInput/TaskModal";
import { useClosePopup } from "@/hooks/useClosePopup";
import { getColumn } from "@/api/columns";

interface CardDetailModalProps {
  card: CardDetailType;
  currentUserId: number;
  dashboardId: number;
  onClose: () => void;
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
      onClose();
    },
  });

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
      setCardData(updatedCard); // ✅ 서버 응답을 최신 cardData로 설정
      queryClient.invalidateQueries({ queryKey: ["cards"] }); // 필요시
    },
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
        <div
          className="relative bg-white rounded-lg shadow-lg w-[730px] h-[763px] flex flex-col
        md:w-[678px] lg:w-[730px]"
        >
          {/* 오른쪽 상단 메뉴 */}
          <div className="absolute top-6 right-10 z-30 flex items-center gap-5 ">
            <div className="relative">
              <button
                onClick={() => setShowMenu((prev) => !prev)}
                className="hover:cursor-pointer"
                title="수정하기"
                type="button"
              >
                <MoreVertical className="w-8 h-8 text-gray-500 hover:text-black" />
              </button>
              {showMenu && (
                <div className="absolute right-0.5 p-2 w-27 bg-white border border-[#D9D9D9] z-40 rounded-lg">
                  <button
                    className="block w-full px-4 py-2 text-base text-gray-800 hover:bg-[#F1EFFD] hover:text-[#5534DA] rounded-sm"
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(true);
                      setShowMenu(false);
                    }}
                  >
                    수정하기
                  </button>
                  <button
                    className="block w-full px-4 py-2 text-base text-gray-800 hover:bg-[#F1EFFD] hover:text-[#5534DA] rounded-sm "
                    type="button"
                    onClick={() => deleteCardMutate()}
                  >
                    삭제하기
                  </button>
                </div>
              )}
            </div>
            <button onClick={onClose} title="메뉴 열기">
              <X className="w-8 h-8 text-gray-500 hover:cursor-pointer" />
            </button>
          </div>

          {/* 모달 내부 콘텐츠 */}
          <div className="p-6 flex gap-6 overflow-y-auto flex-1 w-[550px] h-[460px]">
            <CardDetail card={cardData} columnName={columnName} />
          </div>

          {/* 댓글 입력창 */}
          <div className="px-10 pt-2 pb-2">
            <p className="text-sm font-semibold mb-2">댓글</p>
            <div className="w-[480px] h-[110px]">
              <CardInput
                hasButton
                small
                value={commentText}
                onTextChange={setCommentText}
                onButtonClick={handleCommentSubmit}
                placeholder="댓글 작성하기"
              />
            </div>
          </div>

          {/* 댓글 목록 */}
          <div className="max-h-[400px] text-base overflow-y-auto scrollbar-hidden">
            <div className=" max-h-[50vh]">
              <CommentList
                cardId={card.id}
                currentUserId={currentUserId}
                teamId={""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TaskModal 수정 모드 */}
      {isEditModalOpen && (
        <TaskModal
          mode="edit"
          columnId={card.columnId} // ✅ 여기에 columnId 추가!
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={async (data) => {
            await updateCardMutate({
              status: String(cardData.columnId) || cardData.status,
              assignee: { ...cardData.assignee, nickname: data.assignee },
              title: data.title,
              description: data.description,
              dueDate: data.deadline,
              tags: data.tags,
              imageUrl: data.image ?? "",
            });
            setIsEditModalOpen(false); // 수정 후 모달 닫기
          }}
          initialData={{
            status: cardData.status,
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
