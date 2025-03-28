const TEAM_ID = "13-4";

export const apiRoutes = {
  //로그인
  Login: () => `/${TEAM_ID}/login`, //post
  //비밀번호변경
  Password: () => `/${TEAM_ID}/auth/password`, //put
  //카드
  Cards: () => `/${TEAM_ID}/cards`, //post,get
  CardDetail: (cardId: number) => `/${TEAM_ID}/cards/${cardId}`, //get,put,delete
  //컬럼
  Columns: () => `/${TEAM_ID}/columns`, //post,get
  ColumnDetail: (columnId: number) => `/${TEAM_ID}/columns/${columnId}`, //put,delete
  ColumnCardImage: (columnId: number) =>
    `/${TEAM_ID}/columns/${columnId}/card-image`, //post
  //댓글
  Comments: () => `/${TEAM_ID}/comments`, //post,get
  CommentsDetail: (commentId: number) => `/${TEAM_ID}/comments/${commentId}`, //put,delete
  //대시보드
  Dashboards: () => `/${TEAM_ID}/dashboards`, //post,get
  DashboardDetail: (dashboardId: number) =>
    `/${TEAM_ID}/dashboards/${dashboardId}`, //get,put,delete
  //대시보드 초대하기
  DashboardInvite: (dashboardId: number) =>
    `/${TEAM_ID}/dashboards/${dashboardId}/invitations`, //post,get
  DashboardInviteDelete: (dashboardId: number, invitationId: number) =>
    `/${TEAM_ID}/dashboards/${dashboardId}/invitations/${invitationId}`, //delete
  //초대 받은 대시보드
  Invitations: () => `/${TEAM_ID}/members`, //get
  invitationDetail: (invitationId: number) =>
    `/${TEAM_ID}/invitations/${invitationId}`, //put
  // [Members]
  members: () => `/${TEAM_ID}/members`, //get
  memberDetail: (memberId: number) => `/${TEAM_ID}/members/${memberId}`, //put

  // [Users]
  users: () => `/${TEAM_ID}/users`, //post
  userMe: () => `/${TEAM_ID}/users/me`, //get,put
  userMeImage: () => `/${TEAM_ID}/users/me/image`, //post
};
