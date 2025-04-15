import axiosInstance from "./axiosInstance";
import { apiRoutes } from "./apiRoutes";
import { MemberType } from "@/types/users";

// 🔹 대시보드 멤버 목록 조회
export const getMembers = async ({
  dashboardId,
}: {
  dashboardId: number;
}): Promise<MemberType[]> => {
  if (!dashboardId) {
    console.error("dashboardId가 없습니다.");
    return [];
  }

  try {
    const response = await axiosInstance.get(apiRoutes.members(), {
      params: {
        dashboardId,
      },
    });

    const members: MemberType[] = response.data.members || [];
    return members;
  } catch (error) {
    console.error("getMembers API 실패:", error);
    return [];
  }
};

// 🔹 대시보드 멤버 삭제
export const deleteMembers = async (memberId: number) => {
  const response = await axiosInstance.delete(apiRoutes.memberDetail(memberId));
  return response.data;
};
