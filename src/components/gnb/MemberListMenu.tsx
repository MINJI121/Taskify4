import React, { useRef } from "react";
import clsx from "clsx";
import { useClosePopup } from "@/hooks/useClosePopup";
import { MemberProfileIcon } from "@/components/gnb/ProfileIcon";
import { MemberType } from "@/types/users";

interface MemberListMenuProps {
  isListOpen: boolean;
  setIsListOpen: React.Dispatch<React.SetStateAction<boolean>>;
  members: MemberType[];
}

const MemberListMenu: React.FC<MemberListMenuProps> = ({
  isListOpen,
  setIsListOpen,
  members,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useClosePopup(ref, () => setIsListOpen(false));

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute top-full right-0 w-[140px] sm:w-[190px] z-50",
        "bg-white border border-gray3 rounded-lg shadow",
        "transition-all duration-200 ease-out",
        isListOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      )}
    >
      <ul className="flex flex-col max-h-[200px] sm:max-h-[270px] overflow-y-auto">
        {members.map((member) => (
          <li
            key={member.id}
            className="px-4 py-2 flex items-center gap-2 hover:bg-[#f9f9f9]"
          >
            <MemberProfileIcon members={member} />
            <span
              title={member.nickname}
              className="text-black3 text-sm md:text-base truncate max-w-[60px] sm:max-w-[85px]"
            >
              {member.nickname}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberListMenu;
