import { useState } from "react";
import { ConsultationForm } from "@/components/ConsultationForm";
import { ConsultationList } from "@/components/ConsultationList";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/Button";
import { useConsultations, useSearch } from "@/hooks/useConsultations";
import type {
  Consultation,
  ConsultationCreate,
  ConsultationUpdate,
} from "@/types/consultation";
import "./App.css";

type ViewMode = "list" | "form" | "search";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingConsultation, setEditingConsultation] =
    useState<Consultation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    consultations,
    loading: consultationsLoading,
    error: consultationsError,
    create: createConsultation,
    update: updateConsultation,
    delete: deleteConsultation,
    isCreating,
    isUpdating,
    isDeleting,
  } = useConsultations();

  const {
    searchResults,
    searchTotal,
    searchResponse,
    loading: searchLoading,
    error: searchError,
    search: searchConsultations,
    clearSearch,
    isSearching,
  } = useSearch();

  const handleCreateConsultation = async (data: ConsultationCreate) => {
    await createConsultation(data);
    setViewMode("list");
  };

  const handleUpdateConsultation = async (data: ConsultationUpdate) => {
    if (editingConsultation) {
      await updateConsultation(editingConsultation.id, data);
      setEditingConsultation(null);
      setViewMode("list");
    }
  };

  const handleEditConsultation = (consultation: Consultation) => {
    setEditingConsultation(consultation);
    setViewMode("form");
  };

  const handleDeleteConsultation = async (id: number) => {
    await deleteConsultation(id);
  };

  const handleSearch = async (query: string, similarityThreshold?: number) => {
    setSearchQuery(query);
    setCurrentPage(1); // 검색 시 페이지를 1로 초기화
    if (query.trim()) {
      await searchConsultations(query, 10, 1, similarityThreshold);
      console.log("Search results:", searchResults);
      setViewMode("search");
    } else {
      clearSearch();
      setViewMode("list");
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    if (searchQuery.trim()) {
      await searchConsultations(searchQuery, 10, page);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
    clearSearch();
    setViewMode("list");
  };

  const handleCancelForm = () => {
    setEditingConsultation(null);
    setViewMode("list");
  };

  const isLoading = consultationsLoading || searchLoading;
  const error = consultationsError || searchError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  상담 관리 시스템
                </h1>
                <p className="text-gray-600 mt-1 text-sm">
                  AI 기반 벡터 검색으로 더 스마트한 상담 관리
                </p>
              </div>
            </div>

            {viewMode !== "form" && (
              <Button
                onClick={() => setViewMode("form")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-3 rounded-xl font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2 inline-block"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                새 상담 등록
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar - Always visible except in form mode */}
        {viewMode !== "form" && (
          <div className="mb-10">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <SearchBar
                onSearch={handleSearch}
                placeholder="상담 내용을 검색하세요..."
                loading={searchLoading}
              />
            </div>

            {viewMode === "search" && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between animate-fade-in">
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-blue-900 font-medium">
                    '{searchQuery}' 검색 결과:{" "}
                    <span className="text-blue-600 font-bold">
                      {searchResponse?.total || 0}건
                    </span>
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                  className="hover:bg-blue-100 transition-colors"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  검색 초기화
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl shadow-md animate-slide-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-base font-semibold text-red-900">
                  오류가 발생했습니다
                </h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Content based on view mode */}
        {viewMode === "form" ? (
          <ConsultationForm
            consultation={editingConsultation || undefined}
            onSubmit={
              editingConsultation
                ? handleUpdateConsultation
                : handleCreateConsultation
            }
            onCancel={handleCancelForm}
            isEditing={!!editingConsultation}
          />
        ) : (
          <ConsultationList
            consultations={consultations}
            searchResults={searchResults}
            searchResponse={searchResponse}
            onEdit={handleEditConsultation}
            onDelete={handleDeleteConsultation}
            onPageChange={handlePageChange}
            loading={isLoading}
            isSearchMode={viewMode === "search"}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-100 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <span className="text-gray-700 font-medium">
                상담 관리 시스템
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2025 AI 기반 벡터 검색 시스템 · Powered by Nomic Embedding
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
