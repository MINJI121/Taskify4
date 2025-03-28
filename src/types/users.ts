export interface UserType {
  profileImageUrl: string;
  nickname: string;
  email: string; //유저프로필 조회시 이메일도 포함되어있음
  isOwner?: boolean;
  userId?: number;
}

export interface UpdateUser {
  nickname: string;
  profileImageUrl: string;
}

export interface UserMeImage {
  profileImageUrl: "string";
}

export interface MemberType extends UserType {
  id: number;
}
