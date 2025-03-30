import axiosInstance from "./axiosInstance";

export interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserInfo = async ({ teamId }: { teamId: string }) => {
  const response = await axiosInstance.get<UserResponse>(`/${teamId}/users/me`);
  return response.data;
};
