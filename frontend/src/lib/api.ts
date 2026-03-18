import axios from "axios";
import type {
  Article, Airdrop, CryptoPrice, Category,
  PaginatedResponse, ArticleQueryParams, AirdropQueryParams,
} from "@/types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor — attach auth token ───────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor — handle errors ──────────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    return Promise.reject(error);
  }
);

// ── News API ──────────────────────────────────────────────────────────────────
export const newsApi = {
  getArticles: (params?: ArticleQueryParams) =>
    api.get<PaginatedResponse<Article>>("/news/articles/", { params }),

  getArticle: (slug: string) =>
    api.get<Article>(`/news/articles/${slug}/`),

  getTrending: () =>
    api.get<Article[]>("/news/articles/trending/"),

  getLatest: () =>
    api.get<Article[]>("/news/articles/latest/"),

  getCategories: () =>
    api.get<PaginatedResponse<Category>>("/news/categories/"),
};

// ── Airdrop API ───────────────────────────────────────────────────────────────
export const airdropApi = {
  getAirdrops: (params?: AirdropQueryParams) =>
    api.get<PaginatedResponse<Airdrop>>("/airdrops/", { params }),

  getAirdrop: (slug: string) =>
    api.get<Airdrop>(`/airdrops/${slug}/`),
};

// ── Crypto Price API ──────────────────────────────────────────────────────────
export const cryptoApi = {
  getPrices: (page = 1) =>
    api.get<PaginatedResponse<CryptoPrice>>("/crypto/prices/", { params: { page, page_size: 100 } }),

  getTop10: () =>
    api.get<CryptoPrice[]>("/crypto/prices/top10/"),

  getGainers: () =>
    api.get<CryptoPrice[]>("/crypto/prices/gainers/"),

  getLosers: () =>
    api.get<CryptoPrice[]>("/crypto/prices/losers/"),
};

export default api;
