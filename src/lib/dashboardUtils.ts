import { getDashboards } from "@/api/dashboards";
import { dashboardOrdersTable } from "./dashboardOrderDB";
import { DashboardType } from "@/types/task";

export const fetchOrderedDashboards = async (
  teamId: string
): Promise<DashboardType[]> => {
  const res = await getDashboards({});
  const localOrder = await dashboardOrdersTable.get(teamId);

  if (localOrder?.order) {
    return res.dashboards
      .slice()
      .sort(
        (a, b) =>
          localOrder.order.indexOf(a.id) - localOrder.order.indexOf(b.id)
      );
  }

  return res.dashboards;
};
