"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";

const CustomToastContainer = () => {
  return (
    <ToastContainer
      limit={2}
      position="bottom-center"
      autoClose={3000}
      newestOnTop={true}
      closeButton={false}
      pauseOnHover={false}
      hideProgressBar={true}
      transition={Slide}
      draggable
    />
  );
};

export default CustomToastContainer;
