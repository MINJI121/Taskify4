import useUserStore from "@/store/useUserStore";

export const useUserPermission = () => {
  const user = useUserStore((state) => state.user);
  return user?.email === "guest@gmail.com";
};
