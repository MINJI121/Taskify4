import { useState } from "react";
import Image from "next/image";
import { CardType } from "@/types/task";
import Card from "./Card";
import { Modal } from "../modal/Modal";
import TodoModal from "@/components/modalInput/ToDoModal";
import Input from "../input/Input";
import TodoButton from "@/components/button/TodoButton";
import { CustomBtn } from "../button/CustomBtn";

type ColumnProps = {
  title?: string;
  tasks?: CardType[];
};

export default function Column({
  title = "new Task",
  tasks = [],
}: ColumnProps) {
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);

  return (
    <div className="w-[354px] h-[1010px] border-[var(--color-gray4)] flex flex-col rounded-md border border-solid bg-gray-50 p-4">
      {/* 칼럼 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">
            <span className="text-[var(--primary)]">•</span> {title}
          </h2>
          <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
            {tasks.length}
          </span>
        </div>
        <Image
          src="/svgs/settings.svg"
          alt="setting icon"
          width={24}
          height={24}
          priority
          className="cursor-pointer"
          onClick={() => setIsColumnModalOpen(true)}
        />
      </div>

      {/* Todo 추가 버튼 */}
      <div onClick={() => setIsTodoModalOpen(true)}>
        <TodoButton />
      </div>

      {/* 카드 목록 */}
      {tasks.map((task) => (
        <Card
          key={task.id}
          {...task}
          imageUrl={task.imageUrl}
          assignee={task.assignee}
        />
      ))}

      {/* Todo 추가 모달 */}
      {isTodoModalOpen && (
        <TodoModal
          isOpen={isTodoModalOpen}
          onClose={() => setIsTodoModalOpen(false)}
        />
      )}

      {/* 칼럼 관리 모달 */}
      {isColumnModalOpen && (
        <Modal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
        >
          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">칼럼 관리</h2>
            <label className="font-medium flex flex-col gap-2">
              이름
              <Input type="text" />
            </label>
            <div className="flex justify-between mt-1.5">
              <CustomBtn
                variant="outlineDisabled"
                onClick={() => {
                  setIsColumnModalOpen(false);
                  setIsDeleteModalOpen(true);
                }}
              >
                삭제
              </CustomBtn>
              <CustomBtn>변경</CustomBtn>
            </div>
          </div>
        </Modal>
      )}

      {/* 칼럼 삭제 확인 모달 */}
      {isDeleteModalOpen && (
        <Modal
          width="w-[568px]"
          height="h-[174px]"
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
        >
          <div className="flex flex-col gap-10 text-center">
            <p className="text-xl mt-1.5">칼럼의 모든 카드가 삭제됩니다.</p>
            <div className="flex justify-between gap-3">
              <CustomBtn
                variant="outlineDisabled"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                취소
              </CustomBtn>
              <CustomBtn variant="primary">삭제</CustomBtn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
