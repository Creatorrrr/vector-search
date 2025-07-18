import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { consultationAPI } from "../services/api";
import type {
  Consultation,
  ConsultationCreate,
  ConsultationUpdate,
  SearchResult,
  SearchResponse,
} from "../types/consultation";

const CONSULTATION_QUERY_KEY = ["consultations"] as const;
const SEARCH_QUERY_KEY = ["search"] as const;

export const useConsultations = () => {
  const queryClient = useQueryClient();

  const {
    data: consultations = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: CONSULTATION_QUERY_KEY,
    queryFn: consultationAPI.getAll,
  });

  const createMutation = useMutation({
    mutationFn: consultationAPI.create,
    onSuccess: (newConsultation) => {
      queryClient.setQueryData<Consultation[]>(CONSULTATION_QUERY_KEY, (old) =>
        old ? [newConsultation, ...old] : [newConsultation]
      );
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ConsultationUpdate }) =>
      consultationAPI.update(id, data),
    onSuccess: (updatedConsultation) => {
      queryClient.setQueryData<Consultation[]>(CONSULTATION_QUERY_KEY, (old) =>
        old
          ? old.map((item) =>
              item.id === updatedConsultation.id ? updatedConsultation : item
            )
          : []
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: consultationAPI.delete,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Consultation[]>(CONSULTATION_QUERY_KEY, (old) =>
        old ? old.filter((item) => item.id !== deletedId) : []
      );
    },
  });

  const createConsultation = async (data: ConsultationCreate) => {
    return createMutation.mutateAsync(data);
  };

  const updateConsultation = async (id: number, data: ConsultationUpdate) => {
    return updateMutation.mutateAsync({ id, data });
  };

  const deleteConsultation = async (id: number) => {
    return deleteMutation.mutateAsync(id);
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
  const searchMutation = useMutation({
    mutationFn: ({
      query,
      limit = 10,
      page = 1,
      similarity_threshold = 0.3,
    }: {
      query: string;
      limit?: number;
      page?: number;
      similarity_threshold?: number;
    }) => consultationAPI.search({ query, limit, page, similarity_threshold }),
  });

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
      query,
      limit,
      page,
      similarity_threshold,
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
