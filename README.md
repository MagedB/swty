
# swty — Full-Stack 

This project is a beginner-friendly full web app:
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express
- **Database:** PostgreSQL (via Docker Compose)

## Quick Start

1) **Start PostgreSQL (Docker)**
```bash
cd swty
docker compose up -d
```
The db runs at `localhost:5432` with user `swty`, password `swtypass`, database `swty`.

2) **Configure the backend**
```bash
cd server
cp .env.example .env
# (optional) update values in .env
npm install
npm run db:init
npm run db:seed
npm run dev
```
Backend starts on **http://localhost:5000**

3) **Run the frontend**
```bash
cd ../client
npm install
npm run dev
```
Front-end starts on **http://localhost:5173**

## Default Accounts
After seeding, you can register a new user from the UI or via API.
(Seeding only adds sample products.)

## API Base URL
Set `VITE_API_URL` in `client/.env` (defaults to `http://localhost:5000`).

---
