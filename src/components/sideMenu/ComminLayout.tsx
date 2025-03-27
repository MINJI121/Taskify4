import { ReactNode } from "react";

import SideMenu from "@/components/sideMenu/SideMenu";

export default function CommonLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <SideMenu
        dashboardList={[
          {
            id: 1,
            title: "비브리지",
            color: "#7AC555",
            createdAt: "2024-01-26T05:42:12.264Z",
            updatedAt: "2024-01-26T05:42:12.264Z",
            createdByMe: true,
            userId: 10,
          },
          {
            id: 2,
            title: "코드잇",
            color: "#760DDE",
            createdAt: "2024-01-26T05:42:12.264Z",
            updatedAt: "2024-01-26T05:42:12.264Z",
            createdByMe: true,
            userId: 10,
          },
          {
            id: 3,
            title: "3분기 계획",
            color: "#FFA500",
            createdAt: "2024-01-26T05:42:12.264Z",
            updatedAt: "2024-01-26T05:42:12.264Z",
            createdByMe: false,
            userId: 11,
          },
        ]}
      />
      <div className="grow">
        <main>{children}</main>
      </div>
    </div>
  );
}
