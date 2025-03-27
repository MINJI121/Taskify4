import React from "react";
import HeaderMyPage from "@/components/gdummy/HeaderMypage";
import SideMenu from "@/components/sdummy/SideMenu";
import ProfileCard from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";

export default function MyPage() {
  return (
    <div className="flex">
      <SideMenu dashboardList={[]} />
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
