"use client";

import { useState } from "react";
import { useArticles, useCategories } from "@/hooks/useApi";
import ArticleCard from "@/components/news/ArticleCard";
import { Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";
import type { Sentiment } from "@/types";

const SENTIMENTS: { value: Sentiment | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "bullish", label: "🟢 Tích cực" },
  { value: "bearish", label: "🔴 Tiêu cực" },
  { value: "neutral", label: "⚪ Trung lập" },
];

export default function NewsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [sentiment, setSentiment] = useState<Sentiment | "">("");

  const { data: categoriesData } = useCategories();
  const { data, isLoading, isFetching } = useArticles({
    page,
    page_size: 12,
    category: category || undefined,
    sentiment: sentiment || undefined,
  });

  const categories = categoriesData?.results ?? [];
  const articles = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 12) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Tin tức Crypto</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-500" />
          <button
            onClick={() => { setCategory(""); setPage(1); }}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-sm transition-colors",
              !category ? "bg-brand text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            Tất cả
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => { setCategory(cat.slug); setPage(1); }}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                category === cat.slug ? "bg-brand text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {/* Sentiment filter */}
        <div className="flex gap-2 ml-auto">
          {SENTIMENTS.map((s) => (
            <button
              key={s.value}
              onClick={() => { setSentiment(s.value as Sentiment | ""); setPage(1); }}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                sentiment === s.value ? "bg-gray-700 text-white" : "bg-gray-800 text-gray-500 hover:bg-gray-700"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-72" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Không có bài viết nào.</div>
      ) : (
        <div className={clsx("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", isFetching && "opacity-70 transition-opacity")}>
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-400">
            Trang <span className="text-white font-medium">{page}</span> / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
