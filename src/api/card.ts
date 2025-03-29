import axiosInstance from "./axiosInstance";

/** 1. 카드 이미지 업로드 */
export const uploadCardImage = async ({
  teamId,
  columnId,
  imageFile,
}: {
  teamId: string;
  columnId: number;
  imageFile: File;
}): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post(
    `/${teamId}/columns/${columnId}/card-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data.imageUrl;
};

/** 2. 카드 생성 */
export const createCard = async ({
  teamId,
  assigneeUserId,
  dashboardId,
  columnId,
  title,
  description,
  dueDate,
  tags,
  imageUrl,
}: {
  teamId: string;
  assigneeUserId: number;
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl?: string;
}) => {
  const response = await axiosInstance.post(`/${teamId}/cards`, {
    assigneeUserId,
    dashboardId,
    columnId,
    title,
    description,
    dueDate,
    tags,
    imageUrl,
  });

  return response.data;
};

/** 3. 대시보드 멤버 조회 (담당자용) */
export const getDashboardMembers = async ({
  teamId,
  dashboardId,
  page = 1,
  size = 20,
}: {
  teamId: string;
  dashboardId: number;
  page?: number;
  size?: number;
}) => {
  const res = await axiosInstance.get(`/${teamId}/members`, {
    params: {
      page,
      size,
      dashboardId,
    },
  });

  return res.data.members;
};

/** 4. 카드 수정 */
export const updateCard = async ({
  teamId,
  cardId,
  columnId,
  assigneeUserId,
  title,
  description,
  dueDate,
  tags,
  imageUrl,
}: {
  teamId: string;
  cardId: number;
  columnId: number;
  assigneeUserId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl?: string;
}) => {
  const response = await axiosInstance.put(`/${teamId}/cards/${cardId}`, {
    columnId,
    assigneeUserId,
    title,
    description,
    dueDate,
    tags,
    imageUrl,
  });

  return response.data;
};
