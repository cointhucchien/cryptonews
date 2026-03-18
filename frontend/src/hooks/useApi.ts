import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { newsApi, airdropApi, cryptoApi } from "@/lib/api";
import type { ArticleQueryParams, AirdropQueryParams } from "@/types";

// ── Query Keys ────────────────────────────────────────────────────────────────
export const queryKeys = {
  articles: (params?: ArticleQueryParams) => ["articles", params] as const,
  article: (slug: string) => ["article", slug] as const,
  trending: () => ["articles", "trending"] as const,
  latest: () => ["articles", "latest"] as const,
  categories: () => ["categories"] as const,
  airdrops: (params?: AirdropQueryParams) => ["airdrops", params] as const,
  airdrop: (slug: string) => ["airdrop", slug] as const,
  prices: () => ["crypto", "prices"] as const,
  top10: () => ["crypto", "top10"] as const,
  gainers: () => ["crypto", "gainers"] as const,
  losers: () => ["crypto", "losers"] as const,
};

// ── News Hooks ────────────────────────────────────────────────────────────────
export const useArticles = (params?: ArticleQueryParams) =>
  useQuery({
    queryKey: queryKeys.articles(params),
    queryFn: () => newsApi.getArticles(params).then((r) => r.data),
    staleTime: 1000 * 60 * 2,   // 2 phút
  });

export const useArticle = (slug: string) =>
  useQuery({
    queryKey: queryKeys.article(slug),
    queryFn: () => newsApi.getArticle(slug).then((r) => r.data),
    enabled: !!slug,
  });

export const useTrending = () =>
  useQuery({
    queryKey: queryKeys.trending(),
    queryFn: () => newsApi.getTrending().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const useLatest = () =>
  useQuery({
    queryKey: queryKeys.latest(),
    queryFn: () => newsApi.getLatest().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
  });

export const useCategories = () =>
  useQuery({
    queryKey: queryKeys.categories(),
    queryFn: () => newsApi.getCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 30,  // 30 phút
  });

// ── Airdrop Hooks ─────────────────────────────────────────────────────────────
export const useAirdrops = (params?: AirdropQueryParams) =>
  useQuery({
    queryKey: queryKeys.airdrops(params),
    queryFn: () => airdropApi.getAirdrops(params).then((r) => r.data),
    staleTime: 1000 * 60 * 5,
  });

export const useAirdrop = (slug: string) =>
  useQuery({
    queryKey: queryKeys.airdrop(slug),
    queryFn: () => airdropApi.getAirdrop(slug).then((r) => r.data),
    enabled: !!slug,
  });

// ── Crypto Price Hooks ────────────────────────────────────────────────────────
export const useCryptoPrices = () =>
  useQuery({
    queryKey: queryKeys.prices(),
    queryFn: () => cryptoApi.getPrices().then((r) => r.data),
    refetchInterval: 1000 * 60 * 2,   // auto-refetch mỗi 2 phút
    staleTime: 1000 * 60 * 2,
  });

export const useTop10 = () =>
  useQuery({
    queryKey: queryKeys.top10(),
    queryFn: () => cryptoApi.getTop10().then((r) => r.data),
    refetchInterval: 1000 * 60 * 2,
  });

export const useGainers = () =>
  useQuery({
    queryKey: queryKeys.gainers(),
    queryFn: () => cryptoApi.getGainers().then((r) => r.data),
    refetchInterval: 1000 * 60 * 2,
  });

export const useLosers = () =>
  useQuery({
    queryKey: queryKeys.losers(),
    queryFn: () => cryptoApi.getLosers().then((r) => r.data),
    refetchInterval: 1000 * 60 * 2,
  });
