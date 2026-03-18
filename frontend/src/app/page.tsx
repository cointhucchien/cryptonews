import { Suspense } from "react";
import ArticleCard from "@/components/news/ArticleCard";
import AirdropCard from "@/components/airdrops/AirdropCard";
import PriceTable from "@/components/crypto/PriceTable";
import { newsApi, airdropApi, cryptoApi } from "@/lib/api";

// Server component — fetch at build/request time for SSR
async function LatestNews() {
  try {
    const res = await newsApi.getLatest();
    const articles = res.data;
    return (
      <section>
        <h2 className="section-title mb-4">Tin mới nhất</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.slice(0, 6).map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    );
  } catch {
    return <p className="text-gray-500 text-sm">Không thể tải tin tức.</p>;
  }
}

async function FeaturedAirdrops() {
  try {
    const res = await airdropApi.getAirdrops({ is_featured: true, status: "active" });
    const airdrops = res.data.results;
    if (!airdrops.length) return null;
    return (
      <section>
        <h2 className="section-title mb-4">Airdrop nổi bật</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {airdrops.slice(0, 3).map((airdrop) => (
            <AirdropCard key={airdrop.id} airdrop={airdrop} />
          ))}
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col gap-10">
      {/* Crypto Price Table */}
      <section>
        <h2 className="section-title mb-4">Giá coin hôm nay</h2>
        <PriceTable />
      </section>

      {/* Latest News */}
      <Suspense fallback={<div className="animate-pulse h-64 bg-gray-900 rounded-xl" />}>
        <LatestNews />
      </Suspense>

      {/* Featured Airdrops */}
      <Suspense fallback={<div className="animate-pulse h-48 bg-gray-900 rounded-xl" />}>
        <FeaturedAirdrops />
      </Suspense>
    </div>
  );
}
