"use client";

import { useState, useEffect, useRef } from "react";
import { useArticles } from "@/hooks/useApi";
import ArticleCard from "@/components/news/ArticleCard";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 400);

  const { data, isLoading, isFetching } = useArticles({
    search: debouncedQuery || undefined,
    page_size: 12,
  });

  const articles = data?.results ?? [];
  const hasQuery = debouncedQuery.trim().length >= 2;

  // Auto focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  // ⌘K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Search box */}
      <div className="relative mb-8">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          ref={inputRef}
          type="text"
          placeholder="Tìm kiếm tin tức, coins, chủ đề..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-11 pr-10 py-3.5
                     text-white placeholder-gray-500 focus:outline-none focus:border-brand
                     focus:ring-1 focus:ring-brand transition-colors text-base"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-700 text-gray-400"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* State: empty */}
      {!hasQuery && (
        <div className="text-center py-16 text-gray-600">
          <Search size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">Nhập ít nhất 2 ký tự để tìm kiếm</p>
        </div>
      )}

      {/* State: loading */}
      {hasQuery && (isLoading || isFetching) && (
        <div className="flex items-center justify-center gap-2 py-10 text-gray-400">
          <Loader2 size={18} className="animate-spin" />
          <span className="text-sm">Đang tìm kiếm...</span>
        </div>
      )}

      {/* State: no results */}
      {hasQuery && !isLoading && !isFetching && articles.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <p className="text-sm">Không tìm thấy kết quả cho <span className="text-white">"{debouncedQuery}"</span></p>
        </div>
      )}

      {/* Results */}
      {hasQuery && articles.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Tìm thấy <span className="text-white font-medium">{data?.count}</span> kết quả cho
            {" "}<span className="text-brand">"{debouncedQuery}"</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
