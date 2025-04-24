// ✅ UpdateComment.tsx
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteComment, updateComment } from "@/api/comment";
import { Comment } from "@/types/comments";
import { ProfileIcon } from "./CardProfileIcon";
import formatDate from "./formatDate";
import { DeleteModal } from "@/components/modal/DeleteModal";
import { toast } from "react-toastify";

interface UpdateCommentProps {
  comment: Comment;
  currentUserId: number;
  teamId: string;
}

export default function UpdateComment({
  comment,
  currentUserId,
}: UpdateCommentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setEditedContent(comment.content);
  };

  const handleDelete = async () => {
    await deleteComment({ commentId: comment.id });
    queryClient.invalidateQueries({ queryKey: ["comments", comment.cardId] });
    setIsDeleteModalOpen(false);
    toast.success("댓글이 삭제되었습니다.");
  };

  const handleSave = async () => {
    await updateComment(comment.id, {
      ...comment,
      content: editedContent,
    });
    queryClient.invalidateQueries({ queryKey: ["comments", comment.cardId] });
    setIsEditing(false);
    toast.success("댓글이 수정되었습니다.");
  };

  return (
    <div className="flex gap-3 items-start w-full">
      {/* 프로필 */}
      <ProfileIcon
        userId={comment.author.id}
        nickname={comment.author.nickname}
        profileImageUrl={comment.author.profileImageUrl}
        imgClassName="sm:w-[34px] sm:h-[34px] w-[26px] h-[26px]"
        fontClassName="text-sm"
        id={0}
      />

      {/* 댓글 */}
      <div className="flex flex-col w-full space-y-1">
        {/* 작성자 + 시간 */}
        <div
          className="flex items-center gap-2
        text-gray2 font-normal sm:text-[12px] text-[10px]"
        >
          <span className="text-black3 font-semibold sm:text-[14px] text-[12px]">
            {comment.author.nickname}
          </span>
          <span>{formatDate(comment.createdAt)}</span>
        </div>

        {/* 댓글 수정 입력창 */}
        {isEditing ? (
          <>
            <textarea
              className="w-full text-black3 font-normal sm:text-[14px] text-[12px]
              outline-none"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              aria-label="댓글"
            />
            <div className="flex gap-2 text-black3 font-normal sm:text-[14px] text-[12px]">
              <button
                onClick={handleSave}
                disabled={editedContent === comment.content}
                className="font-normal text-black3 sm:text-[12px] text-[10px]
                cursor-pointer"
              >
                저장
              </button>
              <button
                onClick={handleEditToggle}
                className="font-normal text-gray2 sm:text-[12px] text-[10px]
              cursor-pointer"
              >
                취소
              </button>
            </div>
          </>
        ) : (
          <>
            {/* 댓글 내용 */}
            <p
              className="whitespace-pre-wrap break-words
            text-black3 font-normal sm:text-[14px] text-[12px]"
            >
              {comment.content}
            </p>
            {/* 버튼 컨테이너 */}
            {currentUserId === comment.author.id && (
              <div
                className="flex gap-2 mt-1
              text-gray2 font-normal sm:text-[12px] text-[10px]"
              >
                <button onClick={handleEditToggle} className="cursor-pointer">
                  수정
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="cursor-pointer"
                >
                  삭제
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <DeleteModal
        title="댓글을"
        isOpen={isDeleteModalOpen}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
