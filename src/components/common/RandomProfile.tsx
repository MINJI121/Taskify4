interface RandomProfileProps {
  userId: number;
  name: string;
  className?: string;
}

// 4개의 고정된 색상 배열
const colors = ["bg-[#C4B1A2]", "bg-[#9DD7ED]", "bg-[#FDD446]", "bg-[#FFC85A]"];

// id 숫자 기반 고정 색상 인덱스 생성
function numberToIndex(id: number, length: number): number {
  return id % length;
}

export default function RandomProfile({
  userId,
  name,
  className,
}: RandomProfileProps) {
  const index = numberToIndex(userId, colors.length);
  const bgColor = colors[index];

  return (
    <div
      className={`flex items-center justify-center
        leading-none text-white font-medium
        rounded-full ${bgColor} ${className}`}
    >
      {name[0]}
    </div>
  );
}
