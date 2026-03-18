"use client";

import { useState } from "react";
import PriceTable from "@/components/crypto/PriceTable";
import { useGainers, useLosers } from "@/hooks/useApi";
import { TrendingUp, TrendingDown, List } from "lucide-react";
import { clsx } from "clsx";
import Image from "next/image";

type Tab = "all" | "gainers" | "losers";

function MiniCoinList({ coins, type }: { coins: any[]; type: "gainer" | "loser" }) {
  return (
    <div className="flex flex-col gap-1">
      {coins.map((coin) => (
        <div key={coin.coin_id} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/60 transition-colors">
          {coin.logo && <Image src={coin.logo} alt={coin.symbol} width={24} height={24} className="rounded-full" />}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white">{coin.symbol}</p>
            <p className="text-xs text-gray-500 font-mono truncate">
              {coin.price_usd >= 1 ? `$${Number(coin.price_usd).toFixed(2)}` : `$${Number(coin.price_usd).toFixed(6)}`}
            </p>
          </div>
          <span className={clsx("text-sm font-medium font-mono", type === "gainer" ? "text-green-400" : "text-red-400")}>
            {type === "gainer" ? "+" : ""}{Number(coin.change_24h).toFixed(2)}%
          </span>
        </div>
      ))}
    </div>
  );
}

export default function PricesPage() {
  const [tab, setTab] = useState<Tab>("all");
  const { data: gainers } = useGainers();
  const { data: losers } = useLosers();

  const tabs = [
    { id: "all" as Tab, label: "Tất cả", icon: List },
    { id: "gainers" as Tab, label: "Tăng mạnh", icon: TrendingUp },
    { id: "losers" as Tab, label: "Giảm mạnh", icon: TrendingDown },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Bảng giá Crypto</h1>
        <p className="text-sm text-gray-400">Giá thị trường cập nhật tự động mỗi 2 phút</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={clsx(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              tab === id
                ? "bg-brand text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
            )}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "all" && <PriceTable />}

      {tab === "gainers" && (
        <div className="card p-4">
          <h2 className="section-title mb-4">🚀 Top tăng giá 24h</h2>
          {gainers ? <MiniCoinList coins={gainers} type="gainer" /> : (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-800 rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "losers" && (
        <div className="card p-4">
          <h2 className="section-title mb-4">📉 Top giảm giá 24h</h2>
          {losers ? <MiniCoinList coins={losers} type="loser" /> : (
            <div className="animate-pulse space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-gray-800 rounded-lg" />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
