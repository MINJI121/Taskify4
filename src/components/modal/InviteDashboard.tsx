import { useState } from "react";
import { useRouter } from "next/router";
import Input from "../input/Input";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { AxiosError } from "axios";

export default function InviteDashboard({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { dashboardId } = router.query;

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  /* 초대하기 버튼 */
  const handleSubmit = async () => {
    const dashboardIdNumber = Number(dashboardId);
    if (!dashboardId || !email) return;

    const payload = {
      email,
    };

    try {
      const response = await axiosInstance.post(
        apiRoutes.DashboardInvite(dashboardIdNumber),
        payload
      );
      onClose?.(); // 함수 있을때만 실행
      window.location.reload();
    } catch (error) {
      console.error("초대 실패:", error);

      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          alert("초대 권한이 없습니다.");
        } else if (error.response?.status === 404) {
          alert("대시보드 또는 유저가 존재하지 않습니다.");
        } else if (error.response?.status === 409) {
          alert("이미 대시보드에 초대된 멤버입니다.");
        } else {
          alert("오류가 발생했습니다.");
        }
        // Next.js가 감지하기 전에 강제 새로고침 실행 > 추후 더 좋은 방법 있으면 변경
        setTimeout(() => {
          window.location.reload();
        }, 50);
      } else {
        alert("네트워크 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/35 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[327px] sm:w-[568px] sm:h-[279px]">
        <div className="flex justify-between items-center">
          <h2 className="text-sm sm:text-[24px] font-bold">초대하기</h2>
          <Image
            src="/svgs/close-white.svg"
            alt="닫기"
            width={25}
            height={25}
            className="cursor-pointer"
            onClick={onClose}
          ></Image>
        </div>
        <Input
          type="text"
          onChange={setEmail}
          label="이메일"
          labelClassName="text-lg sm:text-base text-black3 mt-6"
          placeholder="이메일을 입력해주세요"
          className="max-w-[620px] mb-1"
        />

        <div className="mt-8 flex justify-between">
          <button
            onClick={onClose}
            className="cursor-pointer sm:w-[256px] sm:h-[54px] w-[295px] h-[54px] rounded-[8px] border border-[var(--color-gray3)] text-[var(--color-gray1)]"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!email || !isValidEmail(email)}
            className={`cursor-pointer sm:w-[256px] sm:h-[54px] w-[295px] h-[54px] rounded-[8px] 
                border border-[var(--color-gray3)] text-[var(--color-white)] 
            ${!email || !isValidEmail(email) ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--primary)]"}`}
          >
            생성
          </button>
        </div>
      </div>
    </div>
  );
}
