import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useUserStore from "@/store/useUserStore";
import { getUserInfo } from "@/api/users";
import { postAuthData } from "@/api/auth";
import Link from "next/link";
import Input from "@/components/input/Input";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const isFormValid = Object.values(values).every((v) => v.trim() !== "");

  const handleChange = (name: string) => (value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = values;

    try {
      const response = await postAuthData({ email, password });
      const token = response.accessToken;
      localStorage.setItem("accessToken", token);
      // 로그인 성공 시 사용자 정보 요청
      const userData = await getUserInfo();
      // Zustand에 저장
      useUserStore.getState().setUser(userData);

      router.push("/mydashboard");
    } catch (error) {
      console.error("로그인 실패:", error);
      toast.error("로그인에 실패했습니다.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white py-10">
      <div className="flex flex-col items-center justify-center mb-[30px]">
        <Image
          src="/svgs/main-logo.svg"
          alt="태스키파이 로고 이미지"
          width={120}
          height={120}
          className="object-contain sm:w-[180px]"
        />
        <p className="text-black3 font-midium text-[18px] sm:text-[20px]">
          오늘도 만나서 반가워요!
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-[350px] md:w-[520px] gap-[12px] sm:gap-[18px]
        font-16r text-black3"
      >
        <Input
          type="email"
          name="email"
          label="이메일"
          placeholder="이메일을 입력해 주세요"
          onChange={handleChange("email")}
          invalidMessage="올바른 이메일 주소를 입력해 주세요"
          className="bg-white"
        />

        <Input
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          onChange={handleChange("password")}
          pattern=".{8,}"
          invalidMessage="비밀번호는 8자 이상이어야 해요"
          className="bg-white"
        />

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-[50px] rounded-[8px] text-white font-18m transition mt-1 ${
            isFormValid
              ? "bg-[var(--primary)] cursor-pointer hover:opacity-90}"
              : "bg-[var(--color-gray2)] cursor-not-allowed"
          }`}
        >
          로그인
        </button>

        <span className="font-16r text-center text-black3">
          회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="text-[var(--primary)] underline hover:opacity-90"
          >
            회원가입하기
          </Link>
        </span>
      </form>
    </div>
  );
}
