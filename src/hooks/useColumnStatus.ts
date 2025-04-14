import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getColumn } from "@/api/columns";

interface ColumnType {
  id: number;
  title: string;
  status: string;
}

export function useColumnStatus(
  dashboardId: number,
  columnId: number,
  status: string
) {
  const { data: columns = [] } = useQuery<ColumnType[]>({
    queryKey: ["columns", dashboardId],
    queryFn: () => getColumn({ dashboardId, columnId }),
  });

  const matchedColumn = useMemo(() => {
    if (!columns.length) return undefined;
    return columns.find((col) => col.title === status);
  }, [columns, status]);

  return matchedColumn?.id ?? columnId;
}
