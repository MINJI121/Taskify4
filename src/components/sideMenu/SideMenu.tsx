import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { PaginationButton } from "@/components/button/PaginationButton";
import NewDashboard from "@/components/modal/NewDashboard";

interface Dashboard {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

interface SideMenuProps {
  teamId: string;
  dashboardList: Dashboard[];
  onCreateDashboard?: (dashboard: Dashboard) => void; // ✅ 부모 상태 갱신용 콜백
}

export default function SideMenu({
  dashboardList,
  onCreateDashboard,
}: SideMenuProps) {
  const router = useRouter();
  const { boardid } = router.query;
  const boardId = parseInt(boardid as string);

  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 18;
  const totalPages = Math.ceil(dashboardList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedDashboards = dashboardList.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <aside className="h-screen overflow-y-auto border-r border-[var(--color-gray3)] px-3 py-5 lg:w-[300px] md:w-[160px] sm:w-[67px] transition-all duration-200 flex flex-col">
      {/* 로고 */}
      <div className="mb-14 px-3 sm:mb-9 sm:px-0">
        <Link
          href={"/mydashboard"}
          className="flex lg:justify-start md:justify-start sm:justify-center"
        >
          <Image
            src="/svgs/logo_taskify.svg"
            alt="Taskify Large Logo"
            width={109}
            height={34}
            className="hidden md:block"
            priority
            unoptimized
          />
          <Image
            src="/svgs/logo.svg"
            alt="Taskify Small Logo"
            width={24}
            height={28}
            className="md:hidden"
            priority
            unoptimized
          />
        </Link>
      </div>

      {/* 메뉴 전체 */}
      <nav className="flex flex-col flex-1 justify-between">
        <div>
          {/* 대시보드 타이틀 */}
          <div className="mb-4 flex items-center justify-between px-3 md:px-2">
            <span className="hidden md:block font-12sb text-[var(--color-black)]">
              Dash Boards
            </span>
            <button className="ml-auto" onClick={() => setIsModalOpen(true)}>
              <Image
                src="/svgs/icon-add-box.svg"
                width={20}
                height={20}
                alt="추가 아이콘"
                unoptimized
              />
            </button>
          </div>

          {/* 대시보드 목록 */}
          <ul className="flex flex-col lg:items-start md:items-start sm:items-center sm:w-full">
            {paginatedDashboards.map((dashboard) => (
              <li
                key={dashboard.id}
                className={clsx(
                  "w-full flex justify-center sm:justify-center lg:justify-start md:justify-start p-3 font-18m text-[var(--color-black)] transition-colors duration-200",
                  dashboard.id === boardId &&
                    "bg-[var(--primary)] text-white rounded-lg"
                )}
              >
                <Link
                  href={`/dashboard/${dashboard.id}`}
                  className="flex items-center gap-3 sm:gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    fill={dashboard.color}
                    className="shrink-0"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  <div className="hidden md:flex items-center gap-2">
                    <span className="truncate font-18m md:text-base">
                      {dashboard.title}
                    </span>
                    {dashboard.createdByMe && (
                      <Image
                        src="/svgs/crown.svg"
                        width={18}
                        height={14}
                        alt="크라운 아이콘"
                        unoptimized
                        priority
                      />
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 페이지네이션 버튼 */}
        {dashboardList.length > itemsPerPage && (
          <div className="flex justify-start mt-4 px-3">
            <PaginationButton
              direction="left"
              disabled={currentPage === 1}
              onClick={handlePrev}
            />
            <PaginationButton
              direction="right"
              disabled={currentPage === totalPages}
              onClick={handleNext}
            />
          </div>
        )}
      </nav>

      {/* 대시보드 생성 모달 */}
      {isModalOpen && (
        <NewDashboard
          onClose={() => setIsModalOpen(false)}
          onCreate={(newDashboard) => {
            onCreateDashboard?.(newDashboard);
            setIsModalOpen(false);
          }}
        />
      )}
    </aside>
  );
}
