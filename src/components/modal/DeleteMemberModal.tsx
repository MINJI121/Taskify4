import { Modal } from "./Modal";
import { CustomBtn } from "../button/CustomButton";
import axiosInstance from "@/api/axiosInstance";
import { apiRoutes } from "@/api/apiRoutes";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type DeleteMemberdProps = {
  isOpen: boolean;
  onClose: () => void;
  id: number;
  memberDelete?: () => void;
};

export default function DeleteDashboardModal({
  isOpen,
  onClose,
  id,
  memberDelete,
}: DeleteMemberdProps) {
  /* 멤버삭제 */
  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(apiRoutes.memberDetail(id));
      if (memberDelete) memberDelete();
      toast.success("멤버가 삭제되었습니다.");
    } catch (error) {
      toast.error("멤버 삭제에 실패했습니다.");
      console.error("멤버 삭제 실패:", error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="w-[327px] sm:w-[568px]"
      height="h-[160px] sm:h-[174px]"
      backgroundClassName="bg-black/35 z-50"
    >
      <div className="flex flex-col sm:gap-10 gap-6 text-center ">
        <p className="text-xl mt-1.5">멤버를 삭제하시겠습니까?</p>
        <div className="flex justify-between gap-3">
          <CustomBtn variant="outlineDisabled" onClick={onClose}>
            취소
          </CustomBtn>
          <CustomBtn variant="primary" onClick={() => handleDelete(id)}>
            삭제
          </CustomBtn>
        </div>
      </div>
    </Modal>
  );
}
