import { useState } from "react";
import { useRouter } from "next/router";
import { signUp } from "@/api/users";
import { usePostGuard } from "@/hooks/usePostGuard";
import Image from "next/image";
import Link from "next/link";
import Input from "@/components/input/Input";
import { Modal } from "@/components/modal/Modal";
import { CustomBtn } from "@/components/button/CustomButton";
import { toast } from "react-toastify";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [nickName, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [agree, setAgree] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const router = useRouter();
  const { guard: postGuard, isLoading } = usePostGuard();

  const isFormValid =
    email.trim() !== "" &&
    nickName.trim() !== "" &&
    password.trim() !== "" &&
    passwordCheck.trim() !== "" &&
    agree;

  /*모달 닫고 로그인 페이지 이동*/
  const handleSuccessConfirm = () => {
    setIsSuccessModalOpen(false);
    router.push("/login");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      toast.error("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!isFormValid) return;

    try {
      await postGuard(async () => {
        await signUp({
          payload: {
            email,
            nickname: nickName,
            password,
          },
        });
        setIsSuccessModalOpen(true);
      });
    } catch (error) {
      console.error("회원가입 실패", error);
      toast.error("회원가입에 실패했습니다.");
    }
  };

  return (
    <div
      className="flex flex-col min-h-[calc(var(--vh)_*_100)]
    items-center justify-center
    bg-white py-10"
    >
      <div className="flex flex-col items-center justify-center mb-[30px]">
        <Image
          src="/svgs/main-logo.svg"
          alt="태스키파이 로고 이미지"
          width={120}
          height={120}
          className="object-contain sm:w-[180px]"
        />
        <p className="text-black3 font-midium text-[18px] sm:text-[20px]">
          첫 방문을 환영합니다!
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
          onChange={setEmail}
          pattern="^[\w.-]+@[\w.-]+\.\w{2,}$"
          invalidMessage="올바른 이메일 주소를 입력해 주세요"
          className="bg-white"
        />

        <Input
          type="text"
          name="nickname"
          label="닉네임"
          placeholder="닉네임을 입력해 주세요"
          onChange={setNickname}
          className="bg-white"
          forceInvalid={nickName.length > 10}
          invalidMessage="닉네임은 10자 이하로 입력해 주세요"
        />

        <Input
          type="password"
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력해 주세요"
          onChange={setPassword}
          pattern=".{8,}"
          invalidMessage="영문, 숫자를 포함한 8자 이상 입력해 주세요"
          className="bg-white"
        />

        <Input
          type="password"
          name="passwordCheck"
          label="비밀번호 확인"
          placeholder="비밀번호를 한번 더 입력해 주세요"
          onChange={setPasswordCheck}
          pattern="{passwordCheckPattern}"
          invalidMessage="비밀번호가 일치하지 않습니다."
          className="bg-white"
        />

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
          disabled={!isFormValid || isLoading}
          className={`w-full h-[50px] rounded-[8px] text-white font-18m transition mt-1 ${
            isFormValid
              ? "bg-[var(--primary)] cursor-pointer hover:opacity-90}"
              : "bg-[var(--color-gray2)] cursor-not-allowed"
          }`}
        >
          {isLoading ? "가입 중..." : "가입하기"}
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
      {isSuccessModalOpen && (
        <Modal
          width="w-[300px]"
          height="h-[180px]"
          isOpen={isSuccessModalOpen}
          onClose={handleSuccessConfirm}
          className="flex flex-col items-center justify-center text-center"
        >
          <p className="text-black3 font-16m">
            회원가입에 성공했습니다.
            <br />
            로그인 화면으로 이동합니다.
          </p>
          <CustomBtn
            onClick={handleSuccessConfirm}
            className="w-[180px] h-[40px] bg-[var(--primary)] font-16m text-white rounded-[8px] cursor-pointer"
          >
            확인
          </CustomBtn>
        </Modal>
      )}
    </div>
  );
}
