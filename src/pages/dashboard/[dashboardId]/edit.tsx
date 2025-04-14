import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ChangeBebridge from "@/components/modal/ChangeBebridge";
import HeaderDashboardEdit from "@/components/gnb/HeaderDashboard";
import MemberList from "@/components/table/member/MemberList";
import SideMenu from "@/components/sideMenu/SideMenu";
import InviteRecords from "@/components/table/InviteRecords";
import BackButton from "@/components/button/BackButton";
import { getDashboards } from "@/api/dashboards";
import DeleteDashboardModal from "@/components/modal/DeleteDashboardModal";
import { DashboardType } from "@/types/task";
import { TEAM_ID } from "@/constants/team";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function EditDashboard() {
  const router = useRouter();
  const { user, isInitialized } = useAuthGuard();
  const [dashboardList, setDashboardList] = useState<DashboardType[]>([]);
  const { dashboardId } = router.query;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dashboardIdString = Array.isArray(dashboardId)
    ? dashboardId[0]
    : dashboardId;

  /* 대시보드 삭제 모달 */
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /* SideMenu 값 불러오기 */
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

  if (!isInitialized || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex h-[calc(var(--vh)_*_100)] overflow-hidden">
      <SideMenu
        teamId={TEAM_ID}
        dashboardList={dashboardList}
        onCreateDashboard={() => fetchDashboards()}
      />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboardEdit variant="edit" dashboardId={dashboardId} />

        <div
          className="overflow-auto flex-1 pt-6 pb-10"
          style={{ backgroundColor: "#F5F2FC" }}
        >
          <div className="sm:px-8 lg:px-6 px-2.5">
            <BackButton />
          </div>
          {/* 백버튼 아래 전체 아이템 컨테이너 */}
          <div className="flex flex-col items-center lg:items-start px-6 mt-6 gap-6">
            <ChangeBebridge onUpdate={fetchDashboards} />
            {/* MemberList는 아래쪽에 배치 */}
            <MemberList dashboardId={dashboardId} />
            <InviteRecords dashboardId={dashboardIdString || ""} />{" "}
            {/* undefined일 경우 빈 문자열로 전달*/}
            <div className="flex">
              <button
                onClick={openModal}
                className="bg-white text-base sm:text-lg cursor-pointer w-[284px] h-[52px] sm:w-[320px] sm:h-[62px] text-black3 rounded-[8px] border border-[var(--color-gray4)] hover:scale-105 transition-transform duration-200"
              >
                대시보드 삭제하기
              </button>
            </div>
            {isModalOpen && (
              <DeleteDashboardModal
                isOpen={isModalOpen}
                onClose={closeModal}
                dashboardid={String(dashboardId)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
