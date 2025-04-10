import { useState, useEffect } from "react";
import Pagination from "./TablePagination";
import InviteDashboard from "../modal/InviteDashboard";
import { apiRoutes } from "@/api/apiRoutes";
import axiosInstance from "@/api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const InviteRecords = ({ dashboardId }: { dashboardId: string }) => {
  const [inviteList, setInviteList] = useState<
    Array<{
      id: number;
      email: string;
    }>
  >([]);

  /* 초대내역 목록 api 호출*/
  useEffect(() => {
    const fetchMembers = async () => {
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
            (item: { id: number; invite: { email: string } }) => ({
              id: item.id,
              email: item.invite.email,
            })
          );
          setInviteList(inviteData);
        }
      } catch (error) {
        console.error("초대내역 불러오는데 오류 발생:", error);
      }
    };

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
    <div className="lg:w-[620px] w-[284px] sm:w-[544px] min:h-[337px] sm:h-[430px] relative p-6 rounded-lg bg-white">
      <div className="flex justify-between items-start sm:items-center">
        {/* 제목 */}
        <p className="text-black3 text-[20px] sm:text-[24px] font-bold">
          초대 내역
        </p>

        {/* 페이지네이션 + 초대하기 버튼 컨테이너 */}
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-4">
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
            className="cursor-pointer text-[12px] sm:text-[14px] sm:w-[105px] w-[86px] sm:h-[32px] h-[26px] rounded-[4px] bg-[#5534DA] text-white flex items-center justify-center gap-2"
          >
            <img src="/svgs/add_white_box.svg" alt="icon" className="w-4 h-4" />
            초대하기
          </button>
          {isModalOpen && (
            <InviteDashboard onClose={() => setIsModalOpen(false)} />
          )}
        </div>
      </div>

      {/* 구성원 리스트 */}
      <p className="sm:text-base text-sm text-gray-500 mt-6">이메일</p>
      <ul>
        {paginatedInvitation.map((invite, index) => (
          <li
            key={index}
            className={`flex items-center justify-between mt-3 pb-4 ${
              index !== paginatedInvitation.length - 1
                ? "border-b border-gray-200"
                : ""
            }`}
          >
            <div className="flex items-center gap-4">
              <p className="sm:text-base text-sm">{invite.email}</p>{" "}
              {/* 이메일 출력 */}
            </div>
            <button
              onClick={() => handleCancel(invite.id)}
              className="text-12m cursor-pointer sm:font-sm h-[32px] sm:h-[32px] w-[52px] sm:w-[84px] md:w-[84px] border border-[var(--color-gray3)] text-[var(--primary)] px-2 py-1 rounded-md hover:bg-gray-100"
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
