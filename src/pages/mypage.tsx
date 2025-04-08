import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Image from "next/image";
import HeaderMyPage from "@/components/gnb/HeaderDashboard";
import SideMenu from "@/components/sideMenu/SideMenu";
import ProfileCard from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";
import { Dashboard, getDashboards } from "@/api/dashboards";
import { TEAM_ID } from "@/constants/team";
import LoadingSpinner from "@/components/common/LoadingSpinner";

export default function MyPage() {
  const { user, isInitialized } = useAuthGuard();
  const router = useRouter();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);

  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({});
      setDashboards(res.dashboards); // 👉 정상 저장
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
    <div className="flex h-screen overflow-hidden">
      <SideMenu
        teamId={TEAM_ID}
        dashboardList={dashboards}
        onCreateDashboard={() => fetchDashboards()}
      />
      <div className="flex flex-col flex-1 overflow-hidden bg-[#F5F2FC]">
        <HeaderMyPage variant="mypage" />
        <div className="flex flex-col justify-start overflow-auto w-full px-6 mt-6">
          {/*돌아가기 버튼*/}
          <div className="flex gap-[8px]">
            <Image
              onClick={() => router.back()}
              src="/svgs/arrow-backward-black.svg"
              alt="돌아가기"
              width={20}
              height={20}
              className="cursor-pointer"
            />
            <button
              onClick={() => router.back()}
              className="flex justify-start text-black3 cursor-pointer"
            >
              돌아가기
            </button>
          </div>

          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="mt-8">
              <ProfileCard />
            </div>
            <div className="mb-20">
              <ChangePassword />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
