import React, { useState, useEffect } from "react";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import useUserStore from "@/store/useUserStore";
import HeaderMyPage from "@/components/gnb/HeaderDashboard";
import SideMenu from "@/components/sideMenu/SideMenu";
import { ProfileCard } from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";
import BackButton from "@/components/button/BackButton";
import { Dashboard, getDashboards } from "@/api/dashboards";
import { getUserInfo } from "@/api/users";
import { TEAM_ID } from "@/constants/team";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "react-toastify";

export default function MyPage() {
  const { user, isInitialized } = useAuthGuard();
  const { setUser } = useUserStore();
  const [dashboards, setDashboards] = useState<Dashboard[]>([]);
  const [userProfile, setUserProfile] = useState({
    nickname: "",
    profileImageUrl: "",
  });

  // 사이드메뉴 대시보드 목록 api 호출
  const fetchDashboards = async () => {
    try {
      const res = await getDashboards({});
      setDashboards(res.dashboards);
    } catch (error) {
      console.error("대시보드 불러오기 실패:", error);
      toast.error("대시보드를 불러오는 데 실패했습니다");
    }
  };

  // 프로필 변경 섹션 유저 정보 api 호출
  const fetchUserData = async () => {
    try {
      const res = await getUserInfo();
      setUser({
        id: res.id,
        email: res.email,
        nickname: res.nickname,
        profileImageUrl: res.profileImageUrl,
        createdAt: res.createdAt,
        updatedAt: res.updatedAt,
      });
    } catch (error) {
      console.error("유저 정보 불러오기 실패:", error);
      toast.error("유저 정보를 불러오는 데 실패했습니다.");
    }
  };

  useEffect(() => {
    if (isInitialized && user) {
      fetchDashboards();
      fetchUserData();
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
        <div className="flex flex-col justify-start overflow-auto w-full mt-6 pb-10">
          {/* 백버튼 여백 */}
          <div className="sm:px-8 lg:px-6 px-2.5">
            <BackButton />
          </div>
          {/* 백버튼 아래 전체 아이템 컨테이너 */}
          <div className="flex flex-col items-center lg:items-start px-6 mt-6 gap-6">
            <ProfileCard
              userProfile={userProfile}
              setUserProfile={setUserProfile}
            />
            <ChangePassword />
          </div>
        </div>
      </div>
    </div>
  );
}
