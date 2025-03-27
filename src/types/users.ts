export interface UserType {
  profileImageUrl: string;
  nickname: string;
  isOwner?: boolean;
  userId?: number;
}

export interface MemberType extends UserType {
  id: number;
}
