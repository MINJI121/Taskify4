import { ProfileIcon } from "./CardProfileIcon";
import { CardDetailType } from "@/types/cards";

interface RepresentativeProps {
  card: CardDetailType;
}

export const Representative = ({ card }: RepresentativeProps) => {
  return (
    <div
      className="flex flex-col justify-center gap-4 sm:pl-4
      lg:w-[200px] sm:w-[180px] w-[290px]
      sm:h-[155px] h-[65px]
      rounded-lg bg-white border border-[#D9D9D9]"
    >
      {/* 내부 아이템 컨테이너 */}
      <div
        className="flex sm:items-start sm:flex-col sm:gap-4 sm:px-1
        justify-between items-center px-3.5"
      >
        {/* 담당자 컨테이너 */}
        <div>
          <p className="sm:text-[14px] text-12-sb text-black3 mb-[4px]">
            담당자
          </p>
          <div className="flex items-center gap-2">
            <ProfileIcon
              key={card.assignee.profileImageUrl}
              userId={card.assignee.id}
              nickname={card.assignee.nickname}
              profileImageUrl={card.assignee.profileImageUrl ?? ""}
              id={card.assignee.id}
              imgClassName="w-6 h-6"
              fontClassName="text-14-r"
            />
            <span
              title={card.assignee.nickname}
              className="font-normal text-black3 sm:text-[14px] text-[12px]
            truncate sm:max-w-none max-w-20 whitespace-nowrap"
            >
              {card.assignee.nickname}
            </span>
          </div>
        </div>

        {/* 모바일 gap 조절용 */}
        <div className="min-w-4 sm:hidden flex-shrink-0" />

        {/* 마감일 컨테이너 */}
        <div>
          <p className="sm:text-[14px] text-12-sb text-black3 mb-[4px]">
            마감일
          </p>
          <div className="flex items-center w-full h-6">
            <p className="font-normal text-black3 sm:text-[14px] text-[12px]">
              {card.dueDate
                ? new Date(card.dueDate).toLocaleString("ko-KR", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "마감일 없음"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
