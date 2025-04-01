import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { CardType } from "@/types/task";
import TodoModal from "@/components/modalInput/ToDoModal";
import TodoButton from "@/components/button/TodoButton";
import ColumnManageModal from "@/components/columnCard/ColumnManageModal";
import ColumnDeleteModal from "@/components/columnCard/ColumnDeleteModal";
import { updateColumn, deleteColumn } from "@/api/columns";
import { getDashboardMembers } from "@/api/card";
import { MemberType } from "@/types/users";
import { TEAM_ID } from "@/constants/team";
import CardList from "./CardList";

export default function Column({
  columnId,
  title = "new Task",
  tasks = [],
  dashboardId,
}) {
  const [columnTitle, setColumnTitle] = useState(title);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [members, setMembers] = useState([]);
  const columnScrollRef = useRef(null);
  const [isBottom, setIsBottom] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const result = await getDashboardMembers({ dashboardId });
        const parsed = result.map((m) => ({
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

  // ✅ 바닥 감지
  const handleScroll = () => {
    const el = columnScrollRef.current;
    if (el) {
      const isAtBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 10;
      setIsBottom(isAtBottom);
    }
  };

  const handleEditColumn = async (newTitle) => {
    if (!newTitle.trim()) {
      alert("칼럼 이름을 입력해주세요.");
      return;
    }
    try {
      const updated = await updateColumn({ columnId, title: newTitle });
      setColumnTitle(updated.title);
      setIsColumnModalOpen(false);
      alert("칼럼 이름이 변경되었습니다.");
    } catch (error) {
      console.error("칼럼 이름 수정 실패:", error);
      alert("칼럼 이름 수정 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteColumn = async () => {
    try {
      await deleteColumn({ columnId });
      setIsDeleteModalOpen(false);
      alert("칼럼이 삭제되었습니다.");
    } catch (error) {
      console.error("칼럼 삭제 실패:", error);
      alert("칼럼 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col border-r border-gray-200 bg-gray-50 rounded-md p-4 h-auto sm:m-h-screen max-h-[401px] sm:max-h-none w-full lg:max-w-[354px]">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">
            <span className="text-[var(--primary)]">•</span> {columnTitle}
          </h2>
          <span className="w-5 h-5 text-sm bg-gray-200 text-gray-700 rounded-[4px] flex items-center justify-center">
            {tasks.length}
          </span>
        </div>
        <Image
          src="/svgs/settings.svg"
          alt="setting icon"
          width={24}
          height={24}
          priority
          className="cursor-pointer"
          onClick={() => setIsColumnModalOpen(true)}
        />
      </div>

      {/* 카드 영역 + 스크롤 감지 */}
      <div
        ref={columnScrollRef}
        onScroll={handleScroll}
        className="flex-1 pb-4 flex flex-col items-center gap-3 overflow-y-auto"
      >
        <div onClick={() => setIsTodoModalOpen(true)} className="mb-2">
          <TodoButton />
        </div>
        <CardList
          columnId={columnId}
          teamId={TEAM_ID}
          initialTasks={tasks}
          onCardClick={(card) => console.log("Card clicked:", card)}
          isBottom={isBottom} // ✅ 추가된 prop
        />
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
    </div>
  );
}
