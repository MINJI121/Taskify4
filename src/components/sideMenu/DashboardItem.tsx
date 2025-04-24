import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface Dashboard {
  id: number;
  title: string;
  color: string;
  createdByMe: boolean;
}

interface Props {
  dashboard: Dashboard;
  isCollapsed: boolean;
  isActive: boolean;
}

export default function DashboardItem({
  dashboard,
  isCollapsed,
  isActive,
}: Props) {
  return (
    <li
      className={clsx(
        "flex w-full justify-center md:justify-start p-3 text-18-m text-gray1 transition-colors duration-200",
        isActive && "bg-violet8 text-black font-semibold rounded-xl"
      )}
    >
      <Link
        href={`/dashboard/${dashboard.id}`}
        className="flex items-center gap-3"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill={dashboard.color}
          className="shrink-0"
        >
          <circle cx="4" cy="4" r="4" />
        </svg>
        {!isCollapsed && (
          <div className="hidden md:flex min-w-0 items-center gap-1.5">
            <span className="truncate md:text-base max-w-[100px] lg:max-w-[200px]">
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
        )}
      </Link>
    </li>
  );
}
