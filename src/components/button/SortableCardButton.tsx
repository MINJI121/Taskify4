import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CardButton from "./CardButton";
import { Dashboard } from "@/api/dashboards";

export default function SortableCardButton({
  dashboard,
  ...rest
}: {
  dashboard: Dashboard;
  isEditMode?: boolean;
  onDeleteClick?: (id: number) => void;
  onLeaveClick?: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: dashboard.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: 10,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CardButton
        dashboardId={dashboard.id}
        title={dashboard.title}
        showCrown={dashboard.createdByMe}
        color={dashboard.color}
        createdByMe={dashboard.createdByMe}
        {...rest}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}
