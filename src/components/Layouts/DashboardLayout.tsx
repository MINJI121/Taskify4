import React from "react";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import SideMenu from "@/components/sideMenu/SideMenu";
import { DashboardType } from "@/types/dashboard";
import { TEAM_ID } from "@/constants/team";

interface DashboardLayoutProps {
  children: React.ReactNode;
  dashboardList: DashboardType[];
  dashboardId?: string | string[];
}

const DashboardLayout = ({
  children,
  dashboardList,
  dashboardId,
}: DashboardLayoutProps) => {
  return (
    <div className="flex h-[calc(var(--vh)_*_100)] overflow-hidden">
      <SideMenu teamId={TEAM_ID} dashboardList={dashboardList} />
      <div className="flex flex-col flex-1">
        <HeaderDashboard variant="dashboard" dashboardId={dashboardId} />
        <div className="overflow-auto flex-1 px-[50px] pt-[10px] pb-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
