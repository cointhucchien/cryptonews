"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useArticle, useArticles } from "@/hooks/useApi";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { ExternalLink, Eye, Tag, TrendingUp, TrendingDown, Minus, ArrowLeft } from "lucide-react";
import ArticleCard from "@/components/news/ArticleCard";
import type { Sentiment } from "@/types";

const SentimentIcon = ({ sentiment }: { sentiment: Sentiment }) => {
  if (sentiment === "bullish") return <TrendingUp size={14} className="text-green-400" />;
  if (sentiment === "bearish") return <TrendingDown size={14} className="text-red-400" />;
  return <Minus size={14} className="text-gray-400" />;
};

export default function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: article, isLoading, isError } = useArticle(slug);

  // Related articles — same category
  const { data: related } = useArticles({
    category: article?.category?.slug,
    page_size: 3,
  });

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-8 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="h-64 bg-gray-800 rounded-xl" />
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 bg-gray-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Không tìm thấy bài viết.</p>
        <Link href="/news" className="text-brand hover:underline text-sm">← Quay lại tin tức</Link>
      </div>
    );
  }

  const displayTitle = article.title_vi || article.title;
  const displaySummary = article.summary_vi || article.summary;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
      {/* Main Content */}
      <article className="flex-1 min-w-0">
        {/* Back button */}
        <Link href="/news" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft size={14} />
          Quay lại tin tức
        </Link>

        {/* Category & Meta */}
        <div className="flex items-center gap-3 mb-4">
          {article.category && (
            <Link
              href={`/news?category=${article.category.slug}`}
              className="text-xs font-medium px-2.5 py-1 rounded-full bg-brand/10 text-brand border border-brand/20 hover:bg-brand/20 transition-colors"
            >
              {article.category.icon} {article.category.name}
            </Link>
          )}
          {article.sentiment && (
            <span className={`flex items-center gap-1 text-xs ${article.sentiment === "bullish" ? "badge-bullish" : article.sentiment === "bearish" ? "badge-bearish" : "badge-neutral"}`}>
              <SentimentIcon sentiment={article.sentiment} />
              {article.sentiment === "bullish" ? "Tích cực" : article.sentiment === "bearish" ? "Tiêu cực" : "Trung lập"}
            </span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3">
          {displayTitle}
        </h1>

        {/* AI Summary box */}
        {displaySummary && (
          <div className="bg-brand/5 border border-brand/20 rounded-xl p-4 mb-6">
            <p className="text-xs text-brand font-medium mb-1.5">✨ Tóm tắt bởi AI</p>
            <p className="text-gray-300 text-sm leading-relaxed">{displaySummary}</p>
          </div>
        )}

        {/* Source & time */}
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-2">
            {article.source?.logo && (
              <Image src={article.source.logo} alt={article.source.name} width={20} height={20} className="rounded" />
            )}
            <span className="text-sm text-gray-400">{article.source?.name}</span>
            <span className="text-gray-700">·</span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: vi })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Eye size={12} />
              {article.view_count.toLocaleString()} lượt xem
            </span>
            {article.original_url && (
              <a
                href={article.original_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand transition-colors"
              >
                <ExternalLink size={12} />
                Nguồn gốc
              </a>
            )}
          </div>
        </div>

        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="relative w-full h-72 sm:h-96 rounded-xl overflow-hidden mb-6 bg-gray-800">
            <Image src={article.thumbnail} alt={displayTitle} fill className="object-cover" />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-invert prose-sm max-w-none
                     prose-headings:text-white prose-p:text-gray-300 prose-p:leading-relaxed
                     prose-a:text-brand prose-a:no-underline hover:prose-a:underline
                     prose-img:rounded-xl prose-blockquote:border-brand"
          dangerouslySetInnerHTML={{ __html: article.content || "<p>Nội dung bài viết đang được tải...</p>" }}
        />

        {/* Tags */}
        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-800">
            <Tag size={14} className="text-gray-500 mt-0.5" />
            {article.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/news?tag=${tag.slug}`}
                className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-400 text-xs hover:bg-gray-700 hover:text-white transition-colors"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}
      </article>

      {/* Sidebar — Related News */}
      {related?.results && related.results.length > 0 && (
        <aside className="hidden lg:block w-80 shrink-0">
          <div className="sticky top-20">
            <h3 className="section-title mb-4">Bài liên quan</h3>
            <div className="flex flex-col">
              {related.results
                .filter((a) => a.slug !== slug)
                .slice(0, 4)
                .map((a) => (
                  <ArticleCard key={a.id} article={a} variant="compact" />
                ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
