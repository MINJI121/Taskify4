import { useState, useEffect, useCallback } from "react";
import Pagination from "./TablePagination";
import InviteDashboard from "../modal/InviteDashboard";
import { apiRoutes } from "@/api/apiRoutes";
import axiosInstance from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const InviteRecords = ({
  dashboardId,
}: {
  dashboardId: string;
  onUpdate?: () => void;
}) => {
  const [inviteList, setInviteList] = useState<
    Array<{
      id: number;
      email: string;
    }>
  >([]);

  /* 초대내역 목록 api 호출*/

  const fetchMembers = useCallback(async () => {
    try {
      const dashboardIdNumber = Number(dashboardId);
      const res = await axiosInstance.get(
        apiRoutes.dashboardInvite(dashboardIdNumber),
        {
          params: {
            dashboardId,
          },
        }
      );
      if (res.data && Array.isArray(res.data.invitations)) {
        // 이메일 리스트를 객체 배열로 저장
        const inviteData = res.data.invitations.map(
          (item: { id: number; invitee: { email: string } }) => ({
            id: item.id,
            email: item.invitee.email,
          })
        );
        setInviteList(inviteData);
      }
    } catch (error) {
      console.error("초대내역 불러오는데 오류 발생:", error);
    }
  }, [dashboardId]);

  useEffect(() => {
    if (dashboardId) {
      fetchMembers();
    }
  }, [dashboardId]);

  /* 초대 취소 버튼 */
  const handleCancel = async (id: number) => {
    const dashboardIdNumber = Number(dashboardId);
    if (!dashboardId) return;
    try {
      await axiosInstance.delete(
        apiRoutes.dashboardInviteDelete(dashboardIdNumber, id)
      );
      setInviteList((prev) => prev.filter((invite) => invite.id !== id));
      toast.success("초대가 취소되었습니다.");
    } catch (error) {
      console.error("초대 취소 실패:", error);
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          toast.error("초대 취소에 실패했습니다.");
          return;
        } else if (error.response?.status === 404) {
          toast.error("대시보드가 존재하지 않습니다.");
          return;
        } else {
          toast.error("오류가 발생했습니다.");
          return;
        }
      } else {
        toast.error("네트워크 오류가 발생했습니다.");
        return;
      }
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  /* 페이지네이션 */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(inviteList.length / itemsPerPage));

  const paginatedInvitation = Array.isArray(inviteList)
    ? inviteList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  /*버튼(이전, 다음)*/
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div
      className="relative min-h-[312px] lg:w-[620px] sm:w-[544px] w-[284px]
    bg-white rounded-[12px] p-[24px] flex flex-col"
    >
      <div className="w-full flex justify-center">
        {/* 내부 아이템 컨테이너 */}
        <div className="flex flex-col lg:w-[564px] md:w-[488px] w-[252px]">
          {/* 헤더 */}
          <div className="flex justify-between">
            <p className="text-black3 font-bold sm:text-[24px] text-[20px]">
              초대 내역
            </p>

            {/* 페이지네이션 + 초대하기 버튼 컨테이너 */}
            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
              {/* 페이지네이션 */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrev={handlePrevPage}
                onNext={handleNextPage}
              />

              {/* 초대하기 버튼 (모바일에서 페이지네이션 아래로 이동) */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="cursor-pointer sm:w-[105px] w-[86px] sm:h-[32px] h-[26px]
                flex items-center justify-center gap-2
                bg-primary rounded-[4px]
                text-white font-normal sm:text-[14px] text-[12px]"
              >
                <img
                  src="/svgs/add_white_box.svg"
                  alt="icon"
                  className="w-4 h-4"
                />
                초대하기
              </button>
              {isModalOpen && (
                <InviteDashboard
                  onClose={() => setIsModalOpen(false)}
                  onUpdate={fetchMembers}
                />
              )}
            </div>
          </div>

          {/* 구성원 리스트 */}
          <p className="mt-6 text-gray2 font-normal text-[14px] sm:text-[16px]">
            이메일
          </p>

          <ul>
            {paginatedInvitation.map((invite, index) => (
              <li
                key={index}
                className={`flex items-center justify-between sm:mt-4 sm:pb-4 mt-3 pb-3 ${
                  index !== paginatedInvitation.length - 1
                    ? "border-b border-gray-200"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <p className="text-black3 font-normal sm:text-[16px] text-[14px]">
                    {invite.email}
                  </p>{" "}
                  {/* 이메일 출력 */}
                </div>
                <button
                  onClick={() => handleCancel(invite.id)}
                  className="cursor-pointer px-2 py-1 h-[32px] sm:h-[32px] w-[52px] sm:w-[84px] md:w-[84px]
                  border border-gray3 text-primary rounded-md hover:bg-gray-100
                  font-normal sm:text-[14px] text-[12px]"
                >
                  취소
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InviteRecords;
