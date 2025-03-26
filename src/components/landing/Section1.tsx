import Image from "next/image";
import Link from "next/link";

export default function Section1() {
  return (
    <section className="w-full bg-[var(--color-black)] text-[var(--color-white)] px-4 pt-[94px] sm:pt-[42px] flex flex-col items-center">
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
      <div className="mt-[48px] sm:mt-[26px]">
        <span className="text-[56px] font-bold leading-[72px] tracking-[-2px] sm:text-[40px] sm:leading-[48px]">
          새로운 일정 관리{" "}
        </span>
        <span className="text-[70px] font-bold leading-[70px] tracking-[-1px] text-[var(--primary)] sm:text-[42px] sm:leading-[51px]">
          Taskify
        </span>
      </div>

      {/* 설명 문구 (비어있으면 지워도 됨) */}
      <span className="mt-6 font-14m text-[var(--color-gray3)] sm:mt-[18px] text-center">
        {/* 설명 문구 필요시 여기에 추가 */}
      </span>

      {/* CTA 버튼 */}
      <Link
        href="/login"
        className="mt-[66px] w-[280px] h-[54px] flex items-center justify-center rounded-lg bg-[var(--primary)] text-[var(--color-white)] font-16m sm:mt-[70px]"
      >
        로그인하기
      </Link>
    </section>
  );
}
