import React, { useEffect, useState } from "react";
import SideMenu from "@/components/sideMenu/SideMenu";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import InvitedDashBoard from "@/components/table/invited/InvitedDashBoard";
import CardButton from "@/components/button/CardButton";
import { PaginationButton } from "@/components/button/PaginationButton";
import NewDashboard from "@/components/modal/NewDashboard";
import DashboardAddButton from "@/components/button/DashboardAddButton";
import { getDashboards } from "@/api/dashboards";
import { useRouter } from "next/router";

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
  const teamId = "13-4";
  const router = useRouter();
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 6;

  const totalPages = Math.ceil((dashboardList.length + 1) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentItems = [
    <DashboardAddButton key="add" onClick={() => setIsModalOpen(true)} />,
    ...dashboardList.map((dashboard) => (
      <CardButton
        key={dashboard.id}
        title={dashboard.title}
        showCrown={dashboard.createdByMe}
        color={dashboard.color}
        onClick={() => router.push(`/dashboard/${dashboard.id}`)}
      />
    )),
  ].slice(startIndex, startIndex + itemsPerPage);

  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({ teamId });
      setDashboardList(res.dashboards);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, [teamId]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu teamId={teamId} dashboardList={dashboardList} />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard variant="mydashboard" />

        <main className="flex-1 overflow-auto px-[25px] pt-[40px] pb-10 bg-[#f9f9f9] space-y-10">
          {/* 대시보드 카드 + 페이지네이션 */}
          <section className="flex flex-col items-start space-y-6">
            <div className="flex flex-wrap gap-x-[20px] gap-y-[16px] w-full max-w-[1100px]">
              {currentItems}
            </div>

            {totalPages > 1 && (
              <div className="justify-end flex items-center w-full max-w-[1035px]">
                <span className="text-sm text-gray-500">
                  {`${currentPage}페이지 중 ${totalPages}`}
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
          </section>

          <div className="mt-[74px] flex justify-start">
            <InvitedDashBoard />
          </div>
        </main>
      </div>

      {/* 새로운 대시보드 모달 */}
      {isModalOpen && (
        <NewDashboard
          onClose={() => {
            setIsModalOpen(false);
            fetchDashboards(); // 생성 후 목록 새로고침
          }}
        />
      )}
    </div>
  );
}
