"use client";

import Image from "next/image";
import { useCryptoPrices } from "@/hooks/useApi";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import type { CryptoPrice } from "@/types";

function formatPrice(price: number | string) {
  const p = Number(price);
  if (p >= 1000) return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  if (p >= 0.01) return `$${p.toFixed(4)}`;
  return `$${p.toFixed(8)}`;
}

function formatBigNumber(n: number | string | null) {
  if (!n) return "—";
  const num = Number(n);
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  return `$${num.toLocaleString()}`;
}

function PriceChange({ value }: { value: number | string | null }) {
  if (value == null) return <span className="text-gray-600">—</span>;
  const v = Number(value);
  const isUp = v >= 0;
  return (
    <span className={clsx("flex items-center justify-end gap-0.5 text-sm font-mono", isUp ? "text-green-400" : "text-red-400")}>
      {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {Math.abs(v).toFixed(2)}%
    </span>
  );
}

interface Props {
  limit?: number;
  showRefresh?: boolean;
}

export default function PriceTable({ limit, showRefresh = true }: Props) {
  const { data, isLoading, isFetching, refetch } = useCryptoPrices();
  const coins: CryptoPrice[] = limit ? (data?.results ?? []).slice(0, limit) : (data?.results ?? []);

  if (isLoading) {
    return (
      <div className="card overflow-hidden">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-800 animate-pulse">
            <div className="w-6 h-4 bg-gray-800 rounded" />
            <div className="w-8 h-8 bg-gray-800 rounded-full" />
            <div className="w-24 h-4 bg-gray-800 rounded" />
            <div className="flex-1" />
            <div className="w-20 h-4 bg-gray-800 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={clsx("card overflow-hidden", isFetching && "opacity-80 transition-opacity")}>
      <div className="grid grid-cols-[2rem_2rem_1fr_repeat(4,_8rem)] items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900/80">
        <span className="text-xs text-gray-500">#</span>
        <span />
        <span className="text-xs text-gray-500">Tên</span>
        <span className="text-xs text-gray-500 text-right">Giá</span>
        <span className="text-xs text-gray-500 text-right hidden sm:block">1h</span>
        <span className="text-xs text-gray-500 text-right">24h</span>
        <span className="text-xs text-gray-500 text-right hidden md:block">Market Cap</span>
      </div>

      {coins.map((coin) => (
        <div
          key={coin.coin_id}
          className="grid grid-cols-[2rem_2rem_1fr_repeat(4,_8rem)] items-center gap-2 px-4 py-3
                     border-b border-gray-800 last:border-0 hover:bg-gray-800/50 transition-colors cursor-pointer"
        >
          <span className="text-xs text-gray-600 font-mono">{coin.rank}</span>
          <div className="w-7 h-7 relative">
            {coin.logo && (
              <Image src={coin.logo} alt={coin.symbol} fill className="object-contain rounded-full" />
            )}
          </div>
          <div>
            <span className="text-sm font-medium text-white">{coin.name}</span>
            <span className="ml-2 text-xs text-gray-500 font-mono">{coin.symbol}</span>
          </div>
          <span className="text-sm font-mono text-white text-right">{formatPrice(coin.price_usd)}</span>
          <div className="hidden sm:block"><PriceChange value={coin.change_1h} /></div>
          <div><PriceChange value={coin.change_24h} /></div>
          <span className="text-sm text-gray-400 text-right hidden md:block">{formatBigNumber(coin.market_cap)}</span>
        </div>
      ))}

      {showRefresh && (
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900/50 border-t border-gray-800">
          <span className="text-xs text-gray-600">Cập nhật mỗi 2 phút · Nguồn: CoinGecko</span>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw size={11} className={isFetching ? "animate-spin" : ""} />
            Làm mới
          </button>
        </div>
      )}
    </div>
  );
}
