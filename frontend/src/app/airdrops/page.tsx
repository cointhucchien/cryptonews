"use client";

import { useState } from "react";
import { useAirdrops } from "@/hooks/useApi";
import AirdropCard from "@/components/airdrops/AirdropCard";
import { clsx } from "clsx";
import type { AirdropStatus, AirdropType } from "@/types";

const STATUSES: { value: AirdropStatus | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "active", label: "🟢 Đang diễn ra" },
  { value: "upcoming", label: "🟡 Sắp diễn ra" },
  { value: "ended", label: "⚫ Đã kết thúc" },
];

const TYPES: { value: AirdropType | ""; label: string }[] = [
  { value: "", label: "Tất cả loại" },
  { value: "free", label: "Free" },
  { value: "task", label: "Task" },
  { value: "holder", label: "Holder" },
  { value: "testnet", label: "Testnet" },
];

export default function AirdropsPage() {
  const [status, setStatus] = useState<AirdropStatus | "">("");
  const [type, setType] = useState<AirdropType | "">("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAirdrops({
    status: status || undefined,
    airdrop_type: type || undefined,
    page,
  });

  const airdrops = data?.results ?? [];
  const totalPages = data ? Math.ceil(data.count / 20) : 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Airdrop Crypto</h1>
        <p className="text-gray-400 text-sm">
          Tổng hợp các airdrop uy tín — cập nhật liên tục.
          {data && <span className="text-gray-500 ml-2">({data.count} airdrop)</span>}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6 pb-6 border-b border-gray-800">
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => { setStatus(s.value as AirdropStatus | ""); setPage(1); }}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-sm transition-colors",
                status === s.value
                  ? "bg-brand text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap ml-auto">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => { setType(t.value as AirdropType | ""); setPage(1); }}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                type === t.value
                  ? "bg-gray-700 text-white"
                  : "bg-gray-800 text-gray-500 hover:bg-gray-700"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse h-64" />
          ))}
        </div>
      ) : airdrops.length === 0 ? (
        <div className="text-center py-20 text-gray-500">Không có airdrop nào phù hợp.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {airdrops.map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={clsx(
                "w-9 h-9 rounded-lg text-sm transition-colors",
                page === p
                  ? "bg-brand text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
