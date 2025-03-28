import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ChangeBebridge from "@/components/modal/ChangeBebridge";
import HeaderDashboardEdit from "@/components/gnb/HeaderDashboard";
import MemberList from "@/components/table/member/MemberList";
import SideMenu from "@/components/sideMenu/SideMenu";
import InviteRecords from "@/components/table/InviteRecords";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { getDashboards } from "@/api/dashboards";

interface Dashboard {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

export default function EditDashboard() {
  const teamId = "13-4";
  const router = useRouter();
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);
  const { dashboardId } = router.query;
  const dashboardIdString = Array.isArray(dashboardId)
    ? dashboardId[0]
    : dashboardId;

  /* 돌아가기 버튼 */
  const goToDashboard = () => {
    router.push(`/dashboard/${dashboardId}`);
  };

  /* 대시보드 삭제 */
  const handleDelete = async () => {
    const dashboardIdNumber = Number(dashboardId);
    if (!dashboardId) return;
    try {
      const response = await axiosInstance.delete(
        apiRoutes.DashboardDetail(dashboardIdNumber)
      );
      router.push(`/mydashboard`);
    } catch (error) {
      alert("대시보드 삭제에 실패하였습니다 .");
      console.error("초대 실패:", error);

      window.location.reload();
    }
  };

  /* SideMenu 값 불러오기 */
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

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu teamId={teamId} dashboardList={dashboardList} />

      <div className="flex flex-col flex-1">
        <div className="flex flex-col">
          <HeaderDashboardEdit variant="dashboard" dashboardId={dashboardId} />
        </div>
        <div className="overflow-auto flex-1 px-[50px] pt-[10px] pb-10">
          <div className="mt-6">
            <button
              onClick={goToDashboard}
              className="cursor-pointer flex items-center gap-2"
            >
              <Image
                src="/svgs/arrow-backward-black.svg"
                alt="돌아가기"
                width={20}
                height={20}
              />
              돌아가기
            </button>
          </div>

          <div className="mt-5">
            <ChangeBebridge />
          </div>

          {/* MemberList는 아래쪽에 배치 */}
          <div className="">
            <MemberList dashboardId={dashboardId} />
          </div>

          <div className="">
            <InviteRecords dashboardId={dashboardIdString || ""} />{" "}
            {/* undefined일 경우 빈 문자열로 전달*/}
          </div>
          <div className="flex mt-15 sm:mt-0 ml-8">
            <button
              onClick={handleDelete}
              className="text-base sm:text-lg cursor-pointer w-[320px] h-[62px] text-[var(--color-black3)] rounded-[8px] border-[1px] border-[#D9D9D9]"
            >
              대시보드 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
