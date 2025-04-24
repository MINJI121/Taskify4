import useUserStore from "@/store/useUserStore";
import { READ_ONLY_DASHBOARD_IDS } from "@/constants/protectedDashboards";

export const isReadOnlyDashboard = (dashboardId: number) =>
  READ_ONLY_DASHBOARD_IDS.includes(dashboardId);

export const useDashboardPermission = (
  dashboardId: number,
  createdByMe: boolean
) => {
  const user = useUserStore((state) => state.user);

  const isGuest = user?.email === "guest@gmail.com";
  const isReadOnly = READ_ONLY_DASHBOARD_IDS.includes(dashboardId);

  const canEdit = createdByMe || !isReadOnly;

  return {
    isGuest,
    isReadOnly,
    canEdit,
    canEditCards: canEdit,
    canEditColumns: canEdit,
  };
};
