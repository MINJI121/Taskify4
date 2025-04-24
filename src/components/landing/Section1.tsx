import { useRouter } from "next/router";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import GuestModeButton from "../button/GuestModeButton";

export default function Section1() {
  const user = useUserStore((state) => state.user);
  const isLoggedIn = !!user;
  const router = useRouter();

  const handleMainClick = () => {
    if (isLoggedIn) {
      router.push("/mydashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="w-full bg-black text-white px-4 pt-[94px] sm:pt-[42px] flex flex-col items-center">
      {/* 히어로 이미지 */}
      <div className="w-full px-4 sm:px-6 md:px-8 flex justify-center">
        <div className="w-full max-w-[722px]">
          <Image
            src="/images/landing_hero.png"
            alt="Taskify 히어로 이미지"
            width={722}
            height={422}
            className="w-full h-auto object-contain"
            priority
          />
        </div>
      </div>

      {/* 메인 타이틀 */}
      <div className="mt-[26px] sm:mt-[60px] text-center">
        <span className="text-[40px] sm:text-[56px] md:text-[76px] font-bold leading-[48px] sm:leading-[72px] tracking-[-2px]">
          새로운 일정 관리{" "}
        </span>
        <span className="text-[42px] sm:text-[70px] md:text-[90px] font-bold leading-[51px] sm:leading-[70px] tracking-[-1px] text-primary">
          Taskify
        </span>
      </div>

      {/* 설명 문구 (비어있으면 지워도 됨) */}
      <span className="mt-6 text-14-m text-gray3 sm:mt-[18px] text-center">
        {/* 설명 문구 필요시 여기에 추가 */}
      </span>

      {/* CTA 버튼들 */}
      <div
        className="sm:mt-[70px] mt-[45px] flex gap-4 flex-col sm:flex-row
      min-w-0 w-full sm:max-w-[420px] max-w-[280px]"
      >
        <GuestModeButton />
        <button
          onClick={handleMainClick}
          className="flex items-center justify-center
          w-full h-[54px]
          rounded-lg bg-primary cursor-pointer
          text-white font-medium sm:text-[18px] text-[16px]"
        >
          {isLoggedIn ? "대시보드 이동하기" : "로그인하기"}
        </button>
      </div>
    </section>
  );
}
