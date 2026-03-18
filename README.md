# 🚀 CryptoNews VN

Web app tin tức crypto với Django REST API + Next.js Frontend.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Backend | Django 5 + Django REST Framework |
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL |
| Cache | Redis |
| Task Queue | Celery + Celery Beat |
| AI | Claude API (Anthropic) |
| Crypto Data | CoinGecko API |
| Auth | djangorestframework-simplejwt |

## Cấu trúc dự án

```
cryptonews/
├── backend/                    # Django
│   ├── apps/
│   │   ├── news/               # Bài viết, danh mục, tags
│   │   ├── airdrops/           # Airdrop listing
│   │   ├── crypto_prices/      # Giá coin (CoinGecko)
│   │   └── accounts/           # Auth, user profile
│   ├── crawler/                # RSS crawler tasks
│   ├── config/                 # settings, urls, wsgi
│   ├── celery.py               # Celery + periodic tasks
│   └── requirements.txt
│
├── frontend/                   # Next.js
│   └── src/
│       ├── app/
│       │   ├── page.tsx        # Trang chủ
│       │   ├── news/           # Danh sách + chi tiết bài viết
│       │   ├── airdrops/       # Danh sách + chi tiết airdrop
│       │   ├── prices/         # Bảng giá coin
│       │   └── search/         # Tìm kiếm
│       ├── components/
│       │   ├── layout/         # Navbar
│       │   ├── news/           # ArticleCard
│       │   ├── airdrops/       # AirdropCard
│       │   └── crypto/         # PriceTicker, PriceTable
│       ├── hooks/              # useApi, useDebounce
│       ├── lib/                # axios api client
│       └── types/              # TypeScript types
│
└── docker-compose.yml          # Full stack local dev

```

## API Endpoints

```
GET /api/v1/news/articles/          # Danh sách bài viết
GET /api/v1/news/articles/{slug}/   # Chi tiết bài
GET /api/v1/news/articles/trending/ # Bài trending
GET /api/v1/news/articles/latest/   # Bài mới nhất
GET /api/v1/news/categories/        # Danh mục

GET /api/v1/airdrops/               # Danh sách airdrop
GET /api/v1/airdrops/{slug}/        # Chi tiết airdrop

GET /api/v1/crypto/prices/          # Giá top 100 coin
GET /api/v1/crypto/prices/top10/    # Top 10
GET /api/v1/crypto/prices/gainers/  # Tăng mạnh nhất
GET /api/v1/crypto/prices/losers/   # Giảm mạnh nhất

POST /api/v1/auth/token/            # Đăng nhập
POST /api/v1/auth/token/refresh/    # Refresh token
```

## Chạy local với Docker

```bash
# 1. Clone và setup env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local

# 2. Điền API keys vào backend/.env
# - ANTHROPIC_API_KEY=sk-ant-...
# - COINGECKO_API_KEY=CG-...  (optional)

# 3. Chạy toàn bộ stack
docker compose up

# 4. Tạo superuser Django
docker compose exec backend python manage.py createsuperuser

# 5. Chạy crawl thủ công lần đầu
docker compose exec backend python manage.py shell -c "from crawler.tasks import crawl_all_feeds; crawl_all_feeds()"
```

Truy cập:
- Frontend: http://localhost:3000
- Django Admin: http://localhost:8000/admin
- API: http://localhost:8000/api/v1

## Chạy local không có Docker

```bash
# Backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # điền thông tin DB, Redis
python manage.py migrate
python manage.py runserver

# Celery (terminal riêng)
celery -A celery worker --loglevel=info
celery -A celery beat --loglevel=info

# Frontend (terminal riêng)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Celery Schedule mặc định

| Task | Schedule |
|---|---|
| Crawl RSS feeds | Mỗi 15 phút |
| Cập nhật giá coin | Mỗi 2 phút |
| AI summarize bài pending | Mỗi 30 phút |
| Cleanup bài cũ > 90 ngày | Mỗi ngày lúc 2:00 sáng |
