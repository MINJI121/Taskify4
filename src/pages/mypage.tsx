import React from "react";
import HeaderMyPage from "@/components/gnb/HeaderMypage";
import SideMenu from "@/components/sideMenu/SideMenu";
import ProfileCard from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";

export default function MyPage() {
  const teamId = "13-4";

  return (
    <div className="flex">
      <SideMenu teamId={teamId} dashboardList={dashboardList} />
      <div className="flex flex-col w-full">
        <HeaderMyPage />
        <div className="flex flex-col items-center w-full mt-10">
          <ProfileCard />
          <ChangePassword />
        </div>
      </div>
    </div>
  );
}
