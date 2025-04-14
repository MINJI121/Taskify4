// src/hooks/useCardDetail.ts
import { useState, useRef, useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCard } from "@/api/card";
import { toast } from "react-toastify";
import type { CardDetailType } from "@/types/cards";
import { useClosePopup } from "@/hooks/useClosePopup";
import { createComment } from "@/api/comment";

export function useCardDetail(
  card: CardDetailType,
  dashboardId: number,
  onChangeCard?: () => void,
  onClose?: () => void
) {
  const [cardData, setCardData] = useState<CardDetailType>(card);
  const [commentText, setCommentText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const queryClient = useQueryClient();
  const popupRef = useRef(null);

  useClosePopup(popupRef, () => setShowMenu(false));

  const { mutate: createCommentMutate } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["comments", cardData.id] });
    },
  });

  const { mutate: deleteCardMutate } = useMutation({
    mutationFn: () => deleteCard(cardData.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      onChangeCard?.();
      setIsDeleteModalOpen(true);
    },
  });

  const handleCommentSubmit = () => {
    if (!commentText.trim()) return;
    createCommentMutate({
      content: commentText,
      cardId: cardData.id,
      columnId: cardData.columnId,
      dashboardId,
    });
  };

  const handleConfirmDelete = () => {
    deleteCardMutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cards"] });
        onChangeCard?.();
        setIsDeleteModalOpen(false);
        onClose?.();
        toast.success("카드가 삭제되었습니다.");
      },
      onError: () => {
        toast.error("카드 삭제에 실패했습니다.");
        setIsDeleteModalOpen(false);
      },
    });
  };

  return {
    cardData,
    setCardData,
    commentText,
    setCommentText,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    showMenu,
    setShowMenu,
    popupRef,
    handleCommentSubmit,
    handleConfirmDelete,
  };
}
