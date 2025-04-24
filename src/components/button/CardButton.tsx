import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Image from "next/image";

interface CardButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showCrown?: boolean;
  color?: string;
  isEditMode?: boolean;
  dashboardId: number;
  createdByMe?: boolean;
  onDeleteClick?: (id: number) => void;
  onLeaveClick?: (id: number) => void;
  attributes?: React.HTMLAttributes<HTMLDivElement>;
  listeners?: React.HTMLAttributes<HTMLDivElement>;
}

const CardButton: React.FC<CardButtonProps> = ({
  className,
  title = "비브리지",
  showCrown = true,
  color = "#7ac555",
  isEditMode = false,
  dashboardId,
  createdByMe,
  onDeleteClick,
  onLeaveClick,
  attributes,
  listeners,
  ...props
}) => {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isEditMode) {
      e.preventDefault();
      return;
    }
    router.push(`/dashboard/${dashboardId}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/dashboard/${dashboardId}/edit`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (createdByMe) {
      onDeleteClick?.(dashboardId);
    } else {
      onLeaveClick?.(dashboardId);
    }
  };

  return (
    <div
      {...attributes}
      {...listeners}
      {...props}
      onClick={handleCardClick}
      className={clsx(
        "flex justify-between items-center bg-white transition-all",
        "rounded-lg px-4 py-3 text-16-sb",
        "border border-gray3",
        "min-w-0 w-full max-w-[260px] md:max-w-[247px] lg:max-w-[332px]",
        "h-[58px] md:h-[68px] lg:h-[70px]",
        "mt-[2px]",
        "text-lg md:text-2lg lg:text-2lg",
        isEditMode
          ? "cursor-default hover:border-gray-300"
          : "cursor-pointer hover:border-purple-500",
        className
      )}
    >
      {/* 왼쪽: 색상 도트 + 제목 + 왕관 */}
      <div className="flex items-center overflow-hidden font-semibold gap-[10px]">
        <svg width="8" height="8" viewBox="0 0 8 8" fill={color}>
          <circle cx="4" cy="4" r="4" />
        </svg>
        <span
          className="flex-1 text-black3 text-[14px] sm:text-[16px]
        truncate min-w-0"
        >
          {title}
        </span>
        {showCrown && (
          <div className="relative w-[15px] h-[12px] md:w-[17px] md:h-[14px]">
            <Image
              src="/svgs/icon-crown.svg"
              alt="crown Icon"
              fill
              className="object-contain"
            />
          </div>
        )}
      </div>

      {/* 오른쪽: 수정/삭제 버튼 또는 아이콘 */}
      {isEditMode ? (
        <div className="flex flex-col gap-2 ml-3 flex-shrink-0 whitespace-nowrap">
          {createdByMe && (
            <button
              onClick={handleEdit}
              className="text-12-m text-gray1 border border-gray3 px-2 rounded hover:bg-gray-100 cursor-pointer"
            >
              수정
            </button>
          )}
          <button
            onClick={handleDelete}
            className="text-12-m text-red-400 border border-red-400 px-2 rounded hover:bg-red-100 cursor-pointer"
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
