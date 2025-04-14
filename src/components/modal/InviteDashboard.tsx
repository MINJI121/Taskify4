import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormModal from "@/components/modal/FormModal";

export default function InviteDashboard({
  onClose,
  onUpdate,
}: {
  onClose: () => void;
  onUpdate?: () => void;
}) {
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

        if (onUpdate) onUpdate();

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
      onUpdate?.();
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
    <FormModal
      title="초대하기"
      inputLabel="이메일"
      inputValue={email}
      inputPlaceholder="이메일을 입력해 주세요"
      isInputValid={isValidEmail(email)}
      onInputChange={setEmail}
      onSubmit={handleSubmit}
      submitText="초대"
      errorMessage={
        email && !isValidEmail(email) ? "이메일 형식을 확인해 주세요." : ""
      }
      onClose={onClose}
    />
  );
}
