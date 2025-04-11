export interface UserType {
  id: number;
  email: string;
  nickname: string;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
  isOwner?: boolean;
  userId?: number;
}

export interface UpdateUser {
  nickname: string;
  profileImageUrl?: string;
}

export interface UserMeImage {
  profileImageUrl: "string";
}

export interface MemberType extends UserType {
  id: number;
}
