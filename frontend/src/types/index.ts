// ── Article ───────────────────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  article_count: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export interface NewsSource {
  id: number;
  name: string;
  website: string;
  logo: string;
  language: string;
}

export type Sentiment = "bullish" | "bearish" | "neutral";

export interface Article {
  id: string;
  slug: string;
  title: string;
  title_vi: string;
  summary: string;
  summary_vi: string;
  content?: string;
  thumbnail: string;
  category: Category;
  source: NewsSource;
  tags: Tag[];
  sentiment: Sentiment;
  view_count: number;
  language: string;
  published_at: string;
  original_url?: string;
  ai_summarized?: boolean;
  ai_translated?: boolean;
}

// ── Airdrop ───────────────────────────────────────────────────────────────────
export type AirdropStatus = "upcoming" | "active" | "ended";
export type AirdropType = "free" | "task" | "holder" | "testnet";

export interface Airdrop {
  id: string;
  slug: string;
  name: string;
  logo: string;
  website: string;
  description: string;
  description_vi: string;
  token_symbol: string;
  total_allocation: string;
  estimated_value: number | null;
  airdrop_type: AirdropType;
  requirements: string[];
  guide_url: string;
  status: AirdropStatus;
  start_date: string | null;
  end_date: string | null;
  time_remaining: string | null;
  twitter_url: string;
  telegram_url: string;
  discord_url: string;
  is_featured: boolean;
  is_verified: boolean;
  view_count: number;
}

// ── Crypto Price ──────────────────────────────────────────────────────────────
export interface CryptoPrice {
  coin_id: string;
  symbol: string;
  name: string;
  logo: string;
  rank: number;
  price_usd: number;
  market_cap: number;
  volume_24h: number;
  change_1h: number;
  change_24h: number;
  change_7d: number;
  ath: number;
  updated_at: string;
}

// ── API Pagination ─────────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Query Params ──────────────────────────────────────────────────────────────
export interface ArticleQueryParams {
  page?: number;
  page_size?: number;
  category?: string;
  tag?: string;
  search?: string;
  language?: string;
  sentiment?: Sentiment;
  ordering?: string;
}

export interface AirdropQueryParams {
  page?: number;
  status?: AirdropStatus;
  airdrop_type?: AirdropType;
  search?: string;
  is_featured?: boolean;
}
