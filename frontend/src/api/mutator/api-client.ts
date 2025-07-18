import axios, { AxiosError, type AxiosRequestConfig } from "axios";

// Vite 환경변수 사용 - 빌드 시 대체됨
const API_BASE_URL =
  typeof window !== "undefined" && window.location.hostname !== "localhost"
    ? window.location.origin
    : "http://localhost:18000";

export const AXIOS_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    // 필요시 토큰 추가 등의 작업 수행
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
AXIOS_INSTANCE.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // 에러 처리 로직
    if (error.response?.status === 401) {
      // 인증 에러 처리
    }
    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig & { signal?: AbortSignal }
): Promise<T> => {
  const promise = AXIOS_INSTANCE({
    ...config,
    signal: config.signal,
  }).then(({ data }) => data);

  return promise;
};
