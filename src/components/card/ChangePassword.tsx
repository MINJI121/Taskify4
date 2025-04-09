import { useState } from "react";
import { useRouter } from "next/router";
import { changePassword } from "@/api/changepassword";
import Input from "@/components/input/Input";
import { toast } from "react-toastify";

export default function ChangePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkNewpassword, setCheckNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordMismatch =
    !!checkNewpassword && checkNewpassword !== newPassword;
  const isDisabled =
    !password ||
    !newPassword ||
    !checkNewpassword ||
    isPasswordMismatch ||
    password.length < 8;

  const handleChangePassword = async () => {
    if (isDisabled) return;

    setIsSubmitting(true);

    const result = await changePassword({ password, newPassword });

    if (!result.success) {
      const msg =
        result.status === 400
          ? result.message || "현재 비밀번호가 올바르지 않습니다."
          : "비밀번호 변경 중 오류가 발생했습니다.";
      toast.error(msg);
      setIsSubmitting(false);

      return;
    }
    toast.success("비밀번호가 변경되었습니다.");
    setPassword("");
    setNewPassword("");
    setCheckNewPassword("");
    setIsSubmitting(false);
  };

  return (
    <div
      className="flex flex-col w-[284px] sm:w-[544px] lg:w-[620px] min:h-[454px] sm:min-h-[466px]
     bg-white rounded-[16px] p-[24px]"
    >
      <h2 className="text-black3 text-[18px] sm:text-[24px] font-bold mb-4">
        비밀번호 변경
      </h2>

      <div className="flex flex-col text-black3 my-3 gap-4">
        <Input
          type="password"
          name="password"
          label="현재 비밀번호"
          labelClassName="text-[14px] sm:text-base"
          placeholder="현재 비밀번호 입력"
          value={password}
          onChange={setPassword}
          pattern=".{8,}"
          className="max-w-[624px] "
        />
        <Input
          type="password"
          name="password"
          label="새 비밀번호"
          labelClassName="text-[14px] sm:text-base"
          placeholder="새 비밀번호 입력"
          value={newPassword}
          onChange={setNewPassword}
          pattern=".{8,}"
          invalidMessage="8자 이상 입력해주세요."
          className="max-w-[624px]"
        />
        <Input
          type="password"
          name="passwordCheck"
          label="새 비밀번호 확인"
          labelClassName="text-[14px] sm:text-base"
          placeholder="새 비밀번호 입력"
          value={checkNewpassword}
          onChange={(value) => setCheckNewPassword(value)}
          forceInvalid={isPasswordMismatch}
          invalidMessage="비밀번호가 일치하지 않습니다."
          className="max-w-[624px]"
        />
        {isPasswordMismatch && (
          <p className="font-14r block text-[var(--color-red)]">
            비밀번호가 일치하지 않습니다.
          </p>
        )}

        <button
          className={`w-full h-[54px] 
          rounded-[8px] text-lg font-medium text-white
          ${
            isDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-[var(--primary)] text-white cursor-pointer"
          }`}
          onClick={() => handleChangePassword()}
          disabled={isDisabled || isSubmitting}
        >
          변경
        </button>
      </div>
    </div>
  );
}
