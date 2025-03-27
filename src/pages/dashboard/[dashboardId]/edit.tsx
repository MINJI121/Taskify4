import React from "react";
import { useRouter } from "next/router";
import ChangeBebridge from "@/components/modal/ChangeBebridge";
import HeaderBebridge from "@/components/Gnb/HeaderBebridge";
import MemberList from "@/components/table/member/MemberList";
import SideMenu from "@/components/SideMenu/SideMenu";
import InviteRecords from "@/components/table/InviteRecords";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";

export default function EditDashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;
  const dashboardIdString = Array.isArray(dashboardId)
    ? dashboardId[0]
    : dashboardId;

  const goToDashboard = () => {
    router.push(`/dashboard/${dashboardId}`);
  };

  /* 대시보드 삭제 */
  const handleDelete = async () => {
    const dashboardIdNumber = Number(dashboardId);
    if (!dashboardId) return;
    try {
      const response = await axiosInstance.delete(
        apiRoutes.DashboardDetail(dashboardIdNumber)
      );
      router.push(`/mydashboard`);
    } catch (error) {
      alert("대시보드 삭제에 실패하였습니다 .");
      console.error("초대 실패:", error);

      window.location.reload();
    }
  };

  return (
    <div className="flex h-screen ">
      <SideMenu teamId="13-4" />

      <div className="flex flex-col flex-1">
        {/* HeaderBebridge와 ChangeBebridge는 상단에 배치 */}
        <div className="flex flex-col">
          <HeaderBebridge dashboardId={dashboardId} />
        </div>
        <div className="mt-6 ml-4">
          <button
            onClick={goToDashboard}
            className="cursor-pointer flex items-center gap-2"
          >
            <Image
              src="/svgs/arrow-backward-black.svg"
              alt="돌이가기"
              width={20}
              height={20}
            />
            돌아가기
          </button>
        </div>

        <div className="mt-5 ml-4">
          <ChangeBebridge />
        </div>

        {/* MemberList는 아래쪽에 배치 */}
        <div className="ml-4">
          <MemberList dashboardId={dashboardId} />
        </div>

        <div className="ml-4">
          <InviteRecords dashboardId={dashboardIdString || ""} />{" "}
          {/* undefined일 경우 빈 문자열로 전달*/}
        </div>
        <div className="flex mt-15 sm:mt-0 ml-8">
          <button
            onClick={handleDelete}
            className="text-base sm:text-lg cursor-pointer w-[320px] h-[62px] text-[var(--color-black3)] rounded-[8px] border-[1px] border-[#D9D9D9]"
          >
            대시보드 삭제하기
          </button>
        </div>

        <br />
        <br />
      </div>
    </div>
  );
}
