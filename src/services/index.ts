import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { refreshTokenInquire, removeToken } from "./login";
import { useSetRecoilState } from "recoil";
import { isLoginInState } from "@/utils/AuthAtom";
import { getCookie } from "./Cookie";

const token = localStorage.getItem("token");

export const instance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_DOMAIN as string,
  timeout: 1000 * 3,
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginInstance = axios.create({
  baseURL: import.meta.env.VITE_AUTH_DOMAIN as string,
  timeout: 1000 * 3,
  headers: {
    "Content-Type": "application/json",
  },
});

loginInstance.interceptors.request.use((config) => {
  const refreshToken = getCookie("refreshToken");
  if (refreshToken) {
    config.headers["Cookie"] = `Bearer ${refreshToken}`;
  }
  return config;
});

instance.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const expiredTime = new Date(
    parseInt(localStorage.getItem("expiredTime") as string)
  ); // accessToken 만료 시간
  const refreshExpiredTime = new Date(
    parseInt(localStorage.getItem("refreshExpiredTime") as string)
  );

  const currentTime = new Date();

  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (expiredTime < currentTime && refreshExpiredTime > currentTime) {
    try {
      const refreshedConfig = await refreshTokenInquire();
      return refreshedConfig || config; // ensure we return a valid config
    } catch (e) {
      removeToken();
      return Promise.reject(e);
    }
  }
  return config;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const {
      response: { status },
    } = error;
    if (status === 403) {
      //refreshtoken 요청
      await refreshTokenInquire();
    }
    if (status === 401) {
      // 리프레시 토큰 만료
      const setisLoginIn = useSetRecoilState(isLoginInState);
      setisLoginIn(false);
      removeToken();
      alert("로그인이 만료되었습니다! 다시 로그인 해주세요.");
      return Promise.resolve(error.response.data.error.message);
    }
    return Promise.reject(error.response);
  }
);
