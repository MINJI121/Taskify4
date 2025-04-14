import { AssigneeType, CardType } from "@/types/task";
import Image from "next/image";
import { getTagColor } from "../modalInput/chips/ColorTagChip";
import RandomProfile from "@/components/common/RandomProfile";

type CardProps = CardType & {
  imageUrl?: string | null;
  assignee: AssigneeType;
  onClick?: () => void;
};

export default function Card({
  title = "new Task",
  dueDate,
  tags,
  assignee,
  imageUrl,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        flex flex-col md:flex-row lg:flex-col cursor-pointer
        items-start rounded-md bg-white border border-gray-200 p-4
        w-[284px] sm:w-full md:w-[544px] md:h-[93px] lg:w-[314px] lg:h-auto
      `}
    >
      {/* 이미지 영역 */}
      {imageUrl && (
        <div
          className={`
            mb-2 md:mb-0 md:mr-4 lg:mr-0
            shrink-0
            w-full lg:w-full
            lg:max-w-[100%] max-w-[77%]
            lg:h-40 md:h-[53px] h-25
            md:w-[90px]
            `}
        >
          <Image
            className="rounded-md object-cover w-full h-full"
            src={imageUrl}
            alt="Task Image"
            width={300}
            height={160}
          />
        </div>
      )}

      <div className="flex flex-col justify-between flex-1 w-full">
        {/* 제목 */}
        <h3
          className={`
            text-black3 text-[14px] font-medium mt-2
            md:text-[16px] md:mt-0 lg:mt-2
            truncate max-w-[190px] sm:max-w-[480px]
          `}
        >
          {title}
        </h3>

        {/* 태그 + 날짜 + 닉네임 */}
        <div
          className={`
            flex flex-col gap-2 mt-2 whitespace-nowrap
            sm:max-w-none max-w-[192px] 
            md:flex-row md:items-center md:justify-between md:mt-1
            lg:flex-col lg:items-start lg:mt-2
            text-sm md:text-xs
          `}
        >
          {/* 태그들 */}
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag, idx) => {
              const { textColor, bgColor } = getTagColor(idx);
              return (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium ${textColor} ${bgColor}`}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* 날짜 + 닉네임 */}
          <div className="flex items-center gap-[29.5px] md:gap-3 sm:pr-4 text-[var(--color-gray1)]">
            <div className="flex items-center gap-1">
              <Image
                src="/svgs/calendar.svg"
                alt="calendar"
                width={16}
                height={16}
              />
              <span>{dueDate}</span>
            </div>
            {assignee.profileImageUrl ? (
              <Image
                src={assignee.profileImageUrl}
                alt="프로필 이미지"
                width={22}
                height={22}
                className="sm:w-[24px] sm:h-[24px] rounded-full object-cover"
              />
            ) : (
              <div
                className="sm:w-[24px] sm:h-[24px] w-[22px] h-[22px] rounded-full
                overflow-hidden flex items-center justify-center"
              >
                <RandomProfile
                  userId={assignee.id}
                  name={assignee.nickname}
                  className="sm:w-[24px] sm:h-[24px] w-[22px] h-[22px]"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
