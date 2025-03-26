import { useRouter } from "next/router";
import ChangeBebridge from "@/components/modal/ChangeBebridge";
import HeaderBebridge from "@/components/Gnb/HeaderBebridge";
import MemberList from "@/components/table/member/MemberList";
// import SideMenu from "@/components/SideMenu/SideMenu";
import InviteRecords from "@/components/table/InviteRecords";

export default function EditDashboard() {
  const router = useRouter();
  const { dashboardId } = router.query;

  return (
    <div>
      <HeaderBebridge dashboardId={dashboardId} />
      <h3>돌아가기</h3>

      <div className="flex justify-center items-center">
        <ChangeBebridge />
      </div>

      <MemberList dashboardId={dashboardId} />
      <InviteRecords />
    </div>
  );
}
