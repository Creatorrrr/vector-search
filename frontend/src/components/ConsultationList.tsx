import type {
  ConsultationResponse,
  ConsultationSearchResult,
  ConsultationSearchResponse,
} from "@/api/model";
import { Button } from "@/components/ui/Button";

interface ConsultationListProps {
  consultations: ConsultationResponse[];
  onEdit: (consultation: ConsultationResponse) => void;
  onDelete: (id: number) => void;
  loading?: boolean;
  searchResults?: ConsultationSearchResult[];
  searchResponse?: ConsultationSearchResponse;
  onPageChange?: (page: number) => void;
  isSearchMode?: boolean;
}

export const ConsultationList = ({
  consultations,
  onEdit,
  onDelete,
  loading = false,
  searchResults,
  searchResponse,
  onPageChange,
  isSearchMode = false,
}: ConsultationListProps) => {
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const formatSimilarity = (similarity: number): string => {
    return `${(similarity * 100).toFixed(1)}%`;
  };

  const getSimilarityColor = (similarity: number): string => {
    if (similarity >= 0.8) return "text-green-600 bg-green-100";
    if (similarity >= 0.6) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  // 검색 모드일 때는 searchResults를 사용하고, 일반 모드일 때는 consultations를 사용
  const displayItems =
    isSearchMode && searchResults ? searchResults : consultations;
  const totalCount = isSearchMode
    ? searchResponse?.total || 0
    : consultations.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
          <div className="absolute inset-0 rounded-full h-12 w-12 border-4 border-gray-200"></div>
        </div>
        <span className="ml-3 text-gray-600 font-medium">로딩 중...</span>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <div className="text-gray-500 text-xl mb-2 font-medium">
          {isSearchMode
            ? "검색 결과가 없습니다."
            : "등록된 상담 내용이 없습니다."}
        </div>
        <div className="text-gray-400">
          {isSearchMode
            ? "다른 검색어로 시도해보세요."
            : "새로운 상담을 등록해보세요."}
        </div>
      </div>
    );
  }

  const renderPagination = () => {
    if (!isSearchMode || !searchResponse || !onPageChange) return null;

    const { page, total_pages, has_prev, has_next } = searchResponse;

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={!has_prev}
          className="px-3 py-2"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          이전
        </Button>

        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(total_pages, 5) }, (_, i) => {
            const pageNum = i + 1;
            const isCurrentPage = pageNum === page;

            return (
              <Button
                key={pageNum}
                variant={isCurrentPage ? "primary" : "outline"}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`px-3 py-2 ${
                  isCurrentPage ? "bg-blue-600 text-white" : "hover:bg-blue-50"
                }`}
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={!has_next}
          className="px-3 py-2"
        >
          다음
          <svg
            className="w-4 h-4 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {isSearchMode ? "검색 결과" : "상담 목록"}
        </h2>
        <div className="text-sm text-gray-500">
          총 <span className="font-semibold text-blue-600">{totalCount}</span>건
          {isSearchMode && searchResponse && (
            <span className="ml-2">
              (페이지 {searchResponse.page}/{searchResponse.total_pages})
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {displayItems.map((item) => {
          const consultation = item as ConsultationResponse;
          const searchResult = item as ConsultationSearchResult;
          const isSearchItem = isSearchMode && "similarity" in item;

          return (
            <div
              key={consultation.id}
              className="bg-white border border-gray-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-6 text-sm">
                    <span className="flex items-center text-gray-500">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2">
                        <svg
                          className="w-4 h-4 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">
                        {formatDate(consultation.created_at)}
                      </span>
                    </span>
                    <span className="flex items-center text-gray-500">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-2">
                        <svg
                          className="w-4 h-4 text-purple-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">ID: {consultation.id}</span>
                    </span>
                    {isSearchItem && (
                      <span className="flex items-center">
                        <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-2">
                          <svg
                            className="w-4 h-4 text-orange-600"
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getSimilarityColor(
                            searchResult.similarity
                          )}`}
                        >
                          유사도: {formatSimilarity(searchResult.similarity)}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(consultation)}
                    className="px-4 py-2 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    수정
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "정말로 이 상담 내용을 삭제하시겠습니까?"
                        )
                      ) {
                        onDelete(consultation.id);
                      }
                    }}
                    className="px-4 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1 inline-block"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    삭제
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {truncateText(consultation.text, 150)}
                </p>
              </div>

              {consultation.text.length > 150 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(consultation)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  <svg
                    className="w-4 h-4 mr-1 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  전체 내용 보기
                </Button>
              )}

              {consultation.updated_at !== consultation.created_at && (
                <div className="flex items-center justify-end mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    마지막 수정: {formatDate(consultation.updated_at)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {renderPagination()}
    </div>
  );
};
