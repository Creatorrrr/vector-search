import axios from "axios";
import type {
  Consultation,
  ConsultationCreate,
  ConsultationUpdate,
  SearchRequest,
  SearchResponse,
} from "../types/consultation";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:18000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const consultationAPI = {
  // 목록 조회
  async getAll(): Promise<Consultation[]> {
    const response = await api.get<Consultation[]>("/consultations");
    return response.data;
  },

  // 상세 조회
  async getById(id: number): Promise<Consultation> {
    const response = await api.get<Consultation>(`/consultations/${id}`);
    return response.data;
  },

  // 생성
  async create(data: ConsultationCreate): Promise<Consultation> {
    const response = await api.post<Consultation>("/consultations", data);
    return response.data;
  },

  // 수정
  async update(id: number, data: ConsultationUpdate): Promise<Consultation> {
    const response = await api.put<Consultation>(`/consultations/${id}`, data);
    return response.data;
  },

  // 삭제
  async delete(id: number): Promise<void> {
    await api.delete(`/consultations/${id}`);
  },

  // 벡터 검색
  async search(searchRequest: SearchRequest): Promise<SearchResponse> {
    const response = await api.post<SearchResponse>(
      "/consultations/search",
      searchRequest
    );
    return response.data;
  },
};

export default api;
