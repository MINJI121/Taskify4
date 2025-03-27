import axios from "axios";
import { MemberType } from "@/types/users";

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
    `${process.env.NEXT_PUBLIC_BASE_URL}13-4/members`,
    {
      params: {
        dashboardId: numericDashboardId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.members || [];
};
