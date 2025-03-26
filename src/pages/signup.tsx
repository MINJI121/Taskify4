import { useState } from "react";
import Input from "@/components/input/Input";
import Link from "next/link";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [agree, setAgree] = useState(false);

  const isFormValid =
    email.trim() !== "" &&
    nickName.trim() !== "" &&
    password.trim() !== "" &&
    passwordCheck.trim() !== "" &&
    agree;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-gray5)] py-10">
      <div className="text-center mb-[40px]">
        <img
          src="/svgs/main-logo.svg"
          alt="태스키파이 로고 이미지"
          className="w-[200px] h-[280px] relative"
        />
        <p className="font-20m text-black3">첫 방문을 환영합니다!</p>
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
          type="text"
          name="nickname"
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          onChange={setNickname}
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

        <div className="gap-2">
          <Input
            type="password"
            name="passwordCheck"
            label="비밀번호 확인"
            placeholder="비밀번호를 한번 더 입력해 주세요"
            onChange={setPasswordCheck}
            pattern="{password}"
            invalidMessage=""
            className={
              passwordCheck && password !== passwordCheck
                ? "border-[var(--color-red)] focus:border-[var(--color-red)]"
                : ""
            }
          />
          {passwordCheck && password !== passwordCheck && (
            <span className="font-14r text-[var(--color-red)]">
              비밀번호가 일치하지 않습니다.
            </span>
          )}
        </div>

        <label className="flex items-center gap-[8px] font-16r text-black3">
          <input
            type="checkbox"
            checked={agree}
            onChange={() => setAgree(!agree)}
            className="appearance-none w-[20px] h-[20px] border border-[var(--color-gray3)] rounded-[4px] checked:bg-[var(--primary)] checked:border-[var(--primary)] transition"
            style={{
              backgroundImage: "url('/svgs/check.svg')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "20px 20px",
            }}
          />
          이용약관에 동의합니다.
        </label>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full h-[50px] rounded-[8px] text-white font-18m transition ${
            isFormValid
              ? "bg-[var(--primary)] cursor-pointer hover:opacity-90}"
              : "bg-[var(--color-gray2)] cursor-not-allowed"
          }`}
        >
          가입하기
        </button>

        <span className="font-16r text-center text-black3">
          이미 회원이신가요?{" "}
          <Link
            href="/login"
            className="text-[var(--primary)] underline hover:opacity-90"
          >
            로그인하기
          </Link>
        </span>
      </form>
    </div>
  );
}
