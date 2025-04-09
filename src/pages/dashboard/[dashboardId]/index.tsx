// src/pages/dashboard/[dashboardId]/index.tsx
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { getColumns, createColumn } from "@/api/columns";
import { getCardsByColumn } from "@/api/card";
import { getDashboards } from "@/api/dashboards";
import {
  CardType,
  ColumnType,
  DashboardType,
  TasksByColumn,
} from "@/types/task";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import Column from "@/components/columnCard/Column";
import SideMenu from "@/components/sideMenu/SideMenu";
import ColumnsButton from "@/components/button/ColumnsButton";
import AddColumnModal from "@/components/columnCard/AddColumnModal";
import { TEAM_ID } from "@/constants/team";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function Dashboard() {
  const router = useRouter();
  const { user, isInitialized } = useAuthGuard();
  const { dashboardId } = router.query;
  const [columns, setColumns] = useState<ColumnType[]>([]);
  const [tasksByColumn, setTasksByColumn] = useState<TasksByColumn>({});
  const [dashboardList, setDashboardList] = useState<DashboardType[]>([]);

  const [isReady, setIsReady] = useState(false);
  const [isAddColumnModalOpen, setIsAddColumnModalOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const openModal = () => setIsAddColumnModalOpen(true);
  // 칼럼 이름 유효성 검사용
  const isDuplicate = columns.some(
    (col) => col.title.toLowerCase() === newColumnTitle.trim().toLowerCase()
  );
  const pattern = isDuplicate ? "^$" : ".*\\S.*"; // 어떤 값이든 invalid처리. 공백이 있는 값은 invalid
  const invalidMessage = isDuplicate
    ? "중복된 칼럼 이름입니다."
    : "칼럼 이름을 입력해 주세요.";
  const isTitleEmpty = !newColumnTitle.trim();
  const isMaxColumns = columns.length >= 10;
  const isCreateDisabled = isTitleEmpty || isDuplicate || isMaxColumns;

  useEffect(() => {
    if (router.isReady && dashboardId && isInitialized && user) {
      setIsReady(true);
    }
  }, [router.isReady, dashboardId, isInitialized, user]);

  // 대시보드 목록 불러오기
  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({});
      setDashboardList(res.dashboards);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
    }
  };

  // 대시보드 및 칼럼/카드 데이터 패칭
  useEffect(() => {
    if (!isReady || !dashboardId || !isInitialized || !user) return;

    fetchDashboards();

    const fetchColumnsAndCards = async () => {
      try {
        const numericDashboardId = Number(dashboardId);

        // 칼럼 목록 조회
        const columnRes = await getColumns({
          dashboardId: numericDashboardId,
        });
        setColumns(columnRes.data);

        // 각 칼럼에 대한 카드 목록 조회
        const columnTasks: { [columnId: number]: CardType[] } = {};

        await Promise.all(
          columnRes.data.map(async (column: ColumnType) => {
            const cardRes = await getCardsByColumn({
              columnId: column.id,
            });
            columnTasks[column.id] = cardRes.cards;
          })
        );

        setTasksByColumn(columnTasks);
      } catch (err) {
        console.error("❌ 칼럼 또는 카드 로딩 에러:", err);
      }
    };

    fetchColumnsAndCards();
  }, [isReady, dashboardId, isInitialized, user]);

  if (!isReady || !isInitialized || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu
        teamId={TEAM_ID}
        dashboardList={dashboardList}
        onCreateDashboard={() => fetchDashboards()}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard variant="dashboard" dashboardId={dashboardId} />

        <main
          className="flex flex-1 flex-col min-h-0 lg:flex-row overflow-y-auto
        bg-white pl-6 py-6"
        >
          {/* 칼럼 가로 스크롤 영역 */}
          <div
            className="flex flex-col lg:flex-row
          lg:overflow-x-auto
          flex-1 min-h-0
          w-[260px] sm:w-[560px]"
          >
            {/* 각 칼럼 렌더링 */}
            {columns.map((col) => (
              <Column
                key={col.id}
                columnId={col.id}
                title={col.title}
                tasks={tasksByColumn[col.id] || []}
                dashboardId={Number(dashboardId)}
              />
            ))}
            {/* ColumnsButton: 모바일/태블릿에서는 하단 고정, 데스크탑에서는 원래 위치 */}
            <div className={`py-10 px-2 hidden lg:block bg-white`}>
              <ColumnsButton onClick={openModal} />
            </div>
          </div>

          {/* 칼럼 추가 모달 */}
          {isAddColumnModalOpen && (
            <AddColumnModal
              isOpen={isAddColumnModalOpen}
              onClose={() => setIsAddColumnModalOpen(false)}
              newColumnTitle={newColumnTitle}
              setNewColumnTitle={setNewColumnTitle}
              pattern={pattern}
              invalidMessage={invalidMessage}
              isCreateDisabled={isCreateDisabled}
              onSubmit={async () => {
                if (!newColumnTitle.trim()) {
                  toast.error("칼럼 이름을 입력해 주세요.");
                  return;
                }

                try {
                  const newColumn = await createColumn({
                    title: newColumnTitle,
                    dashboardId: Number(dashboardId),
                  });

                  setColumns((prev) => [...prev, newColumn]);
                  setNewColumnTitle("");
                  setIsAddColumnModalOpen(false);
                } catch (error) {
                  console.error("칼럼 생성 실패:", error);
                  toast.error("칼럼 생성에 실패했습니다.");
                }
              }}
            />
          )}
        </main>
        <div className="h-[100px] lg:hidden shrink-0" />
        {/* fixed 버튼 (모바일, 태블릿용) */}
        <div
          className={`z-10 fixed bottom-0 left-[33px] md:left-[80px] w-full p-3
            bg-white border-t border-gray-200 
            flex justify-center lg:hidden`}
        >
          <ColumnsButton onClick={openModal} />
        </div>
      </div>
    </div>
  );
}
