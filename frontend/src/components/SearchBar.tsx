import { useState } from "react";
import { Search, X, Settings } from "lucide-react";
import Input from "./ui/Input";
import { Button } from "./ui/Button";

interface SearchBarProps {
  onSearch: (query: string, similarityThreshold?: number) => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar = ({
  onSearch,
  placeholder = "검색...",
  loading = false,
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [similarityThreshold, setSimilarityThreshold] = useState(0.3);
  const [showSettings, setShowSettings] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    onSearch(query, similarityThreshold);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="flex-1 relative group">
          <Input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 pr-4 py-4 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 group-hover:shadow-md"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <Button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          variant="secondary"
          className="px-4 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button
          type="submit"
          loading={loading}
          disabled={!query.trim()}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Search className="h-5 w-5 mr-2 inline-block" />
          검색
        </Button>
        {query && (
          <Button
            type="button"
            variant="secondary"
            onClick={handleClear}
            className="px-4 py-4 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
          >
            <X className="h-5 w-5" />
          </Button>
        )}
      </form>

      {showSettings && (
        <div className="mt-4 p-4 bg-gray-50 rounded-xl border">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              유사도 임계값: {similarityThreshold.toFixed(2)}
            </label>
            <span className="text-xs text-gray-500">높을수록 엄격한 검색</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={similarityThreshold}
            onChange={(e) => setSimilarityThreshold(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.0 (관련성 낮음)</span>
            <span>1.0 (매우 관련성 높음)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
