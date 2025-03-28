import axiosInstance from "./axiosInstance";

interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
  userId?: number;
}

export const getUserInfo = async ({ teamId }: { teamId: string }) => {
  const response = await axiosInstance.get<UserResponse>(`/${teamId}/users/me`);
  return response.data;
};
