import { AssigneeType, CardType } from "@/types/task";
import Image from "next/image";

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
            w-full h-40
            md:w-[91px] md:h-[53px]
            lg:w-full lg:h-40
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

      {/* 텍스트 콘텐츠 영역 */}
      <div className="flex flex-col justify-between flex-1 w-full">
        {/* 제목 */}
        <h3
          className={`
            text-black3 text-[14px] font-medium mt-2
            md:text-[16px] md:mt-0 lg:mt-2
            truncate max-w-[180px] sm:max-w-none
          `}
        >
          {title}
        </h3>

        {/* 태그 + 날짜 + 닉네임 */}
        <div
          className={`
            flex flex-col gap-2 mt-2
            md:flex-row md:items-center md:justify-between md:mt-1
            lg:flex-col lg:items-start lg:mt-2
            text-sm md:text-xs
          `}
        >
          {/* 태그들 */}
          <div className="flex gap-1 flex-wrap">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                  idx % 3 === 0
                    ? "bg-[#F9EEE3] text-[#D58D49]"
                    : idx % 3 === 1
                      ? "bg-[#F7DBF0] text-[#D549B6]"
                      : "bg-[#DBE6F7] text-[#4981D5]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* 날짜 + 닉네임 */}
          <div className="flex items-center gap-2 md:gap-3 text-gray-500">
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
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
            ) : (
              <div className="w-6 h-6 flex items-center justify-center bg-[#A3C4A2] text-white font-bold rounded-full text-xs">
                {assignee.nickname[0]}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
