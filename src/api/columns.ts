import { ColumnType } from "@/types/task";
import axiosInstance from "./axiosInstance";
import { apiRoutes } from "./apiRoutes";
import { TEAM_ID } from "@/constants/team";

//  칼럼 생성
export const createColumn = async ({
  title,
  dashboardId,
}: {
  title: string;
  dashboardId: number;
}): Promise<ColumnType> => {
  const res = await axiosInstance.post(`/${TEAM_ID}/columns`, {
    title,
    dashboardId,
  });

  return res.data;
};

export const getColumns = async ({
  dashboardId,
}: {
  dashboardId: number;
}): Promise<ColumnType[]> => {
  const res = await axiosInstance.get(apiRoutes.columns(), {
    params: {
      dashboardId,
    },
  });

  return res.data;
};
//  칼럼 수정
export const updateColumn = async ({
  columnId,
  title,
}: {
  columnId: number;
  title: string;
}) => {
  const res = await axiosInstance.put(apiRoutes.columnDetail(columnId), {
    title,
  });
  return res.data;
};

//  칼럼 삭제
export const deleteColumn = async ({ columnId }: { columnId: number }) => {
  const res = await axiosInstance.delete(apiRoutes.columnDetail(columnId));
  return res;
};
