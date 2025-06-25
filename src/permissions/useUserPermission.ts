import useUserStore from "@/store/useUserStore";
import { GUEST_ACCOUNTS } from "@/permissions/constants/guest";

export const useUserPermission = () => {
  const user = useUserStore((state) => state.user);
  return user?.email === GUEST_ACCOUNTS.email;
};
