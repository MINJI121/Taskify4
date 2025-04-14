import { useState } from "react";
import RandomProfile from "@/components/common/RandomProfile";

interface User {
  id: number;
  name: string;
}

interface AssigneeSelectProps {
  value: string;
  onChange: (value: string) => void;
  users: User[];
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
  const selectedUser = users.find((u) => u.name === value);

  // 유저 필터링
  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full max-w-[520px]">
      {label && (
        <p className="text-black3 font-medium text-[14px] sm:text-[18px]">
          {label}
          {required && <span className="text-[var(--primary)]"> *</span>}
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
                <RandomProfile
                  name={value}
                  userId={selectedUser?.id ?? 0}
                  className="w-[26px] h-[26px]"
                />
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
          <ul
            className="absolute z-10 top-full left-0 mt-1
          w-full max-h-[200px] overflow-y-auto
          bg-white border border-[var(--color-gray3)] rounded-md shadow-lg"
          >
            {filtered.map((user, idx) => (
              <li
                key={idx}
                onClick={() => {
                  onChange(user.name);
                  setIsOpen(false);
                  setFilter("");
                }}
                className="flex items-center justify-between
                px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <RandomProfile
                    name={user.name}
                    userId={user.id}
                    className="w-[26px] h-[26px]"
                  />
                  <span className="font-normal text-black3 sm:text-[16px] text-[14px]">
                    {user.name}
                  </span>
                </div>
                {value === user.name && (
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
