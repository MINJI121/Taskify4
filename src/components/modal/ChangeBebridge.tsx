import { useState } from "react";
import { useRouter } from "next/router";
import Input from "../input/Input";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";

const ChangeBebridge = () => {
  const router = useRouter();
  const { dashboardId } = router.query; // dashboardId 쿼리값 받기
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const colors = ["#7ac555", "#760DDE", "#FF9800", "#76A5EA", "#E876EA"];

  const handleUpdate = async () => {
    const dashboardIdNumber = Number(dashboardId); // string dashboradId 값 number로 변경
    if (!dashboardId || !title || selected === null) return;

    const payload = {
      title,
      color: colors[selected],
    };

    try {
      const response = await axiosInstance.put(
        apiRoutes.DashboardDetail(dashboardIdNumber),
        payload
      );
      console.log("업데이트 성공:", response.data);
      alert("대시보드가 업데이트되었습니다!"); // 추후에 toast로 변경
      window.location.reload();
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("업데이트에 실패했습니다."); // 추후에 toast로 변경
    }
  };

  return (
    <div className="sm:w-[620px] sm:h-[344px] w-[327px] h-[312px] bg-white sm:rounded-[16px] rounded-[8px] p-[24px] flex flex-col">
      <h2 className="text-sm sm:text-[24px] font-bold">비브리지</h2>
      <Input
        type="text"
        onChange={setTitle}
        label="대시보드 이름"
        labelClassName="text-lg sm:text-base text-black3 mt-6"
        placeholder="뉴프로젝트"
        className="max-w-[620px] mb-1"
      />
      <div className="flex mt-3">
        {colors.map((color, index) => (
          <div key={index} className="relative">
            <button
              className={`cursor-pointer w-[30px] h-[30px] rounded-[15px] mr-2`}
              style={{ backgroundColor: color }}
              onClick={() => setSelected(index)} // 색상 선택 시 selected 업데이트
            />
            {selected === index && (
              <Image
                src="/svgs/check.svg"
                alt="선택됨"
                width={23}
                height={23}
                className="cursor-pointer absolute top-4 left-3.5 transform -translate-x-1/2 -translate-y-1/2"
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-8 flex">
        <button
          onClick={handleUpdate} // 버튼 클릭 시 handleUpdate 함수 호출
          disabled={!title || selected === null} // title 또는 color가 없으면 버튼 비활성화
          className={`cursor-pointer sm:w-[564px] sm:h-[54px] w-[252px] h-[54px] rounded-[8px] border border-[var(--color-gray3)] bg-[var(--primary)] text-[var(--color-white)] ${!title || selected === null ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--primary)]"}`}
        >
          변경
        </button>
      </div>
    </div>
  );
};

export default ChangeBebridge;
