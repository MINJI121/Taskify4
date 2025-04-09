import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import Image from "next/image";
import SkeletonUser from "@/shared/skeletonUser";
import { MemberType, UserType } from "@/types/users";
import { getMembers } from "@/api/members";
import { getUserInfo } from "@/api/users";
import { getDashboardById } from "@/api/dashboards";
import { UserProfileIcon } from "@/components/gnb/ProfileIcon";
import MembersProfileIconList from "@/components/gnb/MembersProfileIconList";
import UserMenu from "@/components/gnb/UserMenu";
import MemberListMenu from "@/components/gnb/MemberListMenu";
import InviteDashboard from "@/components/modal/InviteDashboard";

interface HeaderDashboardProps {
  variant?: "mydashboard" | "dashboard" | "edit" | "mypage";
  dashboardTitle?: string;
  dashboardId?: string | string[];
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
}

const HeaderDashboard: React.FC<HeaderDashboardProps> = ({
  variant,
  dashboardId,
  isEditMode,
  onToggleEditMode,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserType | null>(null);
  const [members, setMembers] = useState<MemberType[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
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
        const members = await getMembers({
          dashboardId: Number(dashboardId),
        });
        setMembers(members);
      } catch (error) {
        console.error("멤버 불러오기 실패:", error);
        setErrorMessage("멤버 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (
      (variant === "dashboard" || variant === "mypage" || variant === "edit") &&
      dashboardId
    ) {
      fetchMembers();
    }
  }, [dashboardId, variant]);

  /*유저 정보 api 호출*/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserInfo();
        setUser(user);
      } catch (error) {
        console.error("유저 정보 불러오기 실패", error);
        setErrorMessage("유저 정보를 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    const token = localStorage.getItem("accessToken");
    if (token) {
      fetchUser();
    }
  }, []);

  /*대시보드 api 호출*/
  useEffect(() => {
    const fetchDashboard = async () => {
      if (variant === "dashboard" && dashboardId) {
        try {
          const dashboardData = await getDashboardById({
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
    if (variant === "mydashboard") return "내 대시보드";
    if (variant === "edit") return "대시보드 수정";
    if (variant === "mypage") return "계정 관리";
    if (variant === "dashboard" && dashboard?.title) return dashboard.title;
  })();

  return (
    <header
      className={clsx(
        "flex items-center justify-center",
        "w-full h-[60px] md:h-[70px]",
        "bg-white",
        "border-b-[1px] border-b-[var(--color-gray3)]"
      )}
    >
      <div className="w-full flex items-center justify-between pl-[4vw]">
        {errorMessage && (
          <p className="text-sm text-[var(--color-red)] px-4 py-2">
            {errorMessage}
          </p>
        )}

        {/*헤더 제목*/}
        <div className="flex font-bold items-center gap-[8px]">
          <p
            className={clsx(
              "text-[16px] sm:text-[20px] text-black3",
              "whitespace-nowrap truncate max-w-[100px] md:max-w-[400px]",
              variant !== "mydashboard" && variant !== "mypage"
                ? "hidden lg:block"
                : ""
            )}
          >
            {title}
          </p>
          {dashboard?.createdByMe && (
            <Image
              src="/svgs/crown.svg"
              alt="왕관 아이콘"
              width={22}
              height={22}
              className={
                variant === "mydashboard"
                  ? "inline-block"
                  : "hidden lg:inline-block"
              }
              unoptimized
              priority
            />
          )}
        </div>

        <div className="flex items-center">
          <div
            className={clsx(
              "flex gap-[6px] md:gap-[16px]",
              variant === "mydashboard" ? "pr-[22px] md:pr-[32px]" : ""
            )}
          >
            {/*관리 버튼*/}
            {(variant === "mydashboard" || dashboard?.createdByMe) && (
              <button
                onClick={() => {
                  if (dashboardId) {
                    router.push(`/dashboard/${dashboardId}/edit`);
                  } else {
                    if (onToggleEditMode) {
                      onToggleEditMode();
                    }
                  }
                }}
                className={clsx(
                  "flex items-center justify-center",
                  "w-[49px] h-[30px] md:w-[85px] md:h-[36px] lg:w-[88px] lg:h-[40px]",
                  "border border-[var(--color-gray3)] rounded-[8px] gap-[10px] cursor-pointer",
                  isEditMode ? "hover:border-2" : ""
                )}
              >
                <Image
                  src="/svgs/settings.svg"
                  alt="관리 아이콘"
                  width={20}
                  height={20}
                  className="hidden md:block"
                />
                <span className="text-sm md:text-base text-gray1">
                  {isEditMode ? "완료" : "관리"}
                </span>
              </button>
            )}

            {/*초대하기 버튼*/}
            {variant !== "mydashboard" &&
              variant !== "edit" &&
              dashboard?.createdByMe && (
                <button
                  onClick={openInviteModal}
                  className={clsx(
                    "flex items-center justify-center",
                    "w-[73px] h-[30px] md:w-[109px] md:h-[36px] lg:w-[116px] lg:h-[40px]",
                    "border border-[var(--color-gray3)] rounded-[8px] gap-[10px] cursor-pointer"
                  )}
                >
                  <Image
                    src="/svgs/add-box.svg"
                    alt="초대하기 아이콘"
                    width={20}
                    height={20}
                    className="hidden md:block"
                  />
                  <span className="text-sm md:text-base text-gray1">
                    초대하기
                  </span>
                </button>
              )}
            {isModalOpen && <InviteDashboard onClose={closeInviteModal} />}
          </div>

          {/*멤버 목록*/}
          {variant !== "mydashboard" && (
            <div className="relative flex items-center justify-center w-full h-[60px] md:h-[70px] whitespace-nowrap">
              {isLoading ? (
                <SkeletonUser />
              ) : (
                members && (
                  <div
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={() => setIsListOpen((prev) => !prev)}
                    className="flex items-center pl-[15px] md:pl-[25px] lg:pl-[30px] pr-[15px] md:pr-[25px] lg:pr-[30px] cursor-pointer"
                  >
                    <MembersProfileIconList
                      members={members}
                      isLoading={isLoading}
                    />
                  </div>
                )
              )}
              <MemberListMenu
                members={members}
                isListOpen={isListOpen}
                setIsListOpen={setIsListOpen}
              />
            </div>
          )}

          {/*드롭다운 메뉴 너비 지정 목적의 유저 섹션 div*/}
          <div className="relative flex items-center h-[60px] md:h-[70px] pr-[10px] md:pr-[30px] lg:pr-[80px]">
            {/*구분선*/}
            <div className="h-[34px] md:h-[38px] w-[1px] bg-[var(--color-gray3)]" />
            {/*유저 드롭다운 메뉴*/}
            <div
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="flex items-center gap-[12px] pl-[20px] md:pl-[30px] lg:pl-[35px] cursor-pointer overflow-hidden"
            >
              <UserMenu
                user={user}
                isMenuOpen={isMenuOpen}
                setIsMenuOpen={setIsMenuOpen}
              />
              {/*유저 프로필*/}
              {isLoading ? (
                <SkeletonUser />
              ) : (
                user && (
                  <>
                    <UserProfileIcon user={user} />
                    <span className="hidden md:block text-black3 md:text-base md:font-medium max-w-[90px] truncate whitespace-nowrap">
                      {user.nickname}
                    </span>
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
