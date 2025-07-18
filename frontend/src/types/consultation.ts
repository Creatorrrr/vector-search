export interface Consultation {
  id: number;
  text: string;
  created_at: string;
  updated_at: string;
}

export interface ConsultationCreate {
  text: string;
}

export interface ConsultationUpdate {
  text: string;
}

export interface SearchRequest {
  query: string;
  limit?: number;
  skip?: number;
  page?: number;
  similarity_threshold?: number;
}

export interface SearchResult {
  id: number;
  text: string;
  created_at: string;
  updated_at: string;
  similarity: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}
