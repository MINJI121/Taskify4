import { useState, useEffect } from "react";
import Pagination from "../TablePagination";
import RandomProfile from "./RandomProfile";
import { MemberType } from "@/components/Gnb/members";
import { getMembers } from "@/api/members";

interface HeaderBebridgeProps {
  dashboardId?: string | string[];
}

const MemberList: React.FC<HeaderBebridgeProps> = ({ dashboardId }) => {
  const [members, setMembers] = useState<MemberType[]>([]);

  /* 페이지네이션 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /*버튼(삭제, 이전, 다음)*/
  const handleDelete = (nickname: string) => {
    setMembers(members.filter((member) => member.nickname !== nickname));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  /*멤버 목록 api 호출*/
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        if (dashboardId) {
          const members = await getMembers(dashboardId);
          setMembers(members);
          console.log("member_list", members);
        }
      } catch (error) {
        console.error("멤버 불러오기 실패:", error);
      }
    };

    fetchMembers();
  }, [dashboardId]);

  return (
    <div className="lg:h-[404px] relative bg-white p-6 rounded-lg max-w-md w-full lg:w-[620px] sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <p className="text-xl sm:text-2xl font-bold">구성원</p>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={handlePrevPage}
          onNext={handleNextPage}
        />
      </div>

      {/* 구성원 리스트 */}
      <p className="text-sm sm:text-base text-gray-500 mt-6">이름</p>

      <ul>
        {paginatedMembers.map((member, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-4 ${
              index !== paginatedMembers.length - 1
                ? "border-b border-gray-200"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <RandomProfile name={member.nickname} index={index} />
              <p className="text-sm sm:text-base">{member.nickname}</p>
            </div>
            <button
              onClick={() => handleDelete(member.nickname)}
              className="text-md-Medium cursor-pointer font-medium text-sm sm:text-base h-[32px] sm:h-[32px] w-[52px] sm:w-[84px] md:w-[84px] border border-gray-300 text-indigo-600 px-2 py-1 rounded-md hover:bg-gray-100"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
