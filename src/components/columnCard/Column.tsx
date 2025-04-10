// Column.tsx
import { useEffect, useState } from "react";
import Image from "next/image";
import { CardType } from "@/types/task";
import TodoModal from "@/components/modalInput/ToDoModal";
import { TodoButton, ShortTodoButton } from "@/components/button/TodoButton";
import ColumnManageModal from "@/components/columnCard/ColumnManageModal";
import ColumnDeleteModal from "@/components/columnCard/ColumnDeleteModal";
import { updateColumn, deleteColumn } from "@/api/columns";
import { getDashboardMembers, getCardDetail } from "@/api/card";
import { MemberType } from "@/types/users";
import { TEAM_ID } from "@/constants/team";
import { CardList } from "./CardList";
import CardDetailModal from "@/components/modalDashboard/CardDetailModal";
import { CardDetailType } from "@/types/cards";
import { toast } from "react-toastify";

type ColumnProps = {
  columnId: number;
  title?: string;
  tasks?: CardType[];
  dashboardId: number;
  columnDelete: (columnId: number) => void;
  fetchColumnsAndCards: () => void;
};

export default function Column({
  columnId,
  title = "new Task",
  tasks = [],
  dashboardId,
  columnDelete,
  fetchColumnsAndCards,
}: ColumnProps) {
  const [columnTitle, setColumnTitle] = useState(title);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [isCardDetailModalOpen, setIsCardDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<CardDetailType | null>(null);
  const [members, setMembers] = useState<
    { id: number; userId: number; nickname: string }[]
  >([]);

  // ✅ 멤버 불러오기
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await getDashboardMembers({ dashboardId });

        const parsed = result.map((m: MemberType) => ({
          id: m.id,
          userId: m.userId,
          nickname: m.nickname || m.email,
        }));

        setMembers(parsed);
      } catch (error) {
        console.error("멤버 불러오기 실패:", error);
      }
    };

    fetchMembers();
  }, [dashboardId]);

  const handleEditColumn = async (newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error("칼럼 제목을 입력해 주세요.");
      return;
    }

    try {
      const updated = await updateColumn({ columnId, title: newTitle });
      setColumnTitle(updated.title);
      setIsColumnModalOpen(false);
      toast.success("칼럼 제목이 변경되었습니다.");
    } catch (error) {
      console.error("칼럼 제목 수정 실패:", error);
      toast.error("칼럼 제목 변경에 실패했습니다.");
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn({ columnId });
      setIsDeleteModalOpen(false);
      if (columnDelete) columnDelete(columnId);
      toast.success("칼럼이 삭제되었습니다.");
    } catch (error) {
      console.error("칼럼 삭제 실패:", error);
      toast.error("칼럼 삭제에 실패했습니다.");
    }
  };

  const handleCardClick = async (cardId: number) => {
    try {
      const detail = await getCardDetail(cardId);
      setSelectedCard(detail);
      setIsCardDetailModalOpen(true);
    } catch (e) {
      console.error("카드 상세 불러오기 실패:", e);
    }
  };

  return (
    <div
      className={`
      flex flex-col shrink-0 overflow-hidden p-4 mr-4 lg:my-0 mb-4
      border border-[var(--color-gray4)] bg-[#F5F2FC] rounded-[12px]
      max-h-[325px] lg:max-h-none w-full lg:w-[360px]
      `}
    >
      {/* 칼럼 헤더 */}
      <div className="shrink-0 mb-2">
        <div className="flex items-center justify-between">
          {/* 왼쪽: 타이틀 + 카드 개수 */}
          <div className="flex items-center gap-2">
            <Image src="/svgs/ellipse.svg" alt="circle" width={8} height={8} />
            <h2 className="text-black3 text-[16px] md:text-[18px] font-bold">
              {columnTitle}
            </h2>
            <span
              className="flex items-center justify-center leading-none
            w-[20px] h-[20px] bg-white text-[var(--primary)] font-14m rounded-[4px]"
            >
              {tasks.length}
            </span>
          </div>
          {/* 오른쪽: 생성 버튼 + 설정 버튼 */}
          <div className="flex items-center gap-2">
            <div
              onClick={() => setIsTodoModalOpen(true)}
              className="block lg:hidden"
            >
              <ShortTodoButton />
            </div>
            <div className="relative flex justify-end w-[22px] sm:w-[24px] h-[22px] sm:h-[24px]">
              <Image
                src="/svgs/settings.svg"
                alt="setting icon"
                fill
                priority
                className="object-contain cursor-pointer"
                onClick={() => setIsColumnModalOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="flex-1 flex flex-col overflow-hidden items-center gap-2">
        <div
          onClick={() => setIsTodoModalOpen(true)}
          className="mb-2 hidden lg:block"
        >
          <TodoButton />
        </div>

        {/* 카드 리스트 */}
        <div
          className="flex-1 w-full overflow-y-auto overflow-x-hidden"
          style={{ scrollbarGutter: "stable" }}
        >
          <CardList
            columnId={columnId}
            teamId={TEAM_ID}
            initialTasks={tasks}
            onCardClick={(card) => handleCardClick(card.id)}
          />
        </div>
      </div>

      {/* Todo 모달 */}
      {isTodoModalOpen && (
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={() => setIsTodoModalOpen(false)}
          teamId={TEAM_ID}
          dashboardId={dashboardId}
          columnId={columnId}
          members={members}
          onChangeCard={fetchColumnsAndCards}
        />
      )}

      {/* 칼럼 관리 모달 */}
      <ColumnManageModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        onDeleteClick={() => {
          setIsColumnModalOpen(false);
          setIsDeleteModalOpen(true);
        }}
        columnTitle={columnTitle}
        onEditSubmit={handleEditColumn}
      />

      {/* 칼럼 삭제 확인 모달 */}
      <ColumnDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteColumn}
      />

      {/* 카드 상세 모달 */}
      {isCardDetailModalOpen && selectedCard && (
        <CardDetailModal
          card={selectedCard}
          currentUserId={selectedCard.assignee.id}
          dashboardId={dashboardId}
          onClose={() => {
            setIsCardDetailModalOpen(false);
            setSelectedCard(null);
          }}
          onChangeCard={fetchColumnsAndCards}
        />
      )}
    </div>
  );
}
