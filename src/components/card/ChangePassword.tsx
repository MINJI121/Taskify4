import { useState } from "react";
import { changePassword } from "@/api/changepassword";
import MypageModal from "../modal/MypageModal";
import Input from "../input/Input";
import Image from "next/image";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [checkNewpassword, setCheckNewPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCheckNewPassword, setShowCheckNewPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const toggleCheckNewPasswordVisibility = () =>
    setShowCheckNewPassword(!showCheckNewPassword);
  const isPasswordMismatch =
    newPassword && checkNewpassword && newPassword !== checkNewpassword;
  const isDisabled =
    !password ||
    !newPassword ||
    !checkNewpassword ||
    isPasswordMismatch ||
    password.length < 8;

  const handleChangePassword = async () => {
    if (isDisabled) return;

    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    const result = await changePassword({ password, newPassword });

    if (!result.success) {
      const msg =
        result.status === 400
          ? result.message || "현재 비밀번호가 올바르지 않습니다."
          : "비밀번호 변경 중 오류가 발생했습니다.";

      setErrorMessage(msg);
      setShowErrorModal(true);
      setIsSubmitting(false);
      return;
    }

    setSuccessMessage("비밀번호가 성공적으로 변경되었습니다.");
    setShowSuccessModal(true);
    setPassword("");
    setNewPassword("");
    setCheckNewPassword("");
    setIsSubmitting(false);
  };

  return (
    <div className="sm:w-[672px] sm:h-[466px] w-[284px] h-[454px] bg-white rounded-[16px] shadow-md p-[24px] flex flex-col">
      <h2 className="text-[18px] sm:text-[24px] font-bold mb-4">
        비밀번호 변경
      </h2>

      <div>
        <div className="-mt-2">
          <Input
            type="password"
            name="password"
            label="현재 비밀번호"
            labelClassName="font-16r"
            placeholder="현재 비밀번호 입력"
            value={password}
            onChange={setPassword}
            pattern=".{8,}"
            className="max-w-[620px]"
          />
          <Input
            type="password"
            name="password"
            label="새 비밀번호"
            labelClassName="font-16r"
            placeholder="새 비밀번호 입력"
            value={newPassword}
            onChange={setNewPassword}
            pattern=".{8,}"
            invalidMessage="8자 이상 입력해주세요."
            className="max-w-[620px]"
          />

          <label className="mb-2 text-sm sm:text-base text-black mt-3">
            새 비밀번호 확인
          </label>
          <div className="relative w-full">
            <input
              type={showCheckNewPassword ? "text" : "password"}
              value={checkNewpassword}
              placeholder="새 비밀번호 입력"
              onChange={(e) => setCheckNewPassword(e.target.value)}
              className={`mt-3 sm:w-[624px] sm:h-[50px] w-[236px] h-[50px] px-[16px] pr-12 rounded-[8px] transition-colors focus:outline-none
                ${
                  checkNewpassword
                    ? checkNewpassword === newPassword
                      ? "border border-gray-300"
                      : "border border-[var(--color-red)]"
                    : "border border-gray-300 focus:border-purple-500"
                }`}
            />
            <button
              type="button"
              onClick={toggleCheckNewPasswordVisibility}
              className="absolute right-4 top-6 flex size-6 items-center justify-center"
            >
              <Image
                src={
                  showCheckNewPassword
                    ? "/svgs/eye-on.svg"
                    : "/svgs/eye-off.svg"
                }
                alt="비밀번호 표시 토글"
                width={20}
                height={20}
                className=" w-5 h-5"
              />
            </button>

            {checkNewpassword && checkNewpassword !== newPassword && (
              <p className="mt-2 font-16m block text-[var(--color-red)]">
                비밀번호가 일치하지 않습니다.
              </p>
            )}
          </div>
        </div>
      </div>

      {errorMessage && (
        <p className="text-red-500 text-sm mt-4">{errorMessage}</p>
      )}
      {successMessage && (
        <p className="text-green-600 text-sm mt-4">{successMessage}</p>
      )}
      <MypageModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="비밀번호 변경에 성공하였습니다."
      />

      <MypageModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message="비밀번호 변경에 실패하였습니다."
      />
      <button
        className={`mt-2.5 cursor-pointer w-full sm:w-[624px] h-[54px] 
          rounded-[8px] text-lg font-medium  
          ${isDisabled ? "bg-gray-300 cursor-not-allowed" : "bg-[#5A3FFF] text-white"}`}
        onClick={() => handleChangePassword()}
        disabled={isDisabled || isSubmitting}
      >
        변경
      </button>
    </div>
  );
}
