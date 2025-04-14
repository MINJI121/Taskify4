"use client";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, Slide } from "react-toastify";

const CustomToastContainer = () => {
  return (
    <ToastContainer
      limit={2}
      position="top-center"
      autoClose={3000}
      newestOnTop={false}
      closeButton={false}
      pauseOnHover={false}
      hideProgressBar={true}
      transition={Slide}
    />
  );
};

export default CustomToastContainer;
