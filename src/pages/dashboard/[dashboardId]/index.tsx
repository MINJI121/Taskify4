import { useRouter } from "next/router";

export default function Dashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;

  const goToEditPage = () => {
    if (typeof dashboardId === "string") {
      router.push(`/dashboard/${dashboardId}/edit`);
    }
  };

  return (
    <div>
      <h1>대시보드 페이지 {dashboardId}</h1>
      <br />
      <h1>dashboardId : {dashboardId}</h1>
      <button
        onClick={goToEditPage}
        className="cursor-pointer border border-[#787486] px-4 py-2 mt-4 text-blue-500 bg-white rounded-md"
      >
        관리 버튼
      </button>
    </div>
  );
}
