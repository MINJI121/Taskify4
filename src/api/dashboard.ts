// 예: src/lib/api/cards.ts
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
