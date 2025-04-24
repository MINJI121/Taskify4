const SkeletonUser = () => {
  return (
    <div className="flex items-center pr-[10px] md:pr-[30px] lg:pr-[80px] gap-[12px] animate-pulse">
      <div className="w-[34px] h-[34px] md:w-[38px] md:h-[38px] bg-gray2 rounded-full" />
      <div className="hidden md:block w-[60px] h-[16px] bg-gray2 rounded-md" />
    </div>
  );
};

export default SkeletonUser;
