// src/utils/formatDate.ts (혹은 components 폴더 내)

export default function formatDate(
  dateString: string,
  includeTime: boolean = true,
  isRelative: boolean = false
): string {
  const date = new Date(dateString);

  // 상대 시간으로 표시 (예: "3분 전")
  if (isRelative) {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return `${diffSec}초 전`;
    if (diffMin < 60) return `${diffMin}분 전`;
    if (diffHour < 24) return `${diffHour}시간 전`;
    return `${diffDay}일 전`;
  }

  // 일반 날짜 포맷
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  }).format(date);
}
