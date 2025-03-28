import { UpdateUser, UserType, UserMeImage } from "@/types/users";
import axios from "./axiosInstance";
import { apiRoutes } from "./apiRoutes";

// 내 정보 조회 (GET)
export const getUserMe = async (): Promise<UserType> => {
  const response = await axios.get(apiRoutes.userMe());
  return response.data;
};
// 내 정보 수정 (PUT)
export const updateProfile = async (data: UpdateUser) => {
  const res = await axios.put(apiRoutes.userMe(), data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

// ✅ 프로필 이미지 업로드 (POST)
export const uploadProfileImage = async (
  formData: FormData
): Promise<UserMeImage> => {
  const response = await axios.post(apiRoutes.userMeImage(), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
