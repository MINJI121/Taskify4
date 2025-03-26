import { useState } from "react";
import Pagination from "./TablePagination";

const InviteRecords = () => {
  const [invitelog, setInvitelog] = useState([
    // 나중에 api 데이터로 변경
    { email: "codeit1@codeit.com" },
    { email: "codeit2@codeit.com" },
    { email: "codeit3@codeit.com" },
    { email: "codeit4@codeit.com" },
    { email: "codeit5@codeit.com" },
    { email: "codeit6@codeit.com" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(invitelog.length / itemsPerPage);

  const paginatedInvitation = invitelog.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /*버튼(삭제, 이전, 다음)*/
  const handleDelete = (email: string) => {
    setInvitelog(invitelog.filter((invitelog) => invitelog.email !== email));
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="relative bg-white p-4 rounded-lg shadow-md max-w-md w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
      <div className="flex justify-between items-start sm:items-center">
        {/* 제목 */}
        <p className="sm:text-2xl text-xl font-bold">초대 내역</p>

        {/* 페이지네이션 + 초대하기 버튼 컨테이너 */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {/* 페이지네이션 */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={handlePrevPage}
            onNext={handleNextPage}
          />

          {/* 초대하기 버튼 (모바일에서 페이지네이션 아래로 이동) */}
          <button className="cursor-pointer sm:text-[14px] text-[12px] sm:w-[105px] w-[86px] sm:h-[32px] h-[26px] rounded-[4px] bg-[#5534DA] text-white flex items-center justify-center gap-2">
            <img src="/svgs/add_white_box.svg" alt="icon" className="w-4 h-4" />
            초대하기
          </button>
        </div>
      </div>

      {/* 구성원 리스트 */}
      <p className="sm:text-base text-sm text-gray-500 mt-6 ml-4">이메일</p>
      <ul>
        {paginatedInvitation.map((invitelog, index) => (
          <li
            key={index}
            className={`flex items-center justify-between p-4 ${
              index !== paginatedInvitation.length - 1
                ? "border-b border-gray-200"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <p className="sm:text-base text-sm">{invitelog.email}</p>
            </div>
            <button
              onClick={() => handleDelete(invitelog.email)}
              className="cursor-pointer font-medium  sm:text-sm text-xs h-[32px] sm:h-[32px] w-[52px] sm:w-[84px] md:w-[84px] border border-gray-300 text-indigo-600 px-2 py-1 rounded-md hover:bg-gray-100"
            >
              취소
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InviteRecords;
