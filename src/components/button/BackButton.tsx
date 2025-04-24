import React from "react";
import Image from "next/image";

const BackButton = () => {
  return (
    <div className="flex gap-[8px]">
      <Image
        onClick={() => history.back()}
        src="/svgs/arrow-backward-black.svg"
        alt="돌아가기"
        width={20}
        height={20}
        className="cursor-pointer"
      />
      <button
        onClick={() => history.back()}
        className="flex justify-start text-black3 text-[14px] sm:text-[16px] font-medium cursor-pointer"
      >
        돌아가기
      </button>
    </div>
  );
};

export default BackButton;
