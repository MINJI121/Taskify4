import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Dashboard } from "@/components/SideMenu/dashboard";

interface Props {
  dashboardList: Dashboard[];
}

export default function SideMenu({ dashboardList }: Props) {
  const router = useRouter();
  const { boardid } = router.query;
  const boardId = parseInt(boardid as string);

  return (
    <aside
      className="h-screen overflow-y-auto border-r border-[var(--color-gray3)] px-3 py-5
                      lg:w-[300px] md:w-[160px] sm:w-[67px] transition-all duration-200 flex flex-col"
    >
      {/* 🔥 로고 섹션 - 반응형 정렬 */}
      <div className="mb-14 px-3 sm:mb-9 sm:px-0">
        <Link
          href={"/"}
          className="flex lg:justify-start md:justify-start sm:justify-center"
        >
          {/* ✅ 태블릿 & 데스크톱: 큰 로고 (768px 이상) */}
          <Image
            src="/svgs/logo_taskify.svg"
            alt="Taskify Large Logo"
            width={109}
            height={34}
            className="hidden md:block"
            priority
            unoptimized
          />
          {/* ✅ 모바일 & 초소형 화면: 작은 로고 (767px 이하) */}
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

      {/* 🔥 대시보드 리스트 타이틀 + 추가 버튼 */}
      <nav>
        <div className="mb-4 flex items-center justify-between px-3 md:px-2">
          {/* ✅ Dash Boards 텍스트 (768px 이상에서만 표시) */}
          <span className="hidden md:block font-12sb text-[var(--color-black)]">
            Dash Boards
          </span>
          <button className="ml-auto">
            <Image
              src="/svgs/icon-add-box.svg"
              width={20}
              height={20}
              alt="추가 아이콘"
              unoptimized
            />
          </button>
        </div>

        {/* 🔥 대시보드 목록 - 모바일에서 중앙 정렬 */}
        <ul className="flex flex-col lg:items-start md:items-start sm:items-center sm:w-full">
          {dashboardList.map((dashboard) => (
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
                {/* 컬러 아이콘 */}
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

                {/* 대시보드 제목 & 크라운 아이콘 */}
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
      </nav>
    </aside>
  );
}
