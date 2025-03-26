import axios from "axios";
import { MemberType } from "@/components/Gnb/members";

export const getMembers = async () => {
  const response = await axios.get<{ results: MemberType[] }>(
    "https://sp-taskify-api.vercel.app/13-4/members"
  );
  return response.data.results || [];
};
