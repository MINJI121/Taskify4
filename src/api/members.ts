import axios from "axios";
import { MemberType } from "@/components/Gnb/members";

interface ApiResponse {
  members: MemberType[]; // 실제 데이터
  totalCount: number;
}

export const getMembers = async (dashboardId?: string | string[]) => {
  if (!dashboardId) {
    console.error("dashboardID가 없습니다.");
    return [];
  }

  const token = process.env.NEXT_PUBLIC_API_TOKEN;
  const numericDashboardId =
    typeof dashboardId === "string" ? Number(dashboardId) : undefined;

  const response = await axios.get<ApiResponse>(
    `https://sp-taskify-api.vercel.app/13-4/members?page=1&size=20&dashboardId=${numericDashboardId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  console.log(response.data);
  console.log(response.data.members);

  return response.data.members || [];
};
