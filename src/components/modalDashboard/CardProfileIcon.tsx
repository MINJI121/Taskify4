import React from "react";
import Image from "next/image";
import RandomProfile from "@/components/common/RandomProfile";

export interface ProfileIconProps {
  id: number;
  nickname: string;
  profileImageUrl: string;
  imgClassName?: string;
  fontClassName?: string;
  userId: number;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  userId,
  nickname,
  profileImageUrl,
  imgClassName = "sm:w-[34px] sm:h-[34px] w-[26px] h-[26px]",
  fontClassName = "text-sm",
}) => (
  <>
    {profileImageUrl ? (
      <Image
        src={profileImageUrl}
        alt="유저 프로필 아이콘"
        width={26}
        height={26}
        className={`object-cover rounded-full ${imgClassName}`}
      />
    ) : (
      <RandomProfile
        userId={userId}
        name={nickname}
        className={`rounded-full flex items-center justify-center ${imgClassName} ${fontClassName}`}
      />
    )}
  </>
);
