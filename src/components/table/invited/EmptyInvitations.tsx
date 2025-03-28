function EmptyInvitations() {
  return (
    <div className="relative sm:w-[960px] w-[260px] sm:h-[390px] h:[327px]  rounded-[16px] sm:p-[24px_40px_120px_40px] p-[24px_20px_80px_20px]  bg-white shadow-md">
      <div className="flex justify-between ">
        <p className="sm:text-2xl text-sm font-bold mb-4 ">초대받은 대시보드</p>
      </div>

      <div className="mb-[16px] flex flex-col justify-center items-center h-[calc(100%-40px)]">
        <img
          className="sm:w-[100px] sm:h-[100px] w:-[60px] h:-[60px] mb-2"
          src="/svgs/unsubscribe.svg"
          alt="초대받은 대시보드가 없을 때 아이콘 이미지"
        />
        <p className="sm:text-lg text-xs leading-[26px] text-[#9FA6B2] whitespace-nowrap">
          아직 초대받은 대시보드가 없어요
        </p>
      </div>
    </div>
  );
}

export default EmptyInvitations;
