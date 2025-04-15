import { useState } from "react";
import RandomProfile from "@/components/common/RandomProfile";

interface User {
  id: number;
  userId: number;
  nickname: string;
  profileImageUrl: string | null;
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

  const selectedUser = users.find((u) => u.nickname === value);
  const filtered = users.filter((user) =>
    user.nickname.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="inline-flex flex-col items-start gap-2.5 w-full max-w-[520px]">
      {label && (
        <p className="text-black3 font-medium text-[16px] sm:text-[18px]">
          {label}
          {required && <span className="text-[var(--primary)]"> *</span>}
        </p>
      )}

      <div className="relative w-full">
        {/* 선택된 담당자 표시 */}
        <div
          className="flex items-center justify-between h-[48px] px-4 border border-[var(--color-gray3)] rounded-md cursor-pointer focus-within:border-[var(--primary)]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            {selectedUser ? (
              <>
                {selectedUser.profileImageUrl ? (
                  <img
                    src={selectedUser.profileImageUrl}
                    alt={`${selectedUser.nickname} 프로필`}
                    className="w-[26px] h-[26px] rounded-full object-cover"
                  />
                ) : (
                  <RandomProfile
                    userId={selectedUser.userId}
                    name={selectedUser.nickname}
                    className="w-[26px] h-[26px] rounded-full text-white text-xs flex items-center justify-center"
                  />
                )}
                <span className="font-normal text-[14px] sm:text-[16px]">
                  {selectedUser.nickname}
                </span>
              </>
            ) : (
              <span className="font-normal text-[16px] sm:text-[18px] text-[var(--color-gray2)]">
                담당자를 선택해 주세요
              </span>
            )}
          </div>
        </div>

        {/* 드롭다운 목록 */}
        {isOpen && (
          <ul className="absolute z-10 top-full left-0 mt-1 w-full max-h-[200px] overflow-y-auto bg-white border border-[var(--color-gray3)] rounded-md shadow-lg">
            {filtered.map((user) => (
              <li
                key={user.userId}
                onClick={() => {
                  onChange(user.nickname);
                  setIsOpen(false);
                  setFilter("");
                }}
                className="flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={`${user.nickname} 프로필`}
                      className="w-[26px] h-[26px] rounded-full object-cover"
                    />
                  ) : (
                    <RandomProfile
                      userId={user.userId}
                      name={user.nickname}
                      className="w-[26px] h-[26px] rounded-full text-white text-xs flex items-center justify-center"
                    />
                  )}
                  <span className="font-normal text-black3 sm:text-[16px] text-[14px]">
                    {user.nickname}
                  </span>
                </div>
                {value === user.nickname && (
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
