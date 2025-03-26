import { useState, useEffect, useRef, ChangeEvent } from "react";
import Image from "next/image";
import NoDashboardMessage from "./NoResultDashBoard";
import EmptyInvitations from "./EmptyInvitations";

interface Invite {
  title: string;
  nickname: string;
}

const invitedData: Invite[] = [
  { title: "프로덕트 디자인", nickname: "손동희" },
  { title: "새로운 기획 문서", nickname: "안귀영" },
  { title: "유닛 A", nickname: "장혁" },
  { title: "유닛 B", nickname: "강나무" },
  { title: "유닛 C", nickname: "김태현" },
  { title: "유닛 D", nickname: "김태현" },
  { title: "유닛 E", nickname: "이정민" },
  { title: "유닛 F", nickname: "박소영" },
  { title: "유닛 G", nickname: "최준호" },
  { title: "유닛 H", nickname: "배지훈" },
];

const ITEMS_PER_PAGE = 6; // 한 번에 보여줄 개수

function InvitedList({ searchTitle }: { searchTitle: string }) {
  const [displayedData, setDisplayedData] = useState<Invite[]>([]); // 보여줄 데이터 상태
  const [page, setPage] = useState(1); // 페이지 번호
  const observerRef = useRef<HTMLDivElement | null>(null); // IntersectionObserver를 위한 ref

  const hasMore = displayedData.length < invitedData.length;

  // 데이터 로드
  useEffect(() => {
    loadMoreData();
  }, [page]);

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log("스크롤이 바닥에 도달했습니다.");
            if (hasMore) {
              console.log("Scroll reached the end. Loading more data...");
              setPage((prevPage) => prevPage + 1);
            }
          } else {
            console.log("스크롤이 바닥에서 벗어났습니다.");
          }
        });
      },
      { threshold: 0.5 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current); // cleanup
      }
    };
  }, [hasMore]);

  // 데이터를 로드하는 함수
  const loadMoreData = () => {
    const nextData = invitedData.slice(0, page * ITEMS_PER_PAGE); // 페이지에 맞는 데이터만 가져옴
    setDisplayedData(nextData); // 데이터를 갱신
  };

  // 검색 기능
  const filteredData = displayedData.filter(
    (invite) =>
      invite.title.toLowerCase().includes(searchTitle.toLowerCase()) ||
      invite.nickname.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <div className="relative bg-white w-[260px] sm:w-[504px] lg:w-[1022px] h-[770px] sm:h-[592px] lg:h-[620px] mx-auto mt-[40px]">
      {filteredData.length > 0 && (
        <div className="p-6 flex w-full h-[26px] justify-start items-center pl-[43px] pr-[76px] md:gap-x-[130px] lg:gap-x-[280px]">
          <p className="lg:ml-10 font-normal text-[var(--color-gray2)]">이름</p>
          <p className="font-normal text-[var(--color-gray2)]">초대자</p>
          <p className="lg:ml-6 font-normal text-[var(--color-gray2)]">
            수락여부
          </p>
        </div>
      )}
      <div className="scroll-area h-[400px] overflow-y-auto overflow-x-hidden">
        {filteredData.length > 0
          ? filteredData.map((invite, index) => (
              <div
                key={index}
                className="pb-5 mb-[20px] w-[260px] sm:w-[504px] lg:w-[1022px] h-[50px] sm:grid sm:grid-cols-[1fr_1fr_1fr] sm:items-center flex flex-col gap-2 border-b border-[var(--color-gray4)]"
              >
                <p className="lg:ml-21 ml-9 flex justify-left mt-1 w-full">
                  {invite.title}
                </p>
                <p className="lg:ml-12 ml-9 justify-center mt-1">
                  {invite.nickname}
                </p>
                <div className="lg:mr-2 flex gap-2 mt-1 justify-between sm:justify-start">
                  <button className="cursor-pointer bg-[var(--primary)] text-white px-3 py-1 rounded-md w-[84px] h-[32px]">
                    수락
                  </button>
                  <button className="cursor-pointer border px-3 py-1 rounded-md w-[84px] h-[32px] text-[var(--primary)] border-[var(--color-gray3)]">
                    거절
                  </button>
                </div>
              </div>
            ))
          : !hasMore && <NoDashboardMessage searchTitle={searchTitle} />}

        {filteredData.length > 0 && !hasMore && (
          <p className="text-center text-gray-400 py-4">
            더 이상 초대 목록이 없습니다.
          </p>
        )}

        {hasMore && (
          <div ref={observerRef} className="h-[50px] bg-transparent"></div> // 마지막 요소로 스크롤을 감지
        )}
      </div>
    </div>
  );
}

export default function InvitedDashBoard() {
  const [searchTitle, setSearchTitle] = useState("");

  const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.target.value);
  };

  // invitedData가 비어 있으면 EmptyInvitations만 렌더링
  if (invitedData.length === 0) {
    return <EmptyInvitations />;
  }

  return (
    <div>
      <div className="relative bg-white rounded-lg shadow-md w-[260px] sm:w-[504px] lg:w-[1022px] h-[770px] sm:h-[592px] lg:h-[620px] max-w-none mx-auto">
        <div className="p-6 relative w-[966px] h-[104px]">
          <div className="flex justify-between items-center mb-[32px]">
            <p className="text-xl sm:text-2xl font-bold">초대받은 대시보드</p>
          </div>
          <div className="relative w-[260px] sm:w-[448px] lg:w-[966px]">
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
        <InvitedList searchTitle={searchTitle} />
      </div>
    </div>
  );
}
