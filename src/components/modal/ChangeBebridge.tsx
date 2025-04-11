import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Input from "../input/Input";
import Image from "next/image";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ChangeBebridgeProps {
  onUpdate?: () => void;
}

const ChangeBebridge = ({ onUpdate }: ChangeBebridgeProps) => {
  const router = useRouter();
  const { dashboardId } = router.query;
  const [dashboardDetail, setDashboardDetail] = useState<{ title?: string }>(
    {}
  );
  const [title, setTitle] = useState("");
  const [titleLength, setTitleLength] = useState<number>(0);
  const [selected, setSelected] = useState<number | null>(null);
  const colors = ["#7ac555", "#760DDE", "#FF9800", "#76A5EA", "#E876EA"];
  const maxTitleLength = 30;

  /* 대시보드 이름 데이터 */
  useEffect(() => {
    const fetchDashboardTitle = async () => {
      try {
        const dashboardIdNumber = Number(dashboardId);
        const res = await axiosInstance.get(
          apiRoutes.dashboardDetail(dashboardIdNumber),
          {
            params: {
              dashboardId,
            },
          }
        );
        if (res.data) {
          const dashboardData = res.data;
          setDashboardDetail(dashboardData);
        }
      } catch (error) {
        console.error("대시보드 상세내용 불러오는데 오류 발생:", error);
        toast.error("대시보드를 불러오는 데 실패했습니다.");
      }
    };
    if (dashboardId) {
      fetchDashboardTitle();
    }
  }, [dashboardId]);

  /* 대시보드 이름 글자수 제한 */
  const handleTitleChange = async (value: string) => {
    if (value.length <= maxTitleLength) {
      setTitle(value);
      setTitleLength(value.length);
    }
  };

  const handleSubmit = async () => {
    if (!dashboardId || selected === null) return;

    const dashboardIdNumber = Number(dashboardId);
    const payload = {
      title,
      color: colors[selected],
    };

    try {
      await axiosInstance.put(
        apiRoutes.dashboardDetail(dashboardIdNumber),
        payload
      );
      setDashboardDetail((prev) => ({
        ...prev,
        title: title,
        color: colors[selected],
      }));

      toast.success("대시보드가 변경되었습니다.");
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("대시보드 변경 실패:", error);
      toast.error("대시보드 변경에 실패했습니다.");
    }
  };

  return (
    <div className="min-h-[312px] lg:w-[620px] sm:w-[544px] w-[284px] bg-white rounded-[12px] p-[24px] flex flex-col">
      <div className="w-full flex justify-center">
        {/* 내부 아이템 컨테이너 */}
        <div className="flex flex-col lg:w-[564px] md:w-[488px] w-[252px]">
          {/* 헤더 */}
          <h2 className="text-left text-black3 font-bold sm:text-[24px] text-[20px]">
            {dashboardDetail.title}
          </h2>

          {/* 변경할 제목 입력창 */}
          <div className="relative w-full mt-6">
            <Input
              type="text"
              onChange={handleTitleChange}
              value={title}
              label="대시보드 이름"
              labelClassName="text-left text-black3 font-medium sm:text-[18px] text-[16px] mb-1"
              placeholder="변경할 이름을 입력해 주세요"
              className="max-w-none mb-1 pr-[52px] placeholder:text-[14px] placeholder:sm:text-[16px]"
            />
            <span className="absolute right-3 bottom-1 top-4/6 -translate-y-2/6 font-light text-[12px] sm:text-[14px] text-[var(--color-gray1)] sm:pr-1.5">
              {titleLength} / {maxTitleLength}
            </span>
          </div>

          {/* 컬러칩 선택 */}
          <div className="flex mt-3">
            {colors.map((color, index) => (
              <div key={index} className="relative">
                <button
                  className="cursor-pointer w-[30px] h-[30px] rounded-[15px] mr-2 transition-all duration-200 
                    hover:opacity-70 hover:scale-110"
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

          {/* 변경 버튼 */}
          <div className="flex mt-6">
            <button
              onClick={handleSubmit}
              disabled={selected === null} // color가 없으면 버튼 비활성화
              className={`cursor-pointer w-full sm:h-[54px] h-[54px]
            rounded-[8px] border border-[var(--color-gray3)] bg-[var(--primary)]
            text-[var(--color-white)] font-semibold text-[14px] sm:text-[16px]
            ${selected === null ? "bg-gray-300 cursor-not-allowed" : "bg-[var(--primary)]"}`}
            >
              변경
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeBebridge;
