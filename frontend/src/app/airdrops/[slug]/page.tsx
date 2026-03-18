"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAirdrop } from "@/hooks/useApi";
import {
  ExternalLink, Twitter, Send, MessageCircle,
  CheckCircle, Clock, ArrowLeft, Star, Copy
} from "lucide-react";
import { clsx } from "clsx";
import toast from "react-hot-toast";

export default function AirdropDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: airdrop, isLoading, isError } = useAirdrop(slug);

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Đã copy link!");
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-6 bg-gray-800 rounded w-1/3" />
        <div className="h-40 bg-gray-800 rounded-xl" />
        <div className="h-4 bg-gray-800 rounded w-2/3" />
      </div>
    );
  }

  if (isError || !airdrop) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400 mb-4">Không tìm thấy airdrop.</p>
        <Link href="/airdrops" className="text-brand hover:underline text-sm">← Quay lại danh sách</Link>
      </div>
    );
  }

  const displayDesc = airdrop.description_vi || airdrop.description;
  const isActive = airdrop.status === "active";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/airdrops" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={14} />
        Quay lại danh sách
      </Link>

      {/* Header card */}
      <div className="card p-6 mb-6">
        <div className="flex items-start gap-4">
          {airdrop.logo ? (
            <Image src={airdrop.logo} alt={airdrop.name} width={64} height={64} className="rounded-2xl" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center text-3xl">🪙</div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-white">{airdrop.name}</h1>
              {airdrop.is_verified && <CheckCircle size={16} className="text-blue-400" />}
              {airdrop.is_featured && <Star size={16} className="text-yellow-400 fill-yellow-400" />}
            </div>
            {airdrop.token_symbol && (
              <p className="text-sm text-gray-400 font-mono mt-0.5">${airdrop.token_symbol}</p>
            )}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={clsx(
                "text-xs px-2 py-0.5 rounded-full border",
                airdrop.status === "active" ? "bg-green-950 text-green-400 border-green-900" :
                airdrop.status === "upcoming" ? "bg-yellow-950 text-yellow-400 border-yellow-900" :
                "bg-gray-800 text-gray-500 border-gray-700"
              )}>
                {airdrop.status === "active" ? "Đang diễn ra" : airdrop.status === "upcoming" ? "Sắp diễn ra" : "Đã kết thúc"}
              </span>
              {airdrop.total_allocation && (
                <span className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">
                  💰 {airdrop.total_allocation}
                </span>
              )}
              {airdrop.time_remaining && isActive && (
                <span className="text-xs text-orange-400 flex items-center gap-1">
                  <Clock size={11} />
                  Còn {airdrop.time_remaining}
                </span>
              )}
            </div>
          </div>

          <button onClick={copyLink} className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white transition-colors">
            <Copy size={14} />
          </button>
        </div>

        {displayDesc && (
          <p className="mt-4 text-sm text-gray-300 leading-relaxed border-t border-gray-800 pt-4">
            {displayDesc}
          </p>
        )}
      </div>

      {/* Requirements */}
      {airdrop.requirements?.length > 0 && (
        <div className="card p-6 mb-6">
          <h2 className="section-title mb-4">Yêu cầu tham gia</h2>
          <ul className="flex flex-col gap-3">
            {airdrop.requirements.map((req, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="w-5 h-5 rounded-full bg-brand/20 text-brand text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {req}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA + Socials */}
      <div className="card p-6">
        <h2 className="section-title mb-4">Tham gia ngay</h2>
        <div className="flex flex-wrap gap-3">
          {airdrop.guide_url && (
            <a
              href={airdrop.guide_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand-dark transition-colors"
            >
              <ExternalLink size={14} />
              Hướng dẫn tham gia
            </a>
          )}
          {airdrop.website && (
            <a
              href={airdrop.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gray-800 text-gray-300 text-sm hover:bg-gray-700 transition-colors"
            >
              <ExternalLink size={14} />
              Website
            </a>
          )}
          {airdrop.twitter_url && (
            <a
              href={airdrop.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-sky-950 text-sky-400 text-sm hover:bg-sky-900 transition-colors"
            >
              <Twitter size={14} />
              Twitter
            </a>
          )}
          {airdrop.telegram_url && (
            <a
              href={airdrop.telegram_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-950 text-blue-400 text-sm hover:bg-blue-900 transition-colors"
            >
              <Send size={14} />
              Telegram
            </a>
          )}
          {airdrop.discord_url && (
            <a
              href={airdrop.discord_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-950 text-indigo-400 text-sm hover:bg-indigo-900 transition-colors"
            >
              <MessageCircle size={14} />
              Discord
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
