import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Input from "../input/Input";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InviteDashboard({ onClose }: { onClose?: () => void }) {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { dashboardId } = router.query;

  const [invitelist, setInviteList] = useState<{ email: string }[]>([]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

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
          // 초대내역 리스트
          const inviteData = res.data.invitations.map(
            (item: { invitee: { email: string } }) => ({
              email: item.invitee.email,
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

  /* 초대하기 버튼 */
  const handleSubmit = async () => {
    const dashboardIdNumber = Number(dashboardId);
    if (!dashboardId || !email) return;

    if (invitelist?.some((invite) => invite.email === email)) {
      toast.error("이미 초대한 멤버입니다.");
      return;
    }

    try {
      await axiosInstance.post(apiRoutes.dashboardInvite(dashboardIdNumber), {
        email,
      });

      toast.success("멤버 초대에 성공했습니다.");
      onClose?.();
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          toast.error("초대 권한이 없습니다.");
          return;
        } else if (error.response?.status === 404) {
          toast.error("대시보드 또는 유저가 존재하지 않습니다.");
          return;
        } else if (error.response?.status === 409) {
          toast.error("이미 대시보드에 초대된 멤버입니다.");
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
          placeholder="이메일을 입력해 주세요"
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
            초대
          </button>
        </div>
      </div>
    </div>
  );
}
