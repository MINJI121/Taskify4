import { useState, useEffect } from "react";
import useUserStore from "@/store/useUserStore";
import Image from "next/image";
import { getUserInfo, updateProfile, uploadProfileImage } from "@/api/users";
import Input from "@/components/input/Input";
import { useUserPermission } from "@/hooks/useUserPermission";
import { toast } from "react-toastify";

export const ProfileCard = () => {
  const { user, updateNickname, updateProfileImage } = useUserStore();
  const [image, setImage] = useState(user?.profileImageUrl);
  const [nickname, setNickname] = useState(user?.nickname);
  const [email, setEmail] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const isGuest = useUserPermission();

  const fetchUserData = async () => {
    try {
      const data = await getUserInfo();
      setImage(data.profileImageUrl);
      setNickname(data.nickname);
      setEmail(data.email);
    } catch (err) {
      console.error("유저 정보 불러오기 실패:", err);
      toast.error("유저 정보를 불러올 수 없습니다.");
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const MAX_IMAGE_SIZE = 3.5 * 1024 * 1024;

    if (isGuest) {
      toast.error("게스트 계정은 정보를 변경할 수 없습니다.");
      return;
    }

    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > MAX_IMAGE_SIZE) {
        toast.error("3.5MB 이하만 등록 가능합니다.");
        return;
      }

      setPreview(URL.createObjectURL(file)); // 미리보기

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await uploadProfileImage(formData);
        setImage(response.profileImageUrl); // 서버에서 받은 URL 저장
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        toast.error("이미지 업로드에 실패했습니다.");
      }
    }
  };

  const handleSave = async () => {
    if (!nickname) return;

    if (isGuest) {
      toast.error("게스트 계정은 정보를 변경할 수 없습니다.");
      return;
    }

    try {
      const payload: { nickname: string; profileImageUrl?: string } = {
        nickname,
      };
      if (image) {
        payload.profileImageUrl = image;
      }

      await updateProfile(payload);
      updateNickname(nickname);

      if (image) {
        updateProfileImage(image);
      }
      toast.success("프로필 변경이 완료되었습니다.");
    } catch (error) {
      console.error("프로필 변경 실패:", error);
      toast.error("프로필 변경에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="flex flex-col w-[284px] sm:w-[544px] lg:w-[620px] h-[496px] sm:h-[366px] bg-white rounded-[12px] p-[24px]">
      {/* 프로필 제목 */}
      <h2 className="text-black3 text-[18px] sm:text-[24px] font-bold mb-4">
        프로필
      </h2>
      {/* 프로필 이미지 및 입력 폼 영역 */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start">
        {/* 프로필 이미지 업로드 영역 */}
        <div className="sm:mr:0 mr-[119px] w-[120px] flex-shrink-0 mb-4 sm:mb-0">
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
        <div className="flex flex-col sm:ml-[-15px] sm:mt-0 mt-5 w-[252px] sm:w-[272px] lg:w-[348px] gap-4">
          <Input
            type="email"
            name="email"
            label="이메일"
            placeholder={email}
            labelClassName="text-black3 text-[14px] sm:text-base"
            readOnly
          />
          <Input
            type="text"
            name="nickname"
            label="닉네임"
            labelClassName="text-black3 text-[14px] sm:text-base"
            value={nickname}
            placeholder="닉네임을 입력하세요"
            onChange={(value: string) => setNickname(value)}
            className="text-black4"
          />
          <button
            className="cursor-pointer w-[252px] sm:w-[272px] lg:w-[348px] h-[54px] bg-[var(--primary)] text-white rounded-[8px] text-lg font-medium mt-3"
            onClick={handleSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};
