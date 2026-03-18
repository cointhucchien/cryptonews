"use client";

import { useTop10 } from "@/hooks/useApi";
import { TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";

function formatPrice(price: number | string) {
  const p = Number(price);
  if (p >= 1000) return `$${p.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  if (p >= 1) return `$${p.toFixed(2)}`;
  return `$${p.toFixed(6)}`;
}

export default function PriceTicker() {
  const { data: coins, isLoading } = useTop10();

  if (isLoading || !coins?.length) {
    return (
      <div className="bg-gray-900 border-b border-gray-800 h-8 flex items-center px-4">
        <div className="animate-pulse h-3 w-64 bg-gray-800 rounded" />
      </div>
    );
  }

  const items = [...coins, ...coins];

  return (
    <div className="bg-gray-900 border-b border-gray-800 h-8 overflow-hidden flex items-center">
      <div className="ticker-wrap flex-1">
        <div className="ticker-content flex items-center gap-6 px-4">
          {items.map((coin, i) => {
            const isUp = Number(coin.change_24h) >= 0;
            return (
              <div key={`${coin.coin_id}-${i}`} className="flex items-center gap-1.5 shrink-0">
                {coin.logo && (
                  <Image src={coin.logo} alt={coin.symbol} width={14} height={14} className="rounded-full" />
                )}
                <span className="text-xs font-medium text-gray-300">{coin.symbol}</span>
                <span className="text-xs text-white font-mono">{formatPrice(coin.price_usd)}</span>
                <span className={`text-xs flex items-center gap-0.5 ${isUp ? "text-green-400" : "text-red-400"}`}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {Math.abs(Number(coin.change_24h)).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
