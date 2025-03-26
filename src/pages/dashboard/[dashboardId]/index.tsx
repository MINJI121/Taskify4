import React, { useState } from "react";
import { useRouter } from "next/router";
import HeaderBebridge from "@/components/Gnb/HeaderBebridge";
import NewDashboard from "@/components/modal/NewDashboard";

export default function Dashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInviteModal = () => {
    setIsModalOpen(true);
  };
  const closeInviteModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <HeaderBebridge dashboardId={dashboardId} />
      <h1>대시보드 페이지</h1>
      <br />
      <h1>dashboardId : {dashboardId}</h1>
      <button
        onClick={openInviteModal}
        className="flex items-center justify-center w-[73px] h-[30px] md:w-[109px] md:h-[36px] lg:w-[116px] lg:h-[40px] rounded-[8px] border-[1px] border-[#D9D9D9] gap-[10px] cursor-pointer"
      >
        예시
      </button>
      {isModalOpen && <NewDashboard onClose={closeInviteModal} />}
    </div>
  );
}
