import { useRouter } from "next/router";
import ChangeBebridge from "@/components/modal/ChangeBebridge";
import HeaderBebridge from "@/components/Gnb/HeaderBebridge";
import MemberList from "@/components/table/member/MemberList";

export default function EditDashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;

  return (
    <div>
      <HeaderBebridge dashboardId={dashboardId} />
      <h1>대시보드 수정 페이지 </h1>
      <br />
      <h1>dashboardId : {dashboardId}</h1>
      <MemberList dashboardId={dashboardId} />
      <ChangeBebridge />
    </div>
  );
}
