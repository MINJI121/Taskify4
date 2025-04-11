import clsx from "clsx";
import Image from "next/image";

interface Section3Props {
  src: string;
  alt: string;
  padding: "sm" | "md" | "lg";
  height: number;
  title: string;
  description: string;
}

export default function Section3({
  src,
  alt,
  padding,
  height,
  title,
  description,
}: Section3Props) {
  const paddingClasses = clsx({
    "py-[68px]": padding === "lg",
    "py-[32px]": padding === "md",
    "pb-[18px] pt-[11px]": padding === "sm",
  });

  return (
    <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[360px] lg:max-w-[378px] mx-auto grid rounded-lg overflow-hidden shadow-sm">
      {/* 상단 이미지 영역 */}
      <div
        className={clsx(
          "bg-[var(--color-black4)] flex justify-center items-center min-h-[180px]",
          paddingClasses
        )}
      >
        <Image src={src} width={300} height={height} alt={alt} />
      </div>

      {/* 하단 텍스트 영역 */}
      <div className="flex flex-col gap-[18px] bg-[var(--color-black2)] px-8 py-[33px] text-[var(--color-white)]">
        <p className="font-18b">{title}</p>
        <p className="font-16m text-[var(--color-gray3)]">{description}</p>
      </div>
    </div>
  );
}
