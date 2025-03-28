import { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import NoResultDashBoard from "./NoResultDashBoard";
import EmptyInvitations from "./EmptyInvitations";
import { apiRoutes } from "@/api/apiRoutes";
import axiosInstance from "@/api/axiosInstance";
import { Invite } from "@/types/invite";

const ITEMS_PER_PAGE = 6; // 한 번에 보여줄 개수

function InvitedList({
  searchTitle,
  invitationData: invitationData,
  fetchNextPage,
  hasMore,
}: {
  searchTitle: string;
  invitationData: Invite[];
  fetchNextPage: () => void;
  hasMore: boolean;
}) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  /* IntersectionObserver 설정 */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasMore) {
            fetchNextPage();
          }
        });
      },
      { threshold: 0.5 } // observerRef가 화면에 50% 이상 보일 때
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasMore, fetchNextPage]);

  /* 검색 기능 */
  const filteredData = invitationData.filter(
    (invite) =>
      invite.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      invite.nickname.toLowerCase().includes(searchTitle.toLowerCase())
  );

  /* 수락 */
  const acceptInvite = async (inviteId: number) => {
    const payload = {
      inviationId: inviteId,
      inviteAccepted: true,
    };
    try {
      const response = await axiosInstance.put(
        apiRoutes.invitationDetail(inviteId),
        payload
      );
      console.log("대시보드 수락 성공:", response.data);
      alert("대시보드 수락 성공"); // 추후에 toast로 변경
      window.location.reload();
    } catch (error) {
      console.error("대시보드 수락 실패:", error);
      alert("대시보드 수락 실패"); // 추후에 toast로 변경
    }
  };

  /* 거절 */
  const rejectInvite = async (inviteId: number) => {
    const payload = {
      inviationId: inviteId,
      inviteAccepted: false,
    };
    try {
      const response = await axiosInstance.put(
        apiRoutes.invitationDetail(inviteId),
        payload
      );
      console.log("대시보드 거절 성공:", response.data);
      alert("대시보드 거절 성공"); // 추후에 toast로 변경
      window.location.reload();
    } catch (error) {
      console.error("대시보드 거절 실패:", error);
      alert("대시보드 거절 실패"); // 추후에 toast로 변경
    }
  };

  return (
    <div className="relative bg-white w-[260px] sm:w-[504px] lg:w-[1022px] h-[770px] sm:h-[592px] lg:h-[620px] mx-auto mt-[40px]">
      {filteredData.length > 0 && (
        <div className="hidden sm:flex p-6 w-full h-[26px] justify-start items-center pl-[43px] pr-[76px] md:gap-x-[130px] lg:gap-x-[280px]">
          <p className="lg:ml-10 font-normal text-[var(--color-gray2)]">이름</p>
          <p className="font-normal text-[var(--color-gray2)]">초대자</p>
          <p className="lg:ml-13 font-normal text-[var(--color-gray2)]">
            수락여부
          </p>
        </div>
      )}
      <div className="scroll-area h-[400px] overflow-y-auto overflow-x-hidden">
        {filteredData.length > 0
          ? filteredData.map((invite, index) => (
              <div
                key={index}
                className="pb-5 mb-[20px] w-[260px] sm:w-[504px] lg:w-[1022px] h-auto sm:h-[50px] sm:grid sm:grid-cols-[1fr_1fr_1fr] sm:items-center flex flex-col gap-10 border-b border-[var(--color-gray4)]"
              >
                {/* 모바일 레이아웃 */}
                <div className="flex flex-col sm:hidden">
                  <p className="ml-9 mt-1 w-full">
                    <span className="mr-8 text-[var(--color-gray2)]">이름</span>
                    <span className="text-[#333236]">{invite.title}</span>
                  </p>
                  <p className="ml-9 mt-1 w-full">
                    <span className="mr-3.5 text-[var(--color-gray2)]">
                      초대자
                    </span>{" "}
                    <span className="text-[#333236]">{invite.nickname}</span>
                  </p>
                  <div className="flex gap-2 mt-2 justify-center">
                    <button
                      className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]"
                      onClick={() => acceptInvite(invite.id)}
                    >
                      수락
                    </button>
                    <button
                      className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]"
                      onClick={() => rejectInvite(invite.id)}
                    >
                      거절
                    </button>
                  </div>
                </div>

                {/* 웹, 태블릿 레이아웃 */}
                <p className="lg:ml-21 md:ml-11 ml-9 justify-left mt-1 w-full hidden sm:flex">
                  {invite.title}
                </p>
                <p className="lg:mr-25 md:mr-10 ml-9 justify-left mt-1 hidden sm:flex">
                  {invite.nickname}
                </p>
                <div className="lg:mr-5 gap-2 mt-1 mr-2 justify-between sm:justify-start hidden sm:flex">
                  <button
                    className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]"
                    onClick={() => acceptInvite(invite.id)}
                  >
                    수락
                  </button>
                  <button
                    className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]"
                    onClick={() => rejectInvite(invite.id)}
                  >
                    거절
                  </button>
                </div>
              </div>
            ))
          : !hasMore && <NoResultDashBoard searchTitle={searchTitle} />}{" "}
        {/* 검색 내역이 없을 경우 */}
        {filteredData.length > 0 && !hasMore && (
          <p className="lg:mr-18 text-center text-gray-400 py-4">
            더 이상 초대 목록이 없습니다.
          </p>
        )}
        {hasMore && (
          <div ref={observerRef} className="h-[50px] w-[50px] bg-red"></div>
        )}
      </div>
    </div>
  );
}

type CursorId = number;

export default function InvitedDashBoard() {
  const [searchTitle, setSearchTitle] = useState("");
  const [invitationData, setInvitationData] = useState<Map<CursorId, Invite[]>>(
    new Map()
  );
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const [cursorId, setCursorId] = useState<number | null>(null); // cursorId를 상태로 관리
  const isFetchingRef = useRef(false); // 데이터가 불러와졌는지 여부를 확인하기 위한 ref

  /* 검색 input */
  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.target.value);
  };

  useEffect(() => {
    fetchNextPage(); // 초기 데이터 6개 불러오기
  }, []);

  /* 초대 목록 데이터 불러오기 */
  const fetchNextPage = async () => {
    try {
      const existingCursorId =
        cursorId !== null && cursorId !== undefined
          ? invitationData.get(cursorId)
          : undefined;

      if (existingCursorId && existingCursorId.length > 0) {
        // 이미 데이터가 존재하면 더 이상 요청하지 않음
        return;
      }

      if (isFetchingRef.current) return; // 이미 데이터가 불러와졌다면 중복 요청 방지
      isFetchingRef.current = true; // 데이터 요청 시작

      const res = await axiosInstance.get(apiRoutes.Invitations(), {
        params: {
          size: ITEMS_PER_PAGE,
          cursorId: cursorId || null,
        },
      });

      if (res.data && Array.isArray(res.data.invitations)) {
        const newInvitations = res.data.invitations.map(
          (item: {
            id: number;
            dashboard: { title: string };
            inviter: { nickname: string };
          }) => ({
            id: item.id,
            title: item.dashboard.title,
            nickname: item.inviter.nickname,
          })
        ) as Invite[];

        if (newInvitations.length > 0) {
          setCursorId(res.data.cursorId);
        }

        setInvitationData((prev) => {
          const newMap = new Map(prev);
          newMap.set(cursorId as CursorId, newInvitations);
          return newMap;
        });

        if (newInvitations.length < ITEMS_PER_PAGE) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("초대내역 불러오는데 오류 발생:", error);
    } finally {
      isFetchingRef.current = false; // 데이터 요청 완료
    }
  };

  const invitationArray = Array.from(invitationData.values()).flat();

  return (
    <div>
      {invitationArray.length === 0 ? (
        <EmptyInvitations />
      ) : (
        <div className="relative bg-white rounded-lg shadow-md w-[260px] sm:w-[504px] lg:w-[1022px] h-[770px] sm:h-[592px] lg:h-[620px] max-w-none">
          <div className="p-6 relative w-full h-[104px]">
            <div className="flex justify-between items-center mb-[32px]">
              <p className="text-xl sm:text-2xl font-bold">초대받은 대시보드</p>
            </div>
            <div className="relative w-[228px] sm:w-[448px] lg:w-[966px]">
              <input
                id="title"
                placeholder="검색"
                type="text"
                value={searchTitle}
                onChange={handleSearchInputChange}
                className="text-[var(--color-gray2)] w-full h-[40px] px-[40px] py-[6px] border border-[#D9D9D9] bg-white rounded-[6px] placeholder-gray-400 outline-none"
              />
              <Image
                src="/svgs/search.svg"
                alt="검색 아이콘"
                width={20}
                height={20}
                className="absolute left-[12px] top-1/2 transform -translate-y-1/2"
              />
            </div>
          </div>
          <InvitedList
            searchTitle={searchTitle}
            invitationData={invitationArray}
            fetchNextPage={fetchNextPage}
            hasMore={hasMore}
          />
        </div>
      )}
    </div>
  );
}
