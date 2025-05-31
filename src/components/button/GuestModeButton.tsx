import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import { postAuthData } from "@/api/auth";
import { getUserInfo } from "@/api/users";
import { toast } from "react-toastify";

const GUEST_CREDENTIALS = {
  email: "guest@gmail.com",
  password: "qwer1155",
};

export default function GuestModeButton() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const handleGuestLogin = async () => {
    try {
      const response = await postAuthData(GUEST_CREDENTIALS);
      const token = response.accessToken;
      localStorage.setItem("accessToken", token);

      const userData = await getUserInfo();
      setUser(userData);
      router.push("/mydashboard");
      toast.success("게스트 모드로 로그인되었습니다.");
    } catch (error) {
      console.error("게스트 로그인 실패:", error);
      toast.error("게스트 로그인에 실패했습니다.");
    }
  };

  return (
    <button
      onClick={handleGuestLogin}
      className="flex items-center justify-center
      w-full h-[54px]
      rounded-lg bg-white cursor-pointer
      text-primary font-medium sm:text-[18px] text-[16px]"
    >
      게스트 모드
    </button>
  );
}
