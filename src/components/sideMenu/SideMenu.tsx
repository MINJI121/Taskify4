import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { PaginationButton } from "@/components/button/PaginationButton";
import NewDashboard from "@/components/modal/NewDashboard";
import DashboardItem from "@/components/sideMenu/DashboardItem";
import usePagination from "@/hooks/usePagination";

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
  onCreateDashboard?: (dashboard: Dashboard) => void;
}

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

export default function SideMenu({
  teamId,
  dashboardList,
  onCreateDashboard,
}: SideMenuProps) {
  const router = useRouter();
  const boardId = router.query.dashboardId?.toString();
  const isMobile = useMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentPage,
    totalPages,
    paginatedItems: paginatedDashboards,
    goToNextPage,
    goToPrevPage,
  } = usePagination(dashboardList, 15);

  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const renderLogo = () => (
    <Link href="/mydashboard" className="mb-2">
      {isCollapsed || isMobile ? (
        <Image
          src="/svgs/logo.svg"
          alt="작은 로고"
          width={24}
          height={28}
          priority
          unoptimized
        />
      ) : (
        <Image
          src="/svgs/logo_taskify.svg"
          alt="Taskify 로고"
          width={109}
          height={34}
          priority
          unoptimized
        />
      )}
    </Link>
  );

  const renderCollapseButton = () => (
    <div
      className={clsx(
        "hidden sm:flex",
        isCollapsed ? "justify-center" : "justify-end",
        "w-full"
      )}
    >
      <button
        onClick={toggleCollapse}
        className="w-6 h-6 hover:bg-gray-200 rounded flex items-center justify-center border-none"
      >
        {isCollapsed ? (
          <svg
            className="w-2.5 h-2.5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        ) : (
          <svg
            className="w-2.5 h-2.5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        )}
      </button>
    </div>
  );

  const renderAddButton = () => (
    <div
      className={clsx(
        "mb-4",
        isCollapsed
          ? "flex justify-center"
          : "flex items-center justify-between px-3 md:px-2"
      )}
    >
      {!isCollapsed && (
        <span className="hidden md:block text-12-sb text-gray1">
          Dash Boards
        </span>
      )}
      <button onClick={() => setIsModalOpen(true)} className="cursor-pointer">
        <Image
          src="/svgs/icon-add-box.svg"
          width={20}
          height={20}
          alt="추가 아이콘"
          unoptimized
        />
      </button>
    </div>
  );

  return (
    <aside
      className={clsx(
        "z-20 flex flex-col h-[calc(var(--vh)_*_100)] overflow-y-auto lg:overflow-y-hidden overflow-x-hidden transition-all duration-200",
        "bg-white border-r border-gray3 py-5",
        isCollapsed
          ? "w-[67px] items-center px-0"
          : "w-[67px] sm:w-[67px] md:w-[160px] lg:w-[300px] px-3"
      )}
    >
      <div
        className={clsx(
          "flex flex-col mb-8",
          isCollapsed ? "items-center px-0" : "items-center md:items-start px-1"
        )}
      >
        {renderLogo()}
        {renderCollapseButton()}
      </div>

      <nav className="flex flex-1 flex-col min-h-0 justify-between h-full">
        <div>
          {renderAddButton()}
          <ul
            className={clsx(
              "flex-1",
              isCollapsed
                ? "items-center"
                : "items-start md:items-start sm:items-center w-full"
            )}
          >
            {paginatedDashboards.map((dashboard) => (
              <DashboardItem
                key={dashboard.id}
                dashboard={dashboard}
                isCollapsed={isCollapsed}
                isActive={dashboard.id.toString() === boardId}
              />
            ))}
          </ul>
        </div>

        {!isCollapsed && dashboardList.length > 15 && (
          <div className="flex justify-start items-end mb-1 px-2">
            <PaginationButton
              direction="left"
              disabled={currentPage === 1}
              onClick={goToPrevPage}
            />
            <PaginationButton
              direction="right"
              disabled={currentPage === totalPages}
              onClick={goToNextPage}
            />
          </div>
        )}

        {isModalOpen && (
          <NewDashboard
            teamId={teamId}
            onClose={() => setIsModalOpen(false)}
            onCreate={(newDashboard) => {
              onCreateDashboard?.(newDashboard);
              setIsModalOpen(false);
            }}
          />
        )}
      </nav>
    </aside>
  );
}
