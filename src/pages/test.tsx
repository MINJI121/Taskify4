// 컴포넌트 test 파일

import { useState } from "react";

import MemberList from "@/components/table/member/MemberList";
import InviteRecords from "@/components/table/InviteRecords";
import InvitedDashBoard from "@/components/table/invited/InvitedDashBoard";
import Profile from "@/components/card/Profile";
import ChangePassword from "@/components/card/ChangePassword";
import NewDashboard from "@/components/modal/NewDashboard";
import ChangeBebridge from "@/components/modal/ChangeBebridge";

export default function TestPage() {
  const [isModalOpen, setIsModalOpen] = useState(false); // 새로운 대시보드 모달

  return (
    <div className="flex flex-col items-center gap-4 p-10">
      <h1 className="text-2xl font-bold">구성원 테이블 테스트</h1>
      <MemberList />
      <br />
      <h1 className="text-2xl font-bold">초대 테이블 테스트</h1>
      <InviteRecords />
      <br />
      <h1 className="text-2xl font-bold">초대받은 테이블 테스트</h1>
      <InvitedDashBoard />
      <br />
      <br />
      <br />

      <h1 className="text-2xl font-bold">프로필 카드 테스트</h1>
      <Profile />
      <br />
      <h1 className="text-2xl font-bold">비밀번호 변경 카드 테스트</h1>
      <ChangePassword />

      <br />

      <h1 className="text-2xl font-bold">새로운 대시보드 모달 테스트</h1>
      <br />
      <div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="cursor-pointer w-[120px] h-[50px] border-2 border-black"
        >
          추가
        </button>

        {isModalOpen && <NewDashboard onClose={() => setIsModalOpen(false)} />}
      </div>
      <br />
      <br />

      <h1 className="text-2xl font-bold">비브리지 변경 모달 테스트</h1>
      <ChangeBebridge />
    </div>
  );
}
