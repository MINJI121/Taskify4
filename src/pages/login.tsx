import { useState } from "react";
import Input from "@/components/input/Input";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--color-gray5)] py-10">
      <div className="text-center mb-[40px]">
        <img
          src="/svgs/main-logo.svg"
          alt="태스키파이 로고 이미지"
          className="w-[200px] h-[280px] relative"
        />
        <p className="font-20m text-black3">오늘도 만나서 반가워요!</p>
      </div>

      <form className="flex flex-col w-[350px] md:w-[520px] gap-[20px] font-16r text-black3">
        <Input
          type="email"
          name="email"
          label="이메일"
          placeholder="이메일을 입력해 주세요"
          onChange={setEmail}
          pattern="^[\w.-]+@[\w.-]+\.\w{2,}$"
          invalidMessage="올바른 이메일 주소를 입력해 주세요"
        />

        <Input
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          onChange={setPassword}
          pattern=".{8,}"
          invalidMessage="비밀번호는 8자 이상이어야 해요"
        />

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-[50px] rounded-[8px] text-white font-18m transition ${
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
