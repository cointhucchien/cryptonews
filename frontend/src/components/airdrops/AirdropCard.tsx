import Link from "next/link";
import Image from "next/image";
import { Clock, ExternalLink, Twitter, CheckCircle, Star } from "lucide-react";
import type { Airdrop } from "@/types";
import { clsx } from "clsx";

const STATUS_CONFIG = {
  upcoming: { label: "Sắp diễn ra", cls: "bg-yellow-950 text-yellow-400 border-yellow-900" },
  active:   { label: "Đang diễn ra", cls: "bg-green-950 text-green-400 border-green-900" },
  ended:    { label: "Đã kết thúc", cls: "bg-gray-800 text-gray-500 border-gray-700" },
};

const TYPE_CONFIG = {
  free:    { label: "Free", cls: "bg-blue-950 text-blue-400" },
  task:    { label: "Task", cls: "bg-purple-950 text-purple-400" },
  holder:  { label: "Holder", cls: "bg-orange-950 text-orange-400" },
  testnet: { label: "Testnet", cls: "bg-cyan-950 text-cyan-400" },
};

interface Props {
  airdrop: Airdrop;
}

export default function AirdropCard({ airdrop }: Props) {
  const status = STATUS_CONFIG[airdrop.status];
  const type = TYPE_CONFIG[airdrop.airdrop_type];
  const displayDesc = airdrop.description_vi || airdrop.description;

  return (
    <div className="card flex flex-col">
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {airdrop.logo ? (
              <Image src={airdrop.logo} alt={airdrop.name} width={40} height={40} className="rounded-xl" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-lg">
                🪙
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-semibold text-white text-sm">{airdrop.name}</h3>
                {airdrop.is_verified && (
                  <CheckCircle size={13} className="text-blue-400" />
                )}
                {airdrop.is_featured && (
                  <Star size={13} className="text-yellow-400 fill-yellow-400" />
                )}
              </div>
              {airdrop.token_symbol && (
                <span className="text-xs text-gray-500 font-mono">${airdrop.token_symbol}</span>
              )}
            </div>
          </div>

          {/* Status badge */}
          <span className={clsx("text-xs px-2 py-0.5 rounded-full border shrink-0", status.cls)}>
            {status.label}
          </span>
        </div>

        {/* Type badge */}
        <div className="flex items-center gap-2">
          <span className={clsx("text-xs px-2 py-0.5 rounded-md font-medium", type.cls)}>
            {type.label}
          </span>
          {airdrop.total_allocation && (
            <span className="text-xs text-gray-400 bg-gray-800 px-2 py-0.5 rounded-md">
              {airdrop.total_allocation}
            </span>
          )}
        </div>

        {/* Description */}
        {displayDesc && (
          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{displayDesc}</p>
        )}

        {/* Requirements preview */}
        {airdrop.requirements?.length > 0 && (
          <ul className="flex flex-col gap-1">
            {airdrop.requirements.slice(0, 3).map((req, i) => (
              <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-brand shrink-0" />
                {req}
              </li>
            ))}
            {airdrop.requirements.length > 3 && (
              <li className="text-xs text-gray-600">+{airdrop.requirements.length - 3} yêu cầu khác</li>
            )}
          </ul>
        )}

        {/* Time remaining */}
        {airdrop.time_remaining && airdrop.status === "active" && (
          <div className="flex items-center gap-1.5 text-xs text-orange-400 bg-orange-950/40 px-2.5 py-1.5 rounded-lg">
            <Clock size={11} />
            Còn lại: <span className="font-medium">{airdrop.time_remaining}</span>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <Link
          href={`/airdrops/${airdrop.slug}`}
          className="flex-1 text-center py-2 rounded-lg bg-brand text-white text-xs font-medium
                     hover:bg-brand-dark transition-colors"
        >
          Xem chi tiết
        </Link>
        {airdrop.website && (
          <a
            href={airdrop.website}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <ExternalLink size={13} />
          </a>
        )}
        {airdrop.twitter_url && (
          <a
            href={airdrop.twitter_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:text-sky-400 hover:bg-gray-700 transition-colors"
          >
            <Twitter size={13} />
          </a>
        )}
      </div>
    </div>
  );
}
