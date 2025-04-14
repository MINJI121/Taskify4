import React, { useEffect, useState } from "react";
import SkeletonUser from "@/shared/skeletonUser";
import RandomProfile from "@/components/common/RandomProfile";
import Image from "next/image";
import { MemberType } from "@/types/users";

/*멤버 프로필 아이콘*/
interface MemberIconProps {
  members: MemberType[];
  isLoading: boolean;
}

export const MembersProfileIconList: React.FC<MemberIconProps> = ({
  members,
  isLoading,
}) => {
  // 표시할 프로필 아이콘 최대 개수
  const [maxVisibleMembers, setMaxVisibleMembers] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      // 모바일 아이콘 최대 개수
      if (window.innerWidth < 640) {
        setMaxVisibleMembers(2);
      } else {
        setMaxVisibleMembers(4);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex items-center justify-center -space-x-3">
      {isLoading ? (
        <SkeletonUser />
      ) : (
        <>
          {members.slice(0, maxVisibleMembers).map((member) => (
            <div key={member.id} className="relative rounded-full">
              {member.profileImageUrl ? (
                <div
                  className="relative flex items-center justify-center
                w-[34px] h-[34px] md:w-[38px] md:h-[38px]
                rounded-full border-[2px] border-white overflow-hidden"
                >
                  <Image
                    src={member.profileImageUrl}
                    alt={member.nickname}
                    fill
                    className="object-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <RandomProfile
                  userId={member.id}
                  name={member.nickname}
                  className="relative flex items-center justify-center
                    object-cover overflow-hidden
                    sm:w-[38px] sm:h-[38px] w-[34px] h-[34px]
                    border-[2px] border-white"
                />
              )}
            </div>
          ))}

          {/* 출력되지 않은 나머지 멤버 수 */}
          {members.length > maxVisibleMembers && (
            <div
              className="relative flex items-center justify-center
            overflow-hidden
            w-[34px] h-[34px] md:w-[38px] md:h-[38px]
            rounded-full bg-[#F4D7DA] text-[14px] md:text-[16px] text-[#D25B68] border-[2px] border-white"
            >
              +{members.length - maxVisibleMembers}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MembersProfileIconList;
