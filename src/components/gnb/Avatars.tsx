import React from "react";
import SkeletonUser from "@/shared/skeletonUser";
import RandomProfile from "../table/member/RandomProfile";
import Image from "next/image";
import { MemberType, UserType } from "@/types/users";

/*멤버 프로필 아이콘*/
interface MemberAvatarsProps {
  members: MemberType[];
  isLoading: boolean;
  variant?: "mydashboard" | "dashboard" | "mypage";
}

const MAX_VISIBLE_MEMBERS = 4;

export const MemberAvatars: React.FC<MemberAvatarsProps> = ({
  members,
  isLoading,
  variant,
}) => {
  if (variant === "mydashboard") return null;

  return (
    <div className="pr-[15px] md:pr-[25px] lg:pr-[30px]">
      <div className="flex items-center justify-center -space-x-3">
        {isLoading ? (
          <SkeletonUser />
        ) : (
          <>
            {members.slice(0, MAX_VISIBLE_MEMBERS).map((member) => (
              <div key={member.id} className="relative rounded-full">
                {member.profileImageUrl ? (
                  <div className="relative w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full border-[2px] border-white overflow-hidden">
                    <Image
                      src={member.profileImageUrl}
                      alt={member.nickname}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <RandomProfile name={member.nickname} />
                )}
              </div>
            ))}
            {members.length > MAX_VISIBLE_MEMBERS && (
              <div className="relative w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full bg-[#F4D7DA] font-16m text-[#D25B68] border-[2px] border-white overflow-hidden">
                +{members.length - MAX_VISIBLE_MEMBERS}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/*유저 프로필 아이콘*/
interface UserAvatarProps {
  user: UserType;
}

export const UserAvatars: React.FC<UserAvatarProps> = ({ user }) => (
  <div className="relative w-[34px] h-[34px] md:w-[38px] md:h-[38px] rounded-full overflow-hidden">
    {user.profileImageUrl ? (
      <Image
        src={user.profileImageUrl}
        alt="유저 프로필 아이콘"
        fill
        className="object-cover"
      />
    ) : (
      <RandomProfile name={user.nickname} />
    )}
  </div>
);
