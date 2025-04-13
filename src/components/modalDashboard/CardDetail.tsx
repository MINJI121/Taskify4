import { useEffect, useState } from "react";
import Image from "next/image";
import { CardDetailType } from "@/types/cards";
import { ColumnNameTag } from "../modalInput/chips/ColumnNameTag";
import ColorTagChip, {
  getTagColor,
} from "@/components/modalInput/chips/ColorTagChip";
import { PopupImageModal } from "./PopupImageModal";

interface CardDetailProps {
  card: CardDetailType;
  columnName: string;
}

export default function CardDetail({ card, columnName }: CardDetailProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentCard, setCurrentCard] = useState<CardDetailType>(card);

  useEffect(() => {
    setCurrentCard(card);
  }, [card]);

  return (
    <div className="flex flex-col gap-5 w-full">
      {/* 상태 + 태그 */}
      <div className="flex flex-wrap items-center gap-5">
        <ColumnNameTag label={columnName} />
        <div className="w-[1px] h-[20px] bg-[var(--color-gray3)]" />
        <div className="flex flex-wrap gap-[6px]">
          {currentCard.tags.map((tag, idx) => {
            const { textColor, bgColor } = getTagColor(idx);
            return (
              <ColorTagChip key={idx} className={`${textColor} ${bgColor}`}>
                {tag}
              </ColorTagChip>
            );
          })}
        </div>
      </div>

      {/* 설명 */}
      <p className="text-black font-normal sm:text-[16px] text-[14px] overflow-auto pr-1 w-full lg:max-w-[445px] sm:max-w-[420px] max-w-[295px] min-h-0 sm:max-h-[100px] max-h-[80px] whitespace-pre-wrap word-break break-words">
        {currentCard.description}
      </p>

      {/* 담당자 */}
      <div className="flex items-center gap-2 text-sm text-[var(--color-gray1)]">
        <span className="font-medium">담당자:</span>
        {currentCard.assignee.profileImageUrl ? (
          <Image
            src={currentCard.assignee.profileImageUrl}
            alt="프로필 이미지"
            width={24}
            height={24}
            className="w-6 h-6 rounded-full object-cover"
          />
        ) : (
          <div className="w-6 h-6 flex items-center justify-center bg-[#A3C4A2] text-white font-medium rounded-full text-xs">
            {currentCard.assignee.nickname[0]}
          </div>
        )}
        <span>{currentCard.assignee.nickname}</span>
      </div>

      {/* 이미지 */}
      {currentCard.imageUrl && (
        <div
          className="md:w-[420px] lg:w-[445px] cursor-pointer"
          onClick={() => setIsImageModalOpen(true)}
        >
          <Image
            src={currentCard.imageUrl}
            alt="카드 이미지"
            width={290}
            height={168}
            className="rounded-lg object-cover
              lg:w-[445px] md:w-[420px]
              lg:h-[280px] md:h-[240px]
              sm:max-h-none max-h-[180px]"
          />
        </div>
      )}

      {isImageModalOpen && currentCard.imageUrl && (
        <PopupImageModal
          imageUrl={currentCard.imageUrl}
          onClose={() => setIsImageModalOpen(false)}
        />
      )}
    </div>
  );
}
