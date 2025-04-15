import { useState, useEffect, useRef, ChangeEvent } from "react";
import NoResultDashBoard from "./NoResultDashBoard";
import EmptyInvitations from "./EmptyInvitations";
import { apiRoutes } from "@/api/apiRoutes";
import axiosInstance from "@/api/axiosInstance";
import { Invite } from "@/types/invite";
import useUserStore from "@/store/useUserStore";
import { toast } from "react-toastify";
import { Search } from "lucide-react";

const ITEMS_PER_PAGE = 6; // 한 번에 보여줄 개수

interface InvitedProps {
  searchTitle: string;
  invitationData: Invite[];
  fetchNextPage: () => void;
  hasMore: boolean;
  agreeInvitation?: () => void;
  onDecision?: (inviteId: number) => void;
}

function InvitedList({
  searchTitle,
  invitationData: invitationData,
  fetchNextPage,
  hasMore,
  agreeInvitation,
  onDecision,
}: InvitedProps) {
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
      await axiosInstance.put(apiRoutes.invitationDetail(inviteId), payload);
      if (agreeInvitation) agreeInvitation();
      if (onDecision) onDecision(inviteId);
      toast.success("초대가 수락되었습니다.");
    } catch (error) {
      console.error("수락 실패:", error);
      toast.error("초대 수락에 실패했습니다");
    }
  };

  /* 거절 */
  const rejectInvite = async (inviteId: number) => {
    const payload = {
      inviationId: inviteId,
      inviteAccepted: false,
    };
    try {
      await axiosInstance.put(apiRoutes.invitationDetail(inviteId), payload);
      if (onDecision) onDecision(inviteId);
      toast.success("초대가 거절되었습니다.");
    } catch (error) {
      console.error("거절 실패:", error);
      toast.error("초대 거절에 실패했습니다");
    }
  };

  return (
    /* 초대 목록 헤더 */
    <div className="relative bg-white w-full max-w-[260px] sm:max-w-[504px] lg:max-w-[966px] mx-auto mt-1">
      {filteredData.length > 0 && (
        <div className="font-16r hidden sm:grid grid-cols-[3fr_2fr_3fr] px-4 w-full h-[26px] items-center mb-5">
          <p className="text-[var(--color-gray2)] whitespace-nowrap">이름</p>
          <p className="text-[var(--color-gray2)] whitespace-nowrap">초대자</p>
          <p className="text-center text-[var(--color-gray2)] whitespace-nowrap">
            수락 여부
          </p>
        </div>
      )}

      {/* 리스트 */}
      <div className="scroll-area h-[150vw] max-h-[380px] sm:max-h-[240px] lg:max-h-[280px] overflow-y-auto overflow-x-hidden">
        {filteredData.length > 0 ? (
          filteredData.map((invite, index) => (
            <div
              key={index}
              className="pb-5 mb-[20px] w-full max-w-[260px] sm:max-w-[504px] lg:max-w-[966px]
                 h-auto sm:h-[50px] border-b border-[var(--color-gray4)]
                 sm:grid sm:grid-cols-[3fr_2fr_3fr] sm:items-center
                 text-black3 text-[14px] sm:text-[16px] font-normal
                 flex flex-col gap-10"
            >
              {/* 모바일 레이아웃 */}
              <div className="flex flex-col mt-1 sm:hidden px-4 w-full gap-2">
                <div className="flex justify-between">
                  <span className="text-[var(--color-gray2)]">이름</span>
                  <span className="text-[#333236] font-medium">
                    {invite.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-gray2)]">초대자</span>
                  <span className="text-[#333236] font-medium">
                    {invite.nickname}
                  </span>
                </div>
                <div className="flex gap-2 mt-1 justify-end">
                  <button
                    className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]"
                    onClick={() => rejectInvite(invite.id)}
                  >
                    거절
                  </button>
                  <button
                    className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]"
                    onClick={() => acceptInvite(invite.id)}
                  >
                    수락
                  </button>
                </div>
              </div>

              {/* 웹/태블릿 레이아웃 */}
              <div className="hidden sm:flex items-center pl-4">
                <p className="text-[#333236]">{invite.title}</p>
              </div>
              <div className="hidden sm:flex items-center pl-5 lg:pl-0">
                <p className="text-[#333236]">{invite.nickname}</p>
              </div>
              <div className="hidden sm:flex items-center justify-center gap-2 mr-1 lg:mr-12">
                <button
                  className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]"
                  onClick={() => rejectInvite(invite.id)}
                >
                  거절
                </button>
                <button
                  className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]"
                  onClick={() => acceptInvite(invite.id)}
                >
                  수락
                </button>
              </div>
            </div>
          ))
        ) : !hasMore ? (
          <NoResultDashBoard searchTitle={searchTitle} />
        ) : null}

        {/* 검색 결과가 존재하지만 더 이상 데이터가 없을 때 */}
        {filteredData.length > 0 && !hasMore && (
          <p className="text-center text-gray-400 bg-transparent">
            더 이상 초대 목록이 없습니다.
          </p>
        )}

        {/* 인터섹션 옵저버 */}
        {hasMore && <div ref={observerRef} className="h-[50px] w-[50px]" />}
      </div>
    </div>
  );
}

type CursorId = number;
type InvitedDashBoardProps = {
  agreeInvitation?: () => void;
};

export default function InvitedDashBoard({
  agreeInvitation,
}: InvitedDashBoardProps) {
  const { user } = useUserStore();
  const [isInitialized, setIsInitialized] = useState(false);

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
    if (user) {
      fetchNextPage();
    } // 초기 데이터 6개 불러오기
  }, [user]);

  /* 초대 목록 데이터 불러오기 */
  const fetchNextPage = async () => {
    if (user) {
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

        const res = await axiosInstance.get(apiRoutes.invitations(), {
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

          setTimeout(() => {
            setIsInitialized(true);
          }, 0);

          if (newInvitations.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          }
        }
      } catch (error) {
        console.error("초대내역 불러오는데 오류 발생:", error);
      } finally {
        isFetchingRef.current = false; // 데이터 요청 완료
      }
    }
  };

  const invitationArray = Array.from(invitationData.values()).flat();

  const removeInvitation = (inviteId: number) => {
    setInvitationData((prev) => {
      const newMap = new Map();
      for (const [key, list] of prev) {
        newMap.set(
          key,
          list.filter((invite) => invite.id !== inviteId)
        );
      }
      return newMap;
    });
  };

  if (!isInitialized) return null;

  return (
    <div>
      {invitationArray.length === 0 ? (
        <EmptyInvitations />
      ) : (
        <div className="relative bg-white rounded-lg shadow-md w-[260px] sm:w-[504px] lg:w-[1022px] h-[550px] sm:h-[450px] lg:h-[500px] max-w-none">
          <div className="flex flex-col p-6 w-full h-[104px]">
            <div className="flex flex-col w-full sm:w-[448px] lg:w-[966px] gap-[24px]">
              <p className="text-black3 text-[16px] sm:text-[20px] font-bold">
                초대받은 대시보드
              </p>

              <div className="relative w-full sm:w-[448px] lg:w-[966px] mx-auto">
                <input
                  id="title"
                  placeholder="검색"
                  type="text"
                  value={searchTitle}
                  onChange={handleSearchInputChange}
                  className="text-black3 w-full h-[40px] pl-[40px] py-[6px] border border-[#D9D9D9] bg-white rounded-[6px] placeholder-gray-400 outline-none"
                />
                <Search
                  width={18}
                  height={18}
                  color="#333236"
                  className="absolute left-[16px] top-1/2 transform -translate-y-1/2 z-10"
                />
              </div>
              <InvitedList
                searchTitle={searchTitle}
                invitationData={invitationArray}
                fetchNextPage={fetchNextPage}
                hasMore={hasMore}
                agreeInvitation={agreeInvitation}
                onDecision={removeInvitation}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
