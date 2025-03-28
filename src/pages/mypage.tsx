import React, { useState, useEffect } from "react";
import HeaderMyPage from "@/components/gnb/HeaderDashboard";
import SideMenu from "@/components/sideMenu/SideMenu";
import ProfileCard from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";
import { getDashboards } from "@/api/dashboards";

export default function MyPage() {
  const teamId = "13-4";
  const [dashboardList, setDashboardList] = useState<Dashboard[]>([]);

  interface Dashboard {
    id: number;
    title: string;
    color: string;
    userId: number;
    createdAt: string;
    updatedAt: string;
    createdByMe: boolean;
  }

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
    <div className="flex">
      <SideMenu teamId={"13-4"} dashboardList={[]} />
      <div className="flex flex-col w-full">
        <HeaderMyPage variant="mypage" />
        <div className="flex flex-col items-center w-full mt-10">
          <ProfileCard />
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
