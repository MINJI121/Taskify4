import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getColumns } from "@/api/columns";
import { ColumnType } from "@/types/task";

export function useColumnStatus(
  dashboardId: number,
  columnId: number,
  status: string
) {
  const { data: columns = [] } = useQuery<ColumnType[]>({
    queryKey: ["columns", dashboardId],
    queryFn: () => getColumns({ dashboardId }), //전체 컬럼 목록 가져오기
  });

  const matchedColumn = useMemo(() => {
    if (!columns.length) return undefined;
    return columns.find((col) => col.title === status); // 상태에 맞는 칼럼 찾기
  }, [columns, status]);

  return matchedColumn?.id ?? columnId; // 매칭 안 되면 기존 columnId 유지
}
