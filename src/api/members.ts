import axiosInstance from "./axiosInstance";
import { MemberType } from "@/types/users";

interface MembersResponse {
  members: MemberType[]; // 실제 데이터
  totalCount: number;
}

export const getMembers = async (dashboardId?: string | string[]) => {
  if (!dashboardId) {
    console.error("dashboardID가 없습니다.");
    return [];
  }
  const dashboardIdNum =
    typeof dashboardId === "string" ? Number(dashboardId) : undefined;

  const response = await axiosInstance.get<MembersResponse>(
    `https://sp-taskify-api.vercel.app/13-4/members?page=1&size=20&dashboardId=${dashboardIdNum}`
  );

  return response.data.members || [];
};
