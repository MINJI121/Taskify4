import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import SkeletonUser from "@/shared/skeletonUser";
import Image from "next/image";
import { MemberType, UserType } from "@/types/users";
import { getMembers } from "@/api/members";
import { getUserInfo } from "@/api/user";
import { getDashboardById } from "@/api/dashboards";
import { TEAM_ID } from "@/constants/team";
import { MemberAvatars, UserAvatars } from "@/components/gnb/Avatars";
import UserMenu from "@/components/gnb/UserMenu";
import InviteDashboard from "@/components/modal/InviteDashboard";

interface HeaderDashboardProps {
  variant?: "mydashboard" | "dashboard" | "mypage";
  dashboardTitle?: string;
  dashboardId?: string | string[];
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  variant,
  dashboardId,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [dashboard, setDashboard] = useState<{
    title: string;
    createdByMe: boolean;
  } | null>(null);

  /*초대하기 모달 상태 관리*/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openInviteModal = () => {
    setIsModalOpen(true);
  };
  const closeInviteModal = () => {
    setIsModalOpen(false);
  };

  /*멤버 목록 api 호출*/
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const members = await getMembers(dashboardId);
        setMembers(members);
      } catch (error) {
        console.error("멤버 불러오기 실패:", error);
        setErrorMessage("멤버 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if ((variant === "dashboard" || variant === "mypage") && dashboardId) {
      fetchMembers();
    }
  }, [dashboardId, variant]);

  /*유저 정보 api 호출*/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserInfo({ teamId: TEAM_ID });
        setUser(user);
      } catch (error) {
        console.error("유저 정보 불러오기 실패", error);
        setErrorMessage("유저 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  /*대시보드 api 호출*/
  useEffect(() => {
    const fetchDashboard = async () => {
      if (variant === "dashboard" && dashboardId) {
        try {
          const dashboardData = await getDashboardById({
            teamId: TEAM_ID,
            dashboardId: Number(dashboardId),
          });
          setDashboard(dashboardData);
        } catch (error) {
          console.error("대시보드 정보 불러오기 실패", error);
          setErrorMessage("대시보드를 불러오지 못했습니다.");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchDashboard();
  }, [variant, dashboardId]);

  /*헤더 종류에 따라 다른 제목 표시*/
  const title = (() => {
    if (variant === "mypage") return "계정 관리";
    if (variant === "dashboard" && dashboard?.title) return dashboard.title;
    return "내 대시보드";
  })();

  return (
    <header className="w-full h-[60px] md:h-[70px] flex items-center justify-center bg-white border-b-[1px] border-b-[#D9D9D9]">
      <div className="w-full flex items-center justify-between pl-[4vw]">
        {errorMessage && (
          <p className="text-sm text-[var(--color-red)] px-4 py-2">
            {errorMessage}
          </p>
        )}
        <div className="flex items-center gap-[8px]">
          <p className="text-base text-black3 font-bold md:text-xl">{title}</p>
          {dashboard?.createdByMe && (
            <Image
              src="/svgs/crown.svg"
              alt="왕관 아이콘"
              width={22}
              height={22}
              className="inline-block"
              unoptimized
              priority
            />
          )}
        </div>

        <div className="flex items-center">
          {/*관리 버튼*/}
          <div className="flex gap-[6px] md:gap-[16px] pr-[40px]">
            <button
              onClick={() => {
                if (dashboardId) {
                  router.push(`/dashboard/${dashboardId}/edit`);
                } else {
                  router.push("/mypage");
                }
              }}
              className="flex items-center justify-center w-[49px] h-[30px] md:w-[85px] md:h-[36px] lg:w-[88px] lg:h-[40px] rounded-[8px] border border-[#D9D9D9] gap-[10px] cursor-pointer"
            >
              <Image
                src="/svgs/settings.svg"
                alt="관리 아이콘"
                width={20}
                height={20}
                className="hidden md:block"
              />
              <span className="text-sm md:text-base text-gray1">관리</span>
            </button>
            {/*초대하기 버튼*/}
            <button
              onClick={openInviteModal}
              className="flex items-center justify-center w-[73px] h-[30px] md:w-[109px] md:h-[36px] lg:w-[116px] lg:h-[40px] rounded-[8px] border border-[#D9D9D9] gap-[10px] cursor-pointer"
            >
              <Image
                src="/svgs/add-box.svg"
                alt="초대하기 아이콘"
                width={20}
                height={20}
                className="hidden md:block"
              />
              <span className="text-sm md:text-base text-gray1">초대하기</span>
            </button>
            {isModalOpen && <InviteDashboard onClose={closeInviteModal} />}
          </div>

          {/*멤버 목록*/}
          <MemberAvatars
            members={members}
            isLoading={isLoading}
            variant={variant}
          />

          {/*드롭다운 메뉴 너비 지정 목적의 섹션 구분용 div*/}
          <div className="relative flex items-center h-[60px] md:h-[70px] pr-[10px] md:pr-[30px] lg:pr-[80px]">
            {/*구분선*/}
            <div className="h-[34px] md:h-[38px] w-[1px] bg-[var(--color-gray3)]" />

            {/*유저 정보*/}
            {isLoading ? (
              <SkeletonUser />
            ) : (
              user && (
                <div
                  onClick={() => setIsMenuOpen((prev) => !prev)}
                  className="flex items-center gap-[12px] pl-[20px] md:pl-[30px] lg:pl-[35px] cursor-pointer"
                >
                  <UserAvatars user={user} />
                  <span className="hidden md:block text-black3 md:text-base md:font-medium">
                    {user.nickname}
                  </span>
                  <UserMenu
                    isMenuOpen={isMenuOpen}
                    setIsMenuOpen={setIsMenuOpen}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
