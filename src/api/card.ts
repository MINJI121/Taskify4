import axiosInstance from "./axiosInstance";
import type { CardDetailType } from "@/types/cards";
import { apiRoutes } from "@/api/apiRoutes";
import { TEAM_ID } from "@/constants/team";

/** 카드 수정용 타입 */
export interface EditCardPayload {
  columnId?: number;
  assigneeUserId?: number;
  title?: string;
  description?: string;
  dueDate?: string;
  tags?: string[];
  imageUrl?: string;
}

/** 1. 카드 이미지 업로드 */
export const uploadCardImage = async ({
  columnId,
  imageFile,
}: {
  columnId: number;
  imageFile: File;
}): Promise<string> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await axiosInstance.post(
    `/${TEAM_ID}/columns/${columnId}/card-image`,
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
  assigneeUserId,
  dashboardId,
  columnId,
  title,
  description,
  dueDate,
  tags,
  imageUrl,
}: {
  assigneeUserId: number;
  dashboardId: number;
  columnId: number;
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
  imageUrl?: string;
}) => {
  const response = await axiosInstance.post(`/${TEAM_ID}/cards`, {
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
  dashboardId,
  page = 1,
  size = 20,
}: {
  dashboardId: number;
  page?: number;
  size?: number;
}) => {
  const res = await axiosInstance.get(apiRoutes.members(), {
    params: {
      page,
      size,
      dashboardId,
    },
  });

  return res.data.members;
};

/** 4. 카드 수정 */
export const editCard = async (cardId: number, data: EditCardPayload) => {
  const response = await axiosInstance.put(apiRoutes.cardDetail(cardId), data);
  return response.data;
};

/** 5. 카드 목록 조회 */
export const getCardsByColumn = async ({
  columnId,
  cursorId,
  size = 300,
}: {
  columnId: number;
  cursorId?: number;
  size?: number;
}) => {
  const res = await axiosInstance.get(apiRoutes.cards(), {
    params: {
      columnId,
      cursorId,
      size,
    },
  });

  return res.data;
};

/** 6. 카드 상세 조회 */
export async function getCardDetail(cardId: number): Promise<CardDetailType> {
  try {
    const url = apiRoutes.cardDetail(cardId);
    const response = await axiosInstance.get(url);
    return response.data as CardDetailType;
  } catch (error) {
    console.error("대시보드 데이터를 불러오는 데 실패했습니다.", error);
    throw error;
  }
}

/** 7. 카드 삭제 */
export const deleteCard = async (cardId: number) => {
  const url = apiRoutes.cardDetail(cardId);
  const response = await axiosInstance.delete(url);
  return response.data;
};
