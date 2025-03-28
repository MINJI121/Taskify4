import { ColumnType } from "@/types/task";
import axiosInstance from "./axiosInstance";

export const getCardsByColumn = async ({
  teamId,
  columnId,
}: {
  teamId: string;
  columnId: number;
}) => {
  const res = await axiosInstance.get(`/${teamId}/cards`, {
    params: {
      columnId,
    },
  });

  return res.data;
};

export const getColumns = async ({
  teamId,
  dashboardId,
}: {
  teamId: string;
  dashboardId: number;
}) => {
  const res = await axiosInstance.get(`/${teamId}/columns`, {
    params: {
      dashboardId,
    },
  });

  return res.data;
};

export const getDashboards = async ({
  teamId,
  navigationMethod = "pagination",
  page = 1,
  size = 10,
}: {
  teamId: string;
  navigationMethod?: "pagination";
  page?: number;
  size?: number;
}) => {
  const res = await axiosInstance.get(`/${teamId}/dashboards`, {
    params: { navigationMethod, page, size },
  });

  return res.data;
};

export const getDashboardById = async ({
  teamId,
  dashboardId,
}: {
  teamId: string;
  dashboardId: number;
}) => {
  const res = await axiosInstance.get(`/${teamId}/dashboards/${dashboardId}`);
  return res.data;
};

// 칼럼 생성
export const createColumn = async ({
  teamId,
  title,
  dashboardId,
}: {
  teamId: string;
  title: string;
  dashboardId: number;
}): Promise<ColumnType> => {
  const res = await axiosInstance.post(`/${teamId}/columns`, {
    title,
    dashboardId,
  });

  return res.data;
};

// 칼럼 삭제
export const deleteColumn = async ({
  teamId,
  columnId,
}: {
  teamId: string;
  columnId: number;
}) => {
  const res = await axiosInstance.delete(`/${teamId}/columns/${columnId}`);
  return res;
};

// 칼럼 수정
export const updateColumn = async ({
  teamId,
  columnId,
  title,
}: {
  teamId: string;
  columnId: number;
  title: string;
}) => {
  const res = await axiosInstance.put(`/${teamId}/columns/${columnId}`, {
    title,
  });
  return res.data;
};
