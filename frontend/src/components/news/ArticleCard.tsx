import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Eye, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Article } from "@/types";
import { clsx } from "clsx";

interface Props {
  article: Article;
  variant?: "default" | "compact" | "featured";
}

const SentimentBadge = ({ sentiment }: { sentiment: Article["sentiment"] }) => {
  const config = {
    bullish: { label: "Tích cực", icon: TrendingUp, cls: "badge-bullish" },
    bearish: { label: "Tiêu cực", icon: TrendingDown, cls: "badge-bearish" },
    neutral: { label: "Trung lập", icon: Minus, cls: "badge-neutral" },
  }[sentiment] ?? { label: "Trung lập", icon: Minus, cls: "badge-neutral" };

  const Icon = config.icon;
  return (
    <span className={config.cls}>
      <Icon size={10} />
      {config.label}
    </span>
  );
};

export default function ArticleCard({ article, variant = "default" }: Props) {
  const displayTitle = article.title_vi || article.title;
  const displaySummary = article.summary_vi || article.summary;
  const timeAgo = formatDistanceToNow(new Date(article.published_at), {
    addSuffix: true,
    locale: vi,
  });

  if (variant === "compact") {
    return (
      <Link href={`/news/${article.slug}`} className="flex gap-3 group py-3 border-b border-gray-800 last:border-0">
        {article.thumbnail && (
          <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
            <Image
              src={article.thumbnail}
              alt={displayTitle}
              width={64}
              height={64}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-100 line-clamp-2 group-hover:text-brand transition-colors">
            {displayTitle}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-500">{article.source?.name}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug}`} className="card group flex flex-col">
      {article.thumbnail && (
        <div className="relative h-44 overflow-hidden bg-gray-800">
          <Image
            src={article.thumbnail}
            alt={displayTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.category && (
            <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium
                             bg-black/60 text-white backdrop-blur-sm">
              {article.category.icon} {article.category.name}
            </span>
          )}
        </div>
      )}

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-100 line-clamp-2 leading-snug group-hover:text-brand transition-colors">
          {displayTitle}
        </h3>

        {displaySummary && (
          <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {displaySummary}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {article.source?.logo && (
              <Image src={article.source.logo} alt={article.source.name} width={16} height={16} className="rounded" />
            )}
            <span className="text-xs text-gray-500">{article.source?.name}</span>
            <span className="text-gray-700">·</span>
            <span className="text-xs text-gray-500">{timeAgo}</span>
          </div>

          <div className="flex items-center gap-2">
            {article.sentiment && <SentimentBadge sentiment={article.sentiment} />}
            <span className="flex items-center gap-1 text-xs text-gray-600">
              <Eye size={10} />
              {article.view_count.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
