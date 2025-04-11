import { useEffect, useState } from "react";

const colors = ["bg-[#C4B1A2]", "bg-[#9DD7ED]", "bg-[#FDD446]", "bg-[#FFC85A]"];

interface AssigneeSelectProps {
  value: string;
  onChange: (value: string) => void;
  users: string[];
  label?: string;
  required?: boolean;
}

export default function AssigneeSelect({
  value,
  onChange,
  users,
  label,
  required,
}: AssigneeSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [userColors, setUserColors] = useState<Record<string, string>>({});

  // 유저 필터링
  const filtered = users.filter((name) =>
    name.toLowerCase().includes(filter.toLowerCase() || "")
  );

  // 유저별 색상 매핑 (한 번만 부여)
  useEffect(() => {
    setUserColors((prev) => {
      const updated = { ...prev };
      users.forEach((user) => {
        if (!updated[user]) {
          const color = colors[Math.floor(Math.random() * colors.length)];
          updated[user] = color;
        }
      });
      return updated;
    });
  }, [users]);

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full max-w-[520px]">
      {label && (
        <p className="text-black3 font-medium text-[14px] sm:text-[18px]">
          {label}
          {required && <span className="text-[var(--color-purple)]"> *</span>}
        </p>
      )}

      <div className="relative w-full">
        {/* 선택된 담당자 */}
        <div
          className="flex items-center justify-between h-[48px] px-4 border border-[var(--color-gray3)] rounded-md cursor-pointer focus-within:border-[var(--primary)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {value ? (
              <>
                <span
                  className={`w-6 h-6 rounded-full text-xs text-white flex items-center justify-center ${
                    userColors[value] || "bg-[#A0E6FF]"
                  }`}
                >
                  {value.charAt(0).toUpperCase()}
                </span>
                <span className="font-normal text-[14px] sm:text-[16px]">
                  {value}
                </span>
              </>
            ) : (
              <span className="font-normal text-[14px] sm:text-[16px] text-[var(--color-gray2)]">
                담당자를 선택해 주세요
              </span>
            )}
          </div>
        </div>

        {/* 드롭다운 */}
        {isOpen && (
          <ul className="absolute top-full left-0 mt-1 w-full bg-white border border-[var(--color-gray3)] rounded-md shadow-lg z-10 max-h-[200px] overflow-y-auto">
            {filtered.map((name, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onChange(name);
                  setIsOpen(false);
                  setFilter("");
                }}
                className="px-4 py-2 cursor-pointer hover:bg-[var(--color-gray1)] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-6 h-6 rounded-full text-xs text-white flex items-center justify-center ${
                      userColors[name] || "bg-[#A0E6FF]"
                    }`}
                  >
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm">{name}</span>
                </div>
                {value === name && (
                  <span className="text-[var(--primary)]">✔</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
