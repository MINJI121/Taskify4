interface RandomProfileProps {
  name: string;
  index: number; // 몇 번째 요소인지 받음
}

// 4개의 고정된 색상 배열
const colors = ["bg-[#C4B1A2]", "bg-[#9DD7ED]", "bg-[#FDD446]", "bg-[#FFC85A]"];

export default function RandomProfile({ name, index }: RandomProfileProps) {
  // 4개의 요소에 대해 순서대로 색상을 할당
  const bgColor = colors[index % colors.length];

  return (
    <div
      className={`flex items-center justify-center text-white font-bold rounded-full ${bgColor} w-[38px] h-[38px] border-2`}
    >
      {name[0]}
    </div>
  );
}
