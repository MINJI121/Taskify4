import axios from "axios";

interface UserResponse {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export const getUserInfo = async () => {
  const token = process.env.NEXT_PUBLIC_API_TOKEN;

  const response = await axios.get<UserResponse>(
    `https://sp-taskify-api.vercel.app/13-4/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data || [];
};
