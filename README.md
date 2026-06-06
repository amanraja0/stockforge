# StockForge

StockForge is a full-stack inventory and order management system.

It includes:
- **Server**: Express + Sequelize + MySQL API for auth, products, suppliers, inventory logs, orders, and dashboard stats.
- **Client**: React + Vite dashboard UI with protected routes and role-based access.

## Prerequisites

- Node.js (LTS recommended)
- npm
- MySQL running locally or remotely

## Project Structure

- `./client` → frontend app
- `./server` → backend API

## Environment Variables (Server)

Create `./server/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
```

## Install Dependencies

```bash
cd client
npm install

cd ../server
npm install
```

## Run the Project

Use two terminals:

### 1) Start backend

```bash
cd server
npm run dev
```

Backend runs on `http://localhost:5000`.

### 2) Start frontend

```bash
cd client
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`) and calls the backend at `http://localhost:5000/api`.

## Useful Commands

### Client

```bash
cd client
npm run lint
npm run build
```

### Server

```bash
cd server
npm test
```
