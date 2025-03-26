// components/ModalInviting.tsx

interface ModalInvitingProps {
  onClose: () => void;
}

const ModalInviting = ({ onClose }: ModalInvitingProps) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-[300px]">
        <p className="mb-4">💌 초대 모달 (임시)</p>
        <button onClick={onClose} className="text-blue-500 font-semibold">
          닫기
        </button>
      </div>
    </div>
  );
};

export default ModalInviting;
