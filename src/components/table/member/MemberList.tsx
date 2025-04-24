import { useState, useEffect } from "react";
import Pagination from "../TablePagination";
import RandomProfile from "@/components/common/RandomProfile";
import { MemberType } from "@/types/users";
import { getMembers } from "@/api/members";
import Image from "next/image";
import DelteMemberModal from "@/components/modal/DeleteMemberModal";

interface HeaderBebridgeProps {
  dashboardId?: string | string[];
}

const MemberList: React.FC<HeaderBebridgeProps> = ({ dashboardId }) => {
  const [members, setMembers] = useState<MemberType[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* 페이지네이션 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const totalPages = Math.ceil(members.length / itemsPerPage);

  const paginatedMembers = members.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const closeModal = () => {
    setIsModalOpen(false);
  };

  /* 페이지네이션 */
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  /*멤버 목록 api 호출*/
  const fetchMembers = async () => {
    try {
      if (dashboardId) {
        const members = await getMembers({
          dashboardId: Number(dashboardId),
        });
        setMembers(members);
      }
    } catch (error) {
      console.error("멤버 불러오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [dashboardId]);

  return (
    <div className="min-h-[312px] lg:w-[620px] sm:w-[544px] w-[284px] bg-white rounded-[12px] p-[24px] flex flex-col">
      <div className="w-full flex justify-center">
        {/* 내부 아이템 컨테이너 */}
        <div className="flex flex-col lg:w-[564px] md:w-[488px] w-[252px]">
          {/* 헤더 */}
          <div className="flex justify-between">
            <p className="text-left text-black3 text-[20px] sm:text-[24px] font-bold">
              구성원
            </p>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrev={handlePrevPage}
              onNext={handleNextPage}
            />
          </div>

          {/* 구성원 리스트 */}
          <div className="w-full mt-6">
            <p className="mt-6 mb-4 text-gray2 font-normal text-[14px] sm:text-[16px]">
              이름
            </p>

            <ul>
              {paginatedMembers.map((member, index) => (
                <li
                  key={index}
                  className={`sm:mt-4 sm:pb-4 mt-3 pb-3 flex items-center justify-between ${
                    index !== paginatedMembers.length - 1
                      ? "border-b border-gray-200"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {member.profileImageUrl ? (
                      <div
                        className="relative w-[34px] h-[34px] md:w-[38px] md:h-[38px]
                      rounded-full overflow-hidden"
                      >
                        <Image
                          src={member.profileImageUrl}
                          alt={member.nickname}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <RandomProfile
                        userId={member.id}
                        name={member.nickname}
                        className="w-[34px] h-[34px] md:w-[38px] md:h-[38px]"
                      />
                    )}

                    <p className="text-black3 font-normal sm:text-[16px] text-[14px]">
                      {member.nickname}
                      {member.isOwner && "(소유자)"}
                    </p>
                  </div>

                  {!member.isOwner && (
                    <>
                      <button
                        onClick={() => {
                          setSelectedMemberId(member.id);
                          setIsModalOpen(true);
                        }}
                        className="cursor-pointer px-2 py-1 h-[32px] sm:h-[32px] w-[52px] sm:w-[84px] md:w-[84px]
                        border border-gray3 text-primary rounded-md hover:bg-gray-100
                        font-normal sm:text-[14px] text-[12px]"
                      >
                        삭제
                      </button>

                      {isModalOpen && selectedMemberId !== null && (
                        <DelteMemberModal
                          isOpen={isModalOpen}
                          onClose={closeModal}
                          id={selectedMemberId}
                          memberDelete={fetchMembers}
                        />
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberList;
