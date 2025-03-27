export interface UserType {
  profileImageUrl: string;
  nickname: string;
}

export interface MemberType extends UserType {
  id: number;
}
