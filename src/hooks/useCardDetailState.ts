import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getColumn } from "@/api/columns";
import { CardDetailType } from "@/types/cards";
import { getDashboardMembers } from "@/api/card";

interface ColumnType {
  id: number;
  title: string;
  status: string;
}

export function useCardDetailState(card: CardDetailType, dashboardId: number) {
  const [cardData, setCardData] = useState<CardDetailType>(card);

  const { data: columns = [] } = useQuery<ColumnType[]>({
    queryKey: ["columns", dashboardId],
    queryFn: () => getColumn({ dashboardId, columnId: card.columnId }),
  });

  const { data: members = [] } = useQuery({
    queryKey: ["dashboardMembers", dashboardId],
    queryFn: () => getDashboardMembers({ dashboardId }),
  });

  const columnName = useMemo(() => {
    return (
      columns.find((col) => col.id === cardData.columnId)?.title || "알 수 없음"
    );
  }, [columns, cardData.columnId]);

  return {
    cardData,
    setCardData,
    columnName,
    columns,
    members,
  };
}
