import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { MoreVertical, X } from "lucide-react";
import CardDetail from "./CardDetail";
import CommentList from "./CommentList";
import CommentInput from "@/components/modalInput/CardInput";
import { Representative } from "@/components/modalDashboard/Representative";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createComment } from "@/api/comment";
import { deleteCard, getDashboardMembers } from "@/api/card";
import type { CardDetailType } from "@/types/cards";
import TaskModal from "@/components/modalInput/TaskModal";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { useClosePopup } from "@/hooks/useClosePopup";
import { getColumn } from "@/api/columns";
import { toast } from "react-toastify";
import { TEAM_ID } from "@/constants/team";
import { useDashboardPermission } from "@/hooks/useDashboardPermission";

interface CardDetailModalProps {
  card: CardDetailType;
  currentUserId: number;
  dashboardId: number;
  createdByMe: boolean;
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
  createdByMe,
  onClose,
  onChangeCard,
}: CardDetailModalProps) {
  const { canEditCards } = useDashboardPermission(dashboardId, createdByMe);

  const [cardData, setCardData] = useState<CardDetailType>(card);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const popupRef = useRef(null);
  useClosePopup(popupRef, () => setShowMenu(false));

  const { data: columns = [] } = useQuery<ColumnType[]>({
    queryKey: ["columns", dashboardId],
    queryFn: () => getColumn({ dashboardId, columnId: cardData.columnId }),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["dashboardMembers", dashboardId],
    queryFn: () => getDashboardMembers({ dashboardId }),
  });

  const columnName = useMemo(() => {
    return (
      columns.find((col) => col.id === cardData.columnId)?.title || "알 수 없음"
    );
  }, [columns, cardData.columnId]);

  const { mutate: createCommentMutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", cardData.id] });
    },
  });

  const { mutate: deleteCardMutate } = useMutation({
    mutationFn: () => deleteCard(cardData.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      if (onChangeCard) onChangeCard();
      setIsDeleteModalOpen(true);
    },
  });

  const handleClose = () => {
    onClose();
  };

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    createCommentMutate({
      content: commentText,
      cardId: cardData.id,
      columnId: cardData.columnId,
      dashboardId,
    });
  };

  return (
    <>
      {/* 모달 고정 div */}
      <div
        className={clsx(
          "fixed inset-0 z-50",
          "flex items-center justify-center px-4 sm:px-6",
          "bg-black/35"
        )}
      >
        {/* 모달창 */}
        <div
          className={clsx(
            "relative flex flex-col overflow-y-auto",
            "lg:w-[730px] sm:w-[678px] w-[327px]",
            "max-w-[730px] max-h-[calc(100vh-6rem)]",
            "bg-white rounded-lg shadow-lg"
          )}
        >
          <div className="flex items-center justify-center px-6 pt-6 pb-2">
            {/* 내부 아이템 컨테이너 */}
            <div className="flex flex-col lg:w-[674px] sm:w-[614px] w-[295px]">
              {/* 헤더 컨테이너 */}
              <div className="flex justify-between sm:mb-4 mb-2">
                {/* 제목 */}
                <h2 className="text-black3 font-bold sm:text-[20px] text-[16px]">
                  {cardData.title}
                </h2>
                {/* 버튼 컨테이너 */}
                <div
                  className="relative flex items-center sm:gap-[24px] gap-[16px]"
                  ref={popupRef}
                >
                  {/* 메뉴 버튼 */}
                  <button
                    onClick={() => setShowMenu((prev) => !prev)}
                    className="sm:w-[28px] sm:h-[28px] w-[20px] h-[20px] flex items-center justify-center hover:cursor-pointer"
                    title="수정하기"
                    type="button"
                  >
                    <MoreVertical className="w-8 h-8 text-black3 cursor-pointer" />
                  </button>
                  {/* 수정/삭제 드롭다운 메뉴 */}
                  {showMenu && (
                    <div className="absolute right-0 top-9.5 p-2 z-40 flex flex-col items-center justify-center sm:gap-[6px] gap-[11px] sm:w-28 w-20 sm:h-24 bg-white border border-[#D9D9D9] rounded-lg">
                      <button
                        className="w-full h-full rounded-sm font-normal sm:text-[14px] text-[12px] text-black3 hover:bg-[var(--color-violet8)] hover:text-[var(--primary)] cursor-pointer"
                        type="button"
                        onClick={() => {
                          if (!canEditCards) {
                            toast.error("읽기 전용 대시보드입니다.");
                            return;
                          }
                          setIsEditModalOpen(true);
                          setShowMenu(false);
                        }}
                      >
                        수정하기
                      </button>
                      <button
                        className="w-full h-full rounded-sm font-normal sm:text-[14px] text-[12px] text-black3 hover:bg-[var(--color-violet8)] hover:text-[var(--primary)] cursor-pointer"
                        type="button"
                        onClick={() => {
                          if (!canEditCards) {
                            toast.error("읽기 전용 대시보드입니다.");
                            return;
                          }
                          setIsDeleteModalOpen(true);
                        }}
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

              {/* 카드 내용 */}
              <div className="flex flex-col-reverse sm:flex-row gap-4">
                <CardDetail card={cardData} columnName={columnName} />
                <div>
                  <Representative card={cardData} />
                </div>
              </div>

              {/* 댓글 */}
              <div className="mt-4 w-full lg:max-w-[445px] md:max-w-[420px]">
                <p className="mb-1 text-black3 font-medium sm:text-[16px] text-[14px]">
                  댓글
                </p>
                <CommentInput
                  hasButton
                  value={commentText}
                  onTextChange={setCommentText}
                  onButtonClick={handleCommentSubmit}
                  placeholder="댓글 작성하기"
                />
              </div>

              <div className="w-full lg:max-w-[445px] md:max-w-[420px] sm:max-h-[140px] max-h-[70px] my-2 overflow-y-auto">
                <CommentList
                  cardId={cardData.id}
                  currentUserId={currentUserId}
                  teamId={TEAM_ID}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <TaskModal
          isOpen={true}
          mode="edit"
          columnId={cardData.columnId}
          cardId={cardData.id}
          dashboardId={dashboardId}
          members={members}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={(updatedData) => {
            if (onChangeCard) onChangeCard();
            queryClient.invalidateQueries({ queryKey: ["cards"] });
            setCardData((prev) => ({
              ...prev,
              title: updatedData.title,
              description: updatedData.description,
              dueDate: updatedData.deadline ?? "",
              tags: updatedData.tags,
              imageUrl: updatedData.image ?? "",
              assignee: {
                ...prev.assignee,
                nickname: updatedData.assignee,
              },
              columnId:
                columns.find((col) => col.title === updatedData.status)?.id ??
                prev.columnId,
            }));
            setIsEditModalOpen(false);
          }}
          initialData={{
            status: columnName,
            assignee: cardData.assignee.nickname,
            title: cardData.title,
            description: cardData.description,
            deadline: cardData.dueDate ?? "",
            tags: cardData.tags,
            image: cardData.imageUrl ?? "",
          }}
        />
      )}
      <DeleteModal
        title="카드를"
        isOpen={isDeleteModalOpen}
        onCancel={() => setIsDeleteModalOpen(false)}
        onConfirm={() => {
          deleteCardMutate(undefined, {
            onSuccess: () => {
              queryClient.invalidateQueries({ queryKey: ["cards"] });
              if (onChangeCard) onChangeCard();
              setIsDeleteModalOpen(false);
              onClose();
              toast.success("카드가 삭제되었습니다.");
            },
            onError: () => {
              toast.error("카드 삭제에 실패했습니다.");
              setIsDeleteModalOpen(false);
            },
          });
        }}
      />
    </>
  );
}
