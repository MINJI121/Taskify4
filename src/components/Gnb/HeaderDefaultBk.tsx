import React from "react";
import { useRouter } from "next/router";

const HeaderDefaultBk = () => {
  const router = useRouter();
  const goToMain = () => {
    router.push(`/`);
  };
  const goToLogin = () => {
    router.push(`/login`);
  };
  const goToSignUp = () => {
    router.push(`/signup`);
  };

  return (
    <header className="w-full h-[50px] sm:h-[60px] md:h-[70px] flex items-center justify-center bg-black">
      <div className="w-full flex items-center justify-between px-[16px] sm:px-[24px] md:px-[40px] lg:px-[70px]">
        <div className="flex items-center cursor-pointer">
          <img
            src="/svgs/logo-large-white.svg"
            alt="Taskify Logo"
            onClick={goToMain}
            className="h-[39px] hidden md:block"
          />
          <img
            src="/svgs/logo-small-white.svg"
            alt="Taskify Mobile Logo"
            onClick={goToMain}
            className="h-[27px] block md:hidden"
          />
        </div>
        <div className="flex space-x-[24px] md:space-x-[36px]">
          <button
            onClick={goToLogin}
            className="text-sm md:text-base text-white cursor-pointer"
          >
            로그인
          </button>
          <button
            onClick={goToSignUp}
            className="text-sm md:text-base text-white cursor-pointer"
          >
            회원가입
          </button>
        </div>
      </div>
    </header>
  );
};

export default HeaderDefaultBk;
