import { arrayMove } from "@dnd-kit/sortable";
import { dashboardOrdersTable } from "./dashboardOrderDB";
import { TEAM_ID } from "@/constants/team";
import { DragEndEvent } from "@dnd-kit/core";
import { DashboardType } from "@/types/task";

export const useDashboardDragHandler = (
  dashboards: DashboardType[],
  setDashboards: (list: DashboardType[]) => void
) => {
  return async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dashboards.findIndex((d) => d.id === active.id);
    const newIndex = dashboards.findIndex((d) => d.id === over.id);
    const newOrder = arrayMove(dashboards, oldIndex, newIndex);

    setDashboards(newOrder);
    await dashboardOrdersTable.put({
      teamId: TEAM_ID,
      order: newOrder.map((d) => d.id),
    });
  };
};
