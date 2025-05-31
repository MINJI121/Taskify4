import Image from "next/image";

function NoResultDashBoard({ searchTitle }: { searchTitle: string }) {
  return (
    <div className="w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col justify-center items-center">
      <Image
        src="/svgs/unsubscribe.svg"
        alt="검색 결과 없을때 아이콘"
        width={60}
        height={60}
        className="sm:w-[100px] sm:h-[100px] w-[60px] h-[60px] mb-2"
      />
      <p className="sm:text-lg text-xs leading-[26px] text-gray2 whitespace-nowrap">
        <span className="text-primary mr-1">{searchTitle}</span>
        대시보드가 없습니다.
      </p>
    </div>
  );
}

export default NoResultDashBoard;
