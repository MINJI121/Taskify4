import { useState, useEffect } from "react";
import Input from "../input/Input";
import Image from "next/image";
import {
  getUserMe,
  updateProfile,
  uploadProfileImage,
} from "@/api/userprofile";
import MypageModal from "../modal/MypageModal";

export default function ProfileCard() {
  const [image, setImage] = useState<string | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const fetchUserData = async () => {
    try {
      const data = await getUserMe();
      setImage(data.profileImageUrl);
      setNickname(data.nickname);
      setEmail(data.email);
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setPreview(URL.createObjectURL(file)); // 미리보기

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await uploadProfileImage(formData);
        setImage(response.profileImageUrl); // 서버에서 받은 URL 저장
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다.");
      }
    }
  };
  const handleSave = async () => {
    if (!nickname || !image) return;

    const userProfile = {
      nickname,
      profileImageUrl: image,
    };

    try {
      await updateProfile(userProfile);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="sm:w-[672px] sm:h-[366px] w-[284px] h-[496px] bg-white rounded-[16px] shadow-md p-[24px] flex flex-col">
      {/* 프로필 제목 */}
      <h2 className="text-[18px] sm:text-[24px] font-bold mb-4">프로필</h2>
      {/* 프로필 이미지 및 입력 폼 영역 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* 프로필 이미지 업로드 영역 */}
        <div className="sm:mr:0 mr-29 w-[120px] flex-shrink-0 mb-4 sm:mb-0">
          <div className="sm:w-[182px] sm:h-[182px] w-[100px] h-[100px] rounded-md flex items-center justify-center cursor-pointer bg-[#F5F5F5] border-transparent">
            <label className="cursor-pointer w-full h-full flex items-center justify-center">
              {image ? (
                <Image
                  src={preview || image || ""}
                  alt="Profile"
                  width={182}
                  height={182}
                  unoptimized
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
            value={email}
            readOnly
          />

          <Input
            type="text"
            name="nickname"
            label="닉네임"
            labelClassName="font-16r"
            value={nickname}
            placeholder="닉네임을 입력하세요"
            onChange={(value: string) => setNickname(value)}
          />
          <MypageModal
            isOpen={showSuccessModal}
            onClose={() => setShowSuccessModal(false)}
            message="프로필 변경이 완료되었습니다."
          />
          <MypageModal
            isOpen={showErrorModal}
            onClose={() => setShowErrorModal(false)}
            message="프로필 변경에 실패하였습니다"
          />

          <button
            className="cursor-pointer w-full sm:w-[400px] h-[54px] bg-[#5A3FFF] text-white rounded-[8px] text-lg font-medium mt-3"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
