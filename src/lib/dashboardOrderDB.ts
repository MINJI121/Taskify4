import Dexie from "dexie";

// DB 인스턴스 생성
export const db = new Dexie("DashboardOrderDB");

// 테이블 구조 정의
db.version(1).stores({
  dashboardOrders: "&teamId", // teamId를 키로 사용
});

// 테이블 객체 export
export const dashboardOrdersTable = db.table("dashboardOrders");
