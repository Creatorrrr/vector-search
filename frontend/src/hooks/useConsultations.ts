import { useQueryClient } from "@tanstack/react-query";
import {
  useHealthCheckApiV1HealthGet,
  useReadConsultationsApiV1ConsultationsGet,
  useCreateConsultationApiV1ConsultationsPost,
  useUpdateConsultationApiV1ConsultationsConsultationIdPut,
  useDeleteConsultationApiV1ConsultationsConsultationIdDelete,
  useSearchConsultationsApiV1ConsultationsSearchPost,
} from "../api/generated";
import type {
  ConsultationResponse,
  ConsultationCreate,
  ConsultationUpdate,
  ConsultationSearchRequest,
  ConsultationSearchResponse,
} from "../api/model";

// React Query 키 타입 매칭
type Consultation = ConsultationResponse;
type SearchResult = ConsultationSearchResponse["results"][0];
type SearchResponse = ConsultationSearchResponse;

export const useConsultations = () => {
  const queryClient = useQueryClient();

  const {
    data: consultations = [],
    isLoading: loading,
    error,
    refetch,
  } = useReadConsultationsApiV1ConsultationsGet();

  const createMutation = useCreateConsultationApiV1ConsultationsPost({
    mutation: {
      onSuccess: (newConsultation) => {
        queryClient.invalidateQueries({ queryKey: ['consultations'] });
      },
    },
  });

  const updateMutation = useUpdateConsultationApiV1ConsultationsConsultationIdPut({
    mutation: {
      onSuccess: (updatedConsultation) => {
        queryClient.invalidateQueries({ queryKey: ['consultations'] });
      },
    },
  });

  const deleteMutation = useDeleteConsultationApiV1ConsultationsConsultationIdDelete({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['consultations'] });
      },
    },
  });

  const createConsultation = async (data: ConsultationCreate) => {
    return createMutation.mutateAsync({ data });
  };

  const updateConsultation = async (id: number, data: ConsultationUpdate) => {
    return updateMutation.mutateAsync({ consultationId: id, data });
  };

  const deleteConsultation = async (id: number) => {
    return deleteMutation.mutateAsync({ consultationId: id });
  };

  return {
    consultations,
    loading:
      loading ||
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
    error:
      error?.message ||
      createMutation.error?.message ||
      updateMutation.error?.message ||
      deleteMutation.error?.message ||
      null,
    refetch,
    create: createConsultation,
    update: updateConsultation,
    delete: deleteConsultation,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

export const useSearch = () => {
  const searchMutation = useSearchConsultationsApiV1ConsultationsSearchPost();

  const search = async (
    query: string,
    limit = 10,
    page = 1,
    similarity_threshold = 0.3
  ) => {
    if (!query.trim()) {
      return {
        results: [],
        total: 0,
        page: 1,
        limit: 10,
        total_pages: 0,
        has_next: false,
        has_prev: false,
      };
    }

    const results = await searchMutation.mutateAsync({
      data: {
        query,
        limit,
        page,
        similarity_threshold,
      },
    });
    return results;
  };

  const clearSearch = () => {
    searchMutation.reset();
  };

  return {
    searchResults: searchMutation.data?.results || [],
    searchTotal: searchMutation.data?.total || 0,
    searchResponse: searchMutation.data,
    loading: searchMutation.isPending,
    error: searchMutation.error?.message || null,
    search,
    clearSearch,
    isSearching: searchMutation.isPending,
  };
};
