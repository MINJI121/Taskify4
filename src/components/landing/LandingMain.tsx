import Section1 from "./Section1";
import Section2 from "./Section2";
import Section3 from "./Section3";

export default function LandingMain() {
  return (
    <main className="w-full bg-[var(--color-black)] text-[var(--color-white)] flex flex-col items-center px-4">
      {/* 히어로 섹션 */}
      <Section1 />

      {/* Section2와 Section3 영역 */}
      <div className="md:mt-[180px] mt-[80px] md:mb-[160px] mb-[80px] w-full flex flex-col items-center">
        {/* Section2: 우선순위 & 해야 할 일 등록 */}
        <Section2 />

        {/* Section3 영역 */}
        <div className="mt-[120px] w-full max-w-[1200px] px-4 lg:px-0 flex flex-col gap-[36px]">
          <p className="text-[24px] sm:text-[28px] font-bold leading-[36px] sm:leading-[42px] text-[var(--color-white)] text-center sm:text-left">
            생산성을 높이는 다양한 설정 ⚡
          </p>

          {/* Section3 카드들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] md:gap-[33px] w-full justify-center">
            <Section3
              src="/images/landing3.png"
              alt="대시보드 설정 이미지"
              height={124}
              padding="lg"
              title="대시보드 설정"
              description="대시보드 사진과 이름을 변경할 수 있어요"
            />
            <Section3
              src="/images/landing4.png"
              alt="초대 기능 이미지"
              height={231}
              padding="sm"
              title="초대"
              description="새로운 팀원을 초대할 수 있습니다."
            />
            <Section3
              src="/images/landing5.png"
              alt="구성원 관리 이미지"
              height={196}
              padding="md"
              title="구성원"
              description="구성원을 초대하고 내보낼 수 있어요."
            />
          </div>
        </div>
      </div>
    </main>
  );
}
