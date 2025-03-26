import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

axiosInstance.defaults.headers.common["Authorization"] =
  `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN} `;

export default axiosInstance;
