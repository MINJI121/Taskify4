import axios from "./axiosInstance";
import { apiRoutes } from "./apiRoutes";
import { isAxiosError } from "axios";

export const changePassword = async ({
  password,
  newPassword,
}: {
  password: string;
  newPassword: string;
}) => {
  try {
    const response = await axios.put(apiRoutes.Password(), {
      password,
      newPassword,
    });
    return { success: true, data: response.data };
  } catch (error) {
    if (isAxiosError(error)) {
      return {
        success: false,
        status: error.response?.status,
        message: error.response?.data?.message || "알 수 없는 오류",
      };
    }
    return {
      success: false,
      message: "에러가 발생했습니다.",
    };
  }
};
