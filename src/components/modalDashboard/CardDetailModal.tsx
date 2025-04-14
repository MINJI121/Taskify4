import clsx from "clsx";
import { MoreVertical, X } from "lucide-react";
import CardDetail from "./CardDetail";
import CommentList from "./CommentList";
import CommentInput from "@/components/modalInput/CardInput";
import { Representative } from "@/components/modalDashboard/Representative";
import TaskModal from "@/components/modalInput/TaskModal";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { toast } from "react-toastify";
import { TEAM_ID } from "@/constants/team";
import { useDashboardPermission } from "@/hooks/useDashboardPermission";
import { useCardDetailState } from "@/hooks/useCardDetailState";
import { useCardDetail } from "@/hooks/useCardDetail";
import { getCardDetail } from "@/api/card";
import type { CardDetailType } from "@/types/cards";

interface CardDetailModalProps {
  card: CardDetailType;
  currentUserId: number;
  dashboardId: number;
  createdByMe: boolean;
  onClose: () => void;
  onChangeCard?: () => void;
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
  const { cardData, setCardData, columnName, columns, members } =
    useCardDetailState(card, dashboardId);

  const {
    commentText,
    setCommentText,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    showMenu,
    setShowMenu,
    popupRef,
    handleCommentSubmit,
    handleConfirmDelete,
  } = useCardDetail(card, dashboardId, onChangeCard, onClose);

  return (
    <>
      <div
        className={clsx(
          "fixed inset-0 z-50",
          "flex items-center justify-center px-4 sm:px-6",
          "bg-black/35"
        )}
      >
        <div
          className={clsx(
            "relative flex flex-col overflow-y-auto",
            "lg:w-[730px] sm:w-[678px] w-[327px]",
            "max-w-[730px] max-h-[calc(100vh-6rem)]",
            "bg-white rounded-lg shadow-lg"
          )}
        >
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
                  <button onClick={onClose} title="닫기">
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
          onSubmit={async () => {
            try {
              const updatedCard = await getCardDetail(cardData.id);
              setCardData(updatedCard);
              onChangeCard?.();
            } catch (error) {
              toast.error("카드 정보를 불러오는 데 실패했습니다.");
            } finally {
              setIsEditModalOpen(false);
            }
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
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
