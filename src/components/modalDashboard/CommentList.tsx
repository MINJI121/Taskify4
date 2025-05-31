import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import useUserStore from "@/store/useUserStore";
import { getComments } from "@/api/comment";
import type { Comment as CommentType } from "@/types/comments";
import UpdateComment from "./UpdateComment";
import { TEAM_ID } from "@/constants/team";

interface CommentListProps {
  cardId: number;
}

export default function CommentList({ cardId }: CommentListProps) {
  const { ref, inView } = useInView();
  const { user } = useUserStore();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["comments", cardId],
      queryFn: ({ pageParam = 1 }) => getComments({ cardId, pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
      initialPageParam: 1,
      enabled: !!cardId,
      retry: false,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allComments: CommentType[] =
    data?.pages.flatMap((page) => page.comments) ?? [];

  if (!user) return null;

  return (
    <div
      className="min-h-[80px] sm:max-h-[240px] max-h-[215px] w-full
      rounded bg-white
      flex flex-col"
    >
      {allComments.length === 0 ? (
        <p
          className="sm:pt-4 pt-2 text-center text-gray1
        font-normal sm:text-[14px] text-[12px]"
        >
          작성된 댓글이 없습니다.
        </p>
      ) : (
        allComments.map((comment) => (
          <div key={comment.id} className=" shrink-0 py-2 last:border-b-0">
            <UpdateComment
              comment={comment}
              currentUserId={user.id}
              teamId={TEAM_ID}
            />
          </div>
        ))
      )}
      <div ref={ref} />
    </div>
  );
}
