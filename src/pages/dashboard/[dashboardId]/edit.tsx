import { useRouter } from "next/router";
import ChangeBebridge from "@/components/modal/ChangeBebridge";

export default function EditDashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;

  return (
    <div>
      <h1>대시보드 수정 페이지 {dashboardId}</h1>
      <br />
      <h1>dashboardId : {dashboardId}</h1>
      <ChangeBebridge />
    </div>
  );
}
