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
import { TEAM_ID } from "@/constants/team";
import { toast } from "react-toastify";
import FormModal from "@/components/modal/FormModal";
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
  const [titleLength, setTitleLength] = useState<number>(0);

  const isMaxColumns = columns.length >= 10;
  const maxColumnTitleLength = 20;

  // 모달이 열릴 때마다 입력값 초기화
  const openModal = () => {
    setNewColumnTitle("");
    setIsAddColumnModalOpen(true);
  };
  // 칼럼 이름 유효성 검사용
  const isDuplicate = columns.some(
    (col) => col.title.toLowerCase() === newColumnTitle.trim().toLowerCase()
  );

  /* 칼럼 이름 글자수 제한 */
  const handleTitleCreate = async (value: string) => {
    if (value.length <= maxColumnTitleLength) {
      setNewColumnTitle(value);
      setTitleLength(value.length);
    }
  };

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

  // 칼럼/카드 데이터 패칭
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

  useEffect(() => {
    if (!isReady || !dashboardId || !isInitialized || !user) return;

    fetchDashboards();
    fetchColumnsAndCards();
  }, [isReady, dashboardId, isInitialized, user]);

  // 현재 대시보드 id 추출
  const currentDashboard = dashboardList.find(
    (db) => db.id === Number(dashboardId)
  );

  if (!isInitialized || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-[calc(var(--vh)_*_100)]">
      <SideMenu
        teamId={TEAM_ID}
        dashboardList={dashboardList}
        onCreateDashboard={() => fetchDashboards()}
      />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard variant="dashboard" dashboardId={dashboardId} />

        <main
          className="flex flex-1 flex-col lg:flex-row
          overflow-y-auto min-h-0
        bg-white px-6 py-6"
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
                createdByMe={currentDashboard?.createdByMe ?? false}
                columnDelete={fetchColumnsAndCards}
                fetchColumnsAndCards={fetchColumnsAndCards}
              />
            ))}
            {/* ColumnsButton: 모바일/태블릿에서는 하단 고정, 데스크탑에서는 원래 위치 */}
            <div className={`lg:py-10 pb-5 lg:px-2 bg-white`}>
              <ColumnsButton onClick={openModal} />
            </div>
          </div>

          {/* 칼럼 추가 모달 */}
          {isAddColumnModalOpen && (
            <FormModal
              title="새 칼럼 생성"
              inputLabel="이름"
              inputPlaceholder="새로운 프로젝트"
              inputValue={newColumnTitle}
              onInputChange={handleTitleCreate}
              isInputValid={
                newColumnTitle.trim().length > 0 &&
                !isDuplicate &&
                !isMaxColumns
              }
              charCount={{
                current: titleLength,
                max: maxColumnTitleLength,
              }}
              errorMessage={
                isDuplicate
                  ? "중복된 칼럼 이름입니다."
                  : isMaxColumns
                    ? "최대 10개의 칼럼까지만 생성할 수 있습니다."
                    : ""
              }
              submitText="생성"
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
              onClose={() => setIsAddColumnModalOpen(false)}
            />
          )}
        </main>
      </div>
    </div>
  );
}
