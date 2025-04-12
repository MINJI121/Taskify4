import React from "react";
import Image from "next/image";
import RandomProfile from "../table/member/RandomProfile";

export interface ProfileIconProps {
  id: number;
  nickname: string;
  profileImageUrl: string;
  imgClassName: string;
  fontClassName: string;
  userId: number;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  nickname,
  profileImageUrl,
}) => (
  <>
    {profileImageUrl ? (
      <Image
        src={profileImageUrl}
        alt="유저 프로필 아이콘"
        width={26}
        height={26}
        className="object-cover sm:w-[34px] sm:h-[34px] rounded-full"
      />
    ) : (
      <div
        className="sm:w-[34px] sm:h-[34px] w-[26px] h-[26px] rounded-full
      overflow-hidden flex items-center justify-center"
      >
        <RandomProfile name={nickname} />
      </div>
    )}
  </>
);
