// task.ts
export type AssigneeType = {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
};

// 개별 테스크 카드
export type CardType = {
  id: number;
  title: string;
  tags: string[];
  dueDate: string;
  assignee: AssigneeType;
  imageUrl: string | null;
  description?: string;
  columnId: number;
};

// 칼럼
export type ColumnType = {
  id: number;
  title: string;
  teamId: string;
  createdAt: string;
  updatedAt: string;
};

// 여러 칼럼별 테스크 묶음
export type TasksByColumn = {
  [columnIdL: number]: CardType[];
};
