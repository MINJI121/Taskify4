import { GUEST_EDIT_RESTRICTED_DASHBOARD_IDS } from "@/permissions/constants/restrictedDashboards";

export const isGuestRestrictedDashboard = (dashboardId: number) =>
  GUEST_EDIT_RESTRICTED_DASHBOARD_IDS.includes(dashboardId);

export const useDashboardPermission = (
  dashboardId: number,
  createdByMe: boolean
) => {
  const isGuestRestricted =
    GUEST_EDIT_RESTRICTED_DASHBOARD_IDS.includes(dashboardId);

  const canEdit = createdByMe || !isGuestRestricted;

  return {
    isGuestRestricted,
    canEdit,
  };
};
