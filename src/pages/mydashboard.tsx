import React, { useState } from "react";
import SideMenu from "@/components/sideMenu/SideMenu";
import HeaderDashboard from "@/components/gnb/HeaderDashboard";
import InvitedDashBoard from "@/components/table/invited/InvitedDashBoard";
import type { Dashboard } from "@/components/sideMenu/dashboard";
import DashboardAddButton from "@/components/button/DashboardAddButton";
import CardButton from "@/components/button/CardButton";
import { PaginationBtn } from "@/components/button/PaginationBtn";

export default function MyDashboardPage() {
  const teamId = "13";
  const [dashCards, setDashCards] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const handleAddDashboard = () => {
    const newTitle = `대시보드 ${dashCards.length}`;
    setDashCards((prev) => [...prev, newTitle]);
  };

  const totalPages = Math.ceil((dashCards.length + 1) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = [
    <DashboardAddButton key="add" onClick={handleAddDashboard} />,
    ...dashCards.map((title, index) => (
      <CardButton key={index}>{title}</CardButton>
    )),
  ].slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SideMenu teamId="13-4" />

      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderDashboard />

        <main className="flex-1 overflow-auto px-[80px] pt-[40px] pb-10 bg-[#f9f9f9] space-y-10">
          {/* 대시보드 카드 + 페이지네이션 */}
          <section className="flex flex-col items-start space-y-6">
            <div className="flex flex-wrap gap-x-[20px] gap-y-[16px] w-full max-w-[1100px]">
              {currentItems}
            </div>

            {totalPages > 1 && (
              <div className="justify-end flex items-center w-full max-w-[1035px]">
                <span className="text-sm text-gray-500">
                  {`${currentPage}페이지 중 ${totalPages}`}
                </span>
                <PaginationBtn
                  direction="left"
                  disabled={currentPage === 1}
                  onClick={handlePrevPage}
                />
                <PaginationBtn
                  direction="right"
                  disabled={currentPage === totalPages}
                  onClick={handleNextPage}
                />
              </div>
            )}
          </section>

          <div className="mt-[74px] flex justify-start">
            <InvitedDashBoard />
          </div>
        </main>
      </div>
    </div>
  );
}
