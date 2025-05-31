import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import SideMenu from "@/components/sideMenu/SideMenu";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import DashboardAddButton from "@/components/button/DashboardAddButton";
import { PaginationButton } from "@/components/button/PaginationButton";
import InvitedDashBoard from "@/components/table/invited/InvitedDashBoard";
import NewDashboard from "@/components/modal/NewDashboard";
import { DeleteCheckModal } from "@/components/modal/DeleteCheckModal";
import { TEAM_ID } from "@/constants/team";
import { Search } from "lucide-react";
import { toast } from "react-toastify";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableCardButton from "@/components/button/SortableCardButton";
import { useDashboardDragHandler } from "@/lib/useDashboardDragHandler";
import { fetchOrderedDashboards } from "@/lib/dashboardUtils";

interface Dashboard {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

export default function MyDashboardPage() {
  const { user, isInitialized } = useAuthGuard();
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedDashboard, setSelectedDashboard] = useState<{
    id: number | null;
    title: string | null;
    createdByMe: boolean | null;
  }>({ id: null, title: null, createdByMe: null });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);

  const itemsPerPage = 6;
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );
  const handleDragEnd = useDashboardDragHandler(
    dashboardList,
    setDashboardList
  );

  const filteredDashboardList = useMemo(() => {
    return dashboardList.filter((dashboard) =>
      dashboard.title.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  }, [dashboardList, searchKeyword]);

  const totalPages = Math.ceil(
    filteredDashboardList.length / (itemsPerPage - 1)
  );
  const paginatedDashboards = filteredDashboardList.slice(
    (currentPage - 1) * (itemsPerPage - 1),
    currentPage * (itemsPerPage - 1)
  );

  const fetchDashboards = async () => {
    try {
      const ordered = await fetchOrderedDashboards(TEAM_ID);
      setDashboardList(ordered);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (isInitialized && user) fetchDashboards();
  }, [isInitialized, user]);

  const handleDelete = async () => {
    if (!selectedDashboard.id) return;
    try {
      await axiosInstance.delete(
        apiRoutes.dashboardDetail(selectedDashboard.id)
      );
      setIsDeleteModalOpen(false);
      setSelectedDashboard({ id: null, title: null, createdByMe: null });
      fetchDashboards();
    } catch (error) {
      toast.error("대시보드 삭제에 실패했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  const handleLeave = () => {
    setIsDeleteModalOpen(false);
    setSelectedDashboard({ id: null, title: null, createdByMe: null });
  };

  if (!isInitialized || !user) return <LoadingSpinner />;

  return (
    <div className="flex h-[calc(var(--vh)_*_100)] overflow-hidden bg-violet5">
      <SideMenu
        teamId={TEAM_ID}
        dashboardList={dashboardList}
        onCreateDashboard={fetchDashboards}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard
          variant="mydashboard"
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        />

        <main className="flex-col overflow-auto px-6 py-5 sm:py-10 bg-[#F5F2FC]">
          <section className="w-full overflow-hidden transition-all">
            <div className="min-w-0 w-full max-w-[260px] md:max-w-[247px] lg:max-w-[332px] mb-3">
              <div className="relative flex items-center justify-end">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => {
                    setSearchKeyword(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="대시보드 이름을 입력하세요"
                  className="w-full px-4 py-2 border border-gray3 rounded-md outline-none bg-white"
                />
                <Search
                  size={18}
                  color="#333236"
                  className="absolute right-4"
                />
              </div>
            </div>
          </section>

          <section className="w-full max-w-[260px] sm:max-w-[504px] lg:max-w-[1022px]">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={dashboardList.map((d) => d.id)}
                strategy={rectSortingStrategy}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[13px]">
                  <div key="add">
                    <DashboardAddButton onClick={() => setIsModalOpen(true)} />
                  </div>

                  {paginatedDashboards.map((dashboard) => (
                    <SortableCardButton
                      key={dashboard.id}
                      dashboard={dashboard}
                      isEditMode={isEditMode}
                      onDeleteClick={() => {
                        setSelectedDashboard({
                          id: dashboard.id,
                          title: dashboard.title,
                          createdByMe: true,
                        });
                        setIsDeleteModalOpen(true);
                      }}
                      onLeaveClick={() => {
                        setSelectedDashboard({
                          id: dashboard.id,
                          title: dashboard.title,
                          createdByMe: false,
                        });
                        setIsDeleteModalOpen(true);
                      }}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {totalPages > 1 && (
              <div className="w-full flex justify-end items-center mt-3">
                <span className="text-[12px] sm:text-[14px] text-black3 px-[8px] whitespace-nowrap">
                  {`${totalPages} 페이지 중 ${currentPage}`}
                </span>
                <PaginationButton
                  direction="left"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                />
                <PaginationButton
                  direction="right"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                />
              </div>
            )}

            <div className="mt-[25px]">
              <InvitedDashBoard agreeInvitation={fetchDashboards} />
            </div>
          </section>
        </main>
      </div>

      {isModalOpen && (
        <NewDashboard
          teamId={TEAM_ID}
          onClose={() => {
            setIsModalOpen(false);
            fetchDashboards();
          }}
          onCreate={fetchDashboards}
        />
      )}

      <DeleteCheckModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isConfirmDeleteModalOpen={isConfirmDeleteModalOpen}
        setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
        selectedTitle={selectedDashboard.title}
        selectedCreatedByMe={selectedDashboard.createdByMe}
        handleDelete={handleDelete}
        handleLeave={handleLeave}
      />
    </div>
  );
}
