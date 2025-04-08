import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Image from "next/image";

interface CardButtonProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  title?: string;
  showCrown?: boolean;
  color?: string;
  isEditMode?: boolean;
  dashboardId: number;
  createdByMe?: boolean;
  onDeleteClick?: (id: number) => void;
  onLeaveClick?: (id: number) => void;
}

const CardButton: React.FC<CardButtonProps> = ({
  className,
  title = "비브리지",
  showCrown = true,
  color = "#7ac555", // 기본 색상
  isEditMode = false,
  dashboardId,
  createdByMe,
  onDeleteClick,
  onLeaveClick,
  ...props
}) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 관리 상태에서 카드 클릭 이벤트 차단
    if (isEditMode) {
      e.preventDefault();
      return;
    }
    // 카드 클릭 시 해당 대시보드로 이동
    router.push(`/dashboard/${dashboardId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/${dashboardId}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (createdByMe) {
      // 실제 삭제 API 요청
      if (onDeleteClick) onDeleteClick(dashboardId);
    } else {
      // 나만 탈퇴
      if (onLeaveClick) onLeaveClick(dashboardId);
    }
  };

  return (
    <div
      {...props}
      onClick={handleCardClick}
      className={clsx(
        "flex justify-between items-center bg-white transition-all",
        "rounded-lg px-4 py-3 font-16sb",
        "border border-[var(--color-gray3)]",
        "min-w-0 w-full max-w-[260px] md:max-w-[247px] lg:max-w-[332px]",
        "h-[58px] md:h-[68px] lg:h-[70px]",
        "mt-[2px]", // 카드 세로 간격
        "text-lg md:text-2lg lg:text-2lg",
        isEditMode
          ? "cursor-default hover:border-gray-300"
          : "cursor-pointer hover:border-purple-500",
        className
      )}
    >
      {/* 왼쪽: 색상 도트 + 제목 + 왕관 */}
      <div className="flex items-center font-semibold gap-[10px] overflow-hidden">
        {/* 색상 원 */}
        <svg width="8" height="8" viewBox="0 0 8 8" fill={color}>
          <circle cx="4" cy="4" r="4" />
        </svg>

        {/* 제목 */}
        <span className="text-black3 text-[14px] sm:text-[16px] truncate max-w-[90px] sm:max-w-[100px] md:max-w-[120px] lg:max-w-[160px]">
          {title}
        </span>

        {/* 왕관 */}
        <div className="relative w-[15px] h-[12px] md:w-[17px] md:h-[14px]">
          {showCrown && (
            <Image
              src="/svgs/icon-crown.svg"
              alt="crown Icon"
              fill
              className="object-contain"
            />
          )}
        </div>
      </div>

      {/* 오른쪽: 화살표 아이콘 or 수정/삭제 버튼 */}
      {isEditMode ? (
        <div className="flex flex-col gap-2">
          {createdByMe && (
            <button
              onClick={handleEdit}
              className="font-12m text-gray1 border border-[var(--color-gray3)] px-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              수정
            </button>
          )}
          <button
            onClick={handleDelete}
            className="font-12m text-red-400 border border-red-400 px-2 rounded hover:bg-red-100 cursor-pointer"
          >
            삭제
          </button>
        </div>
      ) : (
        <Image
          src="/svgs/arrow-forward-black.svg"
          alt="arrow icon"
          width={16}
          height={16}
          className="ml-2"
        />
      )}
    </div>
  );
};

export default CardButton;
