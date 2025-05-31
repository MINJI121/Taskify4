import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import useUserStore from "@/store/useUserStore";

interface HeaderDefaultProps {
  variant?: "white" | "black";
}

const HeaderDefault: React.FC<HeaderDefaultProps> = ({ variant = "white" }) => {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { clearUser } = useUserStore();

  const isLoggedIn = !!user;
  const isWhite = variant === "white";

  const handleAuthClick = () => {
    if (isLoggedIn) {
      clearUser();
      localStorage.removeItem("accessToken");
      router.push("/");
    } else {
      router.push("/login");
    }
  };

  return (
    <header
      className={`w-full h-[60px] md:h-[70px] flex items-center justify-center
        ${isWhite ? "bg-white border-b-[1px] border-b-gray3" : "bg-black"} `}
    >
      <div className="w-full flex items-center justify-between px-[24px] md:px-[40px] lg:px-[70px]">
        <div className="flex items-center cursor-pointer">
          <Image
            src={
              isWhite ? "/svgs/logo-large.svg" : "/svgs/logo-large-white.svg"
            }
            alt="Taskify Logo"
            onClick={() => router.push(`/`)}
            width={121}
            height={39}
            className="hidden md:block"
          />
          <Image
            src={
              isWhite ? "/svgs/small-logo.svg" : "/svgs/logo-small-white.svg"
            }
            alt="Taskify Mobile Logo"
            onClick={() => router.push(`/`)}
            width={24}
            height={27}
            className="block md:hidden"
          />
        </div>
        <div className="flex space-x-[24px] md:space-x-[36px]">
          <button
            onClick={handleAuthClick}
            className={`text-sm md:text-base cursor-pointer
              ${isWhite ? "text-black3" : "text-white"}`}
          >
            {isLoggedIn ? "로그아웃" : "로그인"}
          </button>
          {!isLoggedIn && (
            <button
              onClick={() => router.push(`/signup`)}
              className={`text-sm md:text-base cursor-pointer
              ${isWhite ? "text-black3" : "text-white"}`}
            >
              회원가입
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderDefault;
