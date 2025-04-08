import React, { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { getDashboards } from "@/api/dashboards";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import SideMenu from "@/components/sideMenu/SideMenu";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import CardButton from "@/components/button/CardButton";
import DashboardAddButton from "@/components/button/DashboardAddButton";
import { PaginationButton } from "@/components/button/PaginationButton";
import InvitedDashBoard from "@/components/table/invited/InvitedDashBoard";
import NewDashboard from "@/components/modal/NewDashboard";
import { DeleteModal } from "@/components/modal/DeleteModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { TEAM_ID } from "@/constants/team";
import { Search } from "lucide-react";
import { toast } from "react-toastify";

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
  const [selectedDashboardId, setSelectedDashboardId] = useState<number | null>(
    null
  );
  const [selectedCreatedByMe, setSelectedCreatedByMe] = useState<
    boolean | null
  >(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const itemsPerPage = 6;

  const filteredDashboardList = dashboardList.filter((dashboard) =>
    dashboard.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const totalPages = Math.ceil(
    (filteredDashboardList.length + 1) / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = [
    <DashboardAddButton key="add" onClick={() => setIsModalOpen(true)} />,
    ...filteredDashboardList.map((dashboard) => (
      <CardButton
        key={dashboard.id}
        dashboardId={dashboard.id}
        title={dashboard.title}
        showCrown={dashboard.createdByMe}
        color={dashboard.color}
        isEditMode={isEditMode}
        createdByMe={dashboard.createdByMe}
        onDeleteClick={(id) => {
          setSelectedDashboardId(id);
          setSelectedCreatedByMe(true);
          setSelectedTitle(dashboard.title);
          setIsDeleteModalOpen(true);
        }}
        onLeaveClick={(id) => {
          setSelectedDashboardId(id);
          setSelectedCreatedByMe(false);
          setSelectedTitle(dashboard.title);
          setIsDeleteModalOpen(true);
        }}
      />
    )),
  ].slice(startIndex, startIndex + itemsPerPage);

  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({});
      setDashboardList(res.dashboards);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    if (isInitialized && user) {
      fetchDashboards();
    }
  }, [isInitialized, user]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handleDelete = async () => {
    if (!selectedDashboardId) return;
    try {
      await axiosInstance.delete(
        apiRoutes.dashboardDetail(selectedDashboardId)
      );
      setIsDeleteModalOpen(false);
      setSelectedDashboardId(null);
      fetchDashboards();
    } catch (error) {
      toast.error("대시보드 삭제에 실패했습니다.");
      console.error("삭제 실패:", error);
    }
  };

  const handleLeave = () => {
    if (!selectedDashboardId) return;
    setIsDeleteModalOpen(false);
    setSelectedDashboardId(null);
  };

  if (!isInitialized || !user) {
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
        <HeaderDashboard
          variant="mydashboard"
          isEditMode={isEditMode}
          onToggleEditMode={() => setIsEditMode((prev) => !prev)}
        />

        <main className="flex-col overflow-auto px-[25px] py-5 sm:py-10 bg-[#F5F2FC]">
          {/* 검색 입력창 */}
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
                  className="w-full px-4 py-2 border border-[var(--color-gray3)] rounded-md outline-none bg-[var(--color-white)]"
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
            {/* 카드 영역 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[8px] md:gap-[10px] lg:gap-[13px]">
              {currentItems.map((item, index) => (
                <div key={index}>{item}</div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="w-full flex justify-end items-center mt-3">
                <span className="text-[12px] sm:text-[14px] text-black3 px-[8px] whitespace-nowrap">
                  {`${totalPages} 페이지 중 ${currentPage}`}
                </span>
                <PaginationButton
                  direction="left"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                />
                <PaginationButton
                  direction="right"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                />
              </div>
            )}
            {/* 초대받은 대시보드 */}
            <div className="mt-[25px]">
              <InvitedDashBoard />
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
          onCreate={() => fetchDashboards()}
        />
      )}

      <DeleteModal
        isDeleteModalOpen={isDeleteModalOpen}
        setIsDeleteModalOpen={setIsDeleteModalOpen}
        isConfirmDeleteModalOpen={isConfirmDeleteModalOpen}
        setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
        selectedTitle={selectedTitle}
        selectedCreatedByMe={selectedCreatedByMe}
        handleDelete={handleDelete}
        handleLeave={handleLeave}
      />
    </div>
  );
}
