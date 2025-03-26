import { useState } from "react";
import Input from "../input/Input";

export default function ProfileCard() {
  const [image, setImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setImage(result);
        }
      };
      reader.readAsDataURL(event.target.files[0]);

      console.log(nickname, email);
    }
  };

  return (
    <div className="sm:w-[672px] sm:h-[366px] w-[284px] h-[496px] bg-white rounded-[16px] shadow-md p-[24px] flex flex-col">
      {/* 프로필 제목 */}
      <h2 className="text-[18px] sm:text-[24px] font-bold mb-4">프로필</h2>

      {/* 프로필 이미지 + 입력 폼  > 컴포넌트 받으면 바꾸기*/}
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* 프로필 이미지 업로드 영역 */}
        <div className="sm:mr:0 mr-29 w-[120px] flex-shrink-0 mb-4 sm:mb-0">
          <div className="sm:w-[182px] sm:h-[182px] w-[100px] h-[100px] rounded-md flex items-center justify-center cursor-pointer bg-[#F5F5F5] border-transparent">
            <label className="cursor-pointer w-full h-full flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-md"
                />
              ) : (
                <span className=" text-[#5534DA] text-2xl">+</span>
              )}
              <input
                type="file"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          </div>
        </div>

        {/* 입력 폼 */}
        <div className="flex flex-col sm:ml-[-15px] w-full sm:mt-0 mt-5 sm:w-[400px]">
          <Input
            type="email"
            name="email"
            label="이메일"
            labelClassName="font-16r"
            placeholder="이메일을 입력하세요"
            onChange={setEmail}
            pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
            invalidMessage="유효한 이메일 주소를 입력하세요."
          />

          <Input
            type="text"
            name="nickname"
            label="닉네임"
            labelClassName="font-16r"
            placeholder="닉네임을 입력하세요"
            onChange={setNickname}
          />

          {/* 저장 버튼 */}
          <button className="cursor-pointer w-full sm:w-[400px] h-[54px] bg-[#5A3FFF] text-white rounded-[8px] text-lg font-medium mt-3">
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
