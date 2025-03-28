import React from "react";
import HeaderMyPage from "@/components/gnb/HeaderDashboard";
import SideMenu from "@/components/sideMenu/SideMenu";
import ProfileCard from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";

export default function MyPage() {
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
