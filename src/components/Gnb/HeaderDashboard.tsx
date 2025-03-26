import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import SkeletonUser from "./skeletonUser";
import { UserType } from "./type";
import { getUserInfo } from "@/api/user";
import RandomProfile from "../table/member/RandomProfile";
import NewDashboard from "../modal/NewDashboard";

const HeaderDashboard = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /*관리 버튼 클릭 이벤트 함수*/
  const router = useRouter();
  const { dashboardId } = router.query;

  const goToDashboardEdit = () => {
    router.push(`/dashboard/${dashboardId}/edit`);
  };
  /*초대하기 버튼 클릭 시 모달 팝업 오픈*/
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openInviteModal = () => {
    setIsModalOpen(true);
  };
  const closeInviteModal = () => {
    setIsModalOpen(false);
  };

  /*유저 정보 api 호출*/
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getUserInfo();
        setUser(data);
      } catch (error) {
        console.log("유저 정보 불러오기 실패", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="w-full h-[50px] sm:h-[60px] md:h-[70px] flex items-center justify-center bg-white border-b-[1px] border-b-[#D9D9D9]">
      <div className="w-full flex items-center justify-between pl-[4vw]">
        <div className="flex items-center">
          <p className="text-base text-black3 font-bold md:text-xl">
            내 대시보드
          </p>
        </div>

        <div className="flex items-center">
          <div className="flex gap-[6px] md:gap-[16px]">
            <button
              onClick={goToDashboardEdit}
              className="flex items-center justify-center w-[49px] h-[30px] md:w-[88px] md:h-[40px] rounded-[8px] border border-[#D9D9D9] gap-[10px] cursor-pointer"
            >
              <img
                src="/svgs/settings.svg"
                alt="관리 아이콘"
                className="w-[20px] h-[20px] hidden md:block"
              />
              <span className="text-sm md:text-base text-gray1">관리</span>
            </button>

            <button
              onClick={openInviteModal}
              className="flex items-center justify-center w-[73px] h-[30px] md:w-[116px] md:h-[40px] rounded-[8px] border border-[#D9D9D9] gap-[10px] cursor-pointer"
            >
              <img
                src="/svgs/add-box.svg"
                alt="초대하기 아이콘"
                className="w-[20px] h-[20px] hidden md:block"
              />
              <span className="text-sm md:text-base text-gray1">초대하기</span>
            </button>
            {isModalOpen && <NewDashboard onClose={closeInviteModal} />}
          </div>

          {/*구분선*/}
          <div className="pl-[15px] pr-[20px] md:pl-[25px] md:pr-[30px] lg:pl-[30px] lg:pr-[35px]">
            <div className="flex items-center justify-center h-[34px] md:h-[38px] w-[1px] bg-[var(--color-gray3)]"></div>
          </div>

          {/*유저 프로필 아이콘 & 유저 닉네임*/}
          {isLoading ? (
            <SkeletonUser />
          ) : (
            user && (
              <div className="flex items-center pr-[10px] md:pr-[30px] lg:pr-[80px] gap-[12px]">
                <div className="w-[34px] h-[34px] md:w-[38px] md:h-[38px]">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt="유저 프로필 아이콘"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <RandomProfile name={user.nickname} />
                  )}
                </div>
                <span className="hidden md:block text-black3 md:text-base md:font-medium">
                  {user.nickname}
                </span>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderDashboard;
