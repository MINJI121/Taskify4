import { ProfileIcon } from "./CardProfileIcon";
import { CardDetailType } from "@/types/cards";

interface RepresentativeProps {
  card: CardDetailType;
}

export const Representative = ({ card }: RepresentativeProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4
      lg:w-[200px] sm:w-[180px] w-[290px]
      sm:h-[155px] h-[65px]
      rounded-lg bg-white border border-[#D9D9D9]"
    >
      {/* 내부 아이템 컨테이너 */}
      <div className="flex sm:flex-col sm:gap-4 gap-17">
        {/* 담당자 컨테이너 */}
        <div>
          <p className="font-12sb text-black3 mb-[4px]">담당자</p>
          <div className="flex items-center gap-2">
            <ProfileIcon
              userId={card.assignee.id}
              nickname={card.assignee.nickname}
              profileImageUrl={card.assignee.profileImageUrl ?? ""}
              id={card.assignee.id}
              imgClassName="w-6 h-6"
              fontClassName="font-14r"
            />
            <span className="font-normal text-black3 sm:text-[14px] text-[12px]">
              {card.assignee.nickname}
            </span>
          </div>
        </div>

        {/* 마감일 컨테이너 */}
        <div>
          <p className="font-12sb text-black3 sm:mb-1 mb-[8px]">마감일</p>
          <p className="font-normal text-black3 sm:text-[14px] text-[12px]">
            {new Date(card.dueDate).toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
