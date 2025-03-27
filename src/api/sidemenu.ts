import axiosInstance from "./axiosInstance";

export interface Dashboard {
  id: number;
  title: string;
  color: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  createdByMe: boolean;
}

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
}): Promise<{
  dashboards: Dashboard[];
  totalCount: number;
  cursorId: string | null;
}> => {
  const res = await axiosInstance.get(`${teamId}/dashboards`, {
    params: { navigationMethod, page, size },
  });

  return res.data;
};
