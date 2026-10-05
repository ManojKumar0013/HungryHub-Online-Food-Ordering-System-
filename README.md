<div align="center">

# 🍔 HungryHub

### Online Food Ordering & Delivery Management System

![HungryHub Banner](https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80)

**A full-stack food ordering, kitchen display, delivery routing, and administration platform.**

[![React](https://img.shields.io/badge/Frontend-React_19_%7C_TypeScript_%7C_Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Backend-Express.js_4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL_14+-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Auth](https://img.shields.io/badge/Security-JWT_%7C_bcryptjs-F7DF1E?logo=jsonwebtokens&logoColor=black)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[Architecture](#-system-architecture) •
[Features](#-key-features--role-portals) •
[Database Schema](#-database-schema--design) •
[Demo Credentials](#-demo-accounts--credentials) •
[Quickstart](#-installation--setup-guide) •
[API Reference](#-api-endpoints-reference)

</div>

---

## 📌 Executive Summary

**HungryHub** is a comprehensive food delivery and restaurant management system built for modern culinary ecosystems and as a Database Management Systems (DBMS) project. Built with **React 19**, **TypeScript**, **Express**, and **PostgreSQL**, it connects customers, restaurant kitchens, delivery personnel, and platform administrators in one unified, real-time system.

The database follows relational design principles, using:

- **Disjoint specialization/generalization** hierarchies for user roles
- **Weak entities** (e.g., order items depend on their order)
- **1:1 mandatory relationships** between orders and payments
- **Declarative database triggers** to keep orders, payments, and dispatch consistent

---

## 🏛 System Architecture

HungryHub uses a decoupled client-server architecture.

```mermaid
graph TD
    subgraph Frontend ["Frontend Client (React 19 + TypeScript + Vite)"]
        UI["UI Components (Tailwind CSS v4)"]
        Router["Role-based Routing"]
        State["API Client / State"]
    end

    subgraph Backend ["Backend API (Express.js 4)"]
        Auth["JWT Auth Middleware"]
        Routes["REST Routes"]
        Services["Business Logic"]
    end

    subgraph DB ["Database (PostgreSQL 14+)"]
        Tables[("Relational Tables")]
        Triggers["Triggers & Constraints"]
    end

    UI --> Router --> State
    State -->|"HTTPS / JSON"| Auth
    Auth --> Routes --> Services
    Services -->|"SQL"| Tables
    Triggers -.-> Tables
```

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express.js 4 |
| Database | PostgreSQL 14+ |
| Security | JWT, bcryptjs |

---

## ✨ Key Features & Role Portals

| Portal | Capabilities |
|--------|--------------|
| 🧑‍🍳 **Customer** | Browse restaurants and menus, manage cart, place orders, pay, track order status, view history |
| 🍳 **Restaurant / Kitchen** | Manage menu items, live kitchen display for incoming orders, update preparation status |
| 🛵 **Delivery Partner** | Accept assigned deliveries, update delivery status, view route and history |
| 🛠 **Admin** | Manage users, restaurants, and orders; platform-wide analytics and oversight |

**Platform highlights**

- Role-based access control (RBAC) enforced with JWT
- Passwords hashed with bcryptjs
- Order lifecycle enforced at the database level via triggers
- Responsive UI built with Tailwind CSS

---

## 🗄 Database Schema & Design

### Core Entities

| Table | Description |
|-------|-------------|
| `users` | Generalized user entity (supertype) |
| `customers`, `restaurant_staff`, `delivery_partners`, `admins` | Disjoint specializations of `users` |
| `restaurants` | Restaurant profiles |
| `menu_items` | Items offered by a restaurant |
| `orders` | Customer orders |
| `order_items` | **Weak entity** dependent on `orders` |
| `payments` | **1:1 mandatory** with `orders` |
| `deliveries` | Dispatch and routing for an order |

### Design Concepts

- **Specialization/Generalization:** `users` is the supertype; each user belongs to exactly one role subtype (disjoint).
- **Weak Entity:** `order_items` is identified by `(order_id, item_no)` and cannot exist without its order.
- **1:1 Mandatory:** every order has exactly one payment record.
- **Triggers:** automatically keep order status, payment status, and delivery assignment in sync.

> 📎 Add your ER diagram here: `![ER Diagram](docs/er-diagram.png)`

---

## 🔑 Demo Accounts & Credentials

> ⚠️ For local development and demo only. Never use these in production.

| Role | Email | Password |
|------|-------|----------|
| Customer | `customer@hungryhub.com` | `Customer@123` |
| Restaurant | `restaurant@hungryhub.com` | `Restaurant@123` |
| Delivery | `delivery@hungryhub.com` | `Delivery@123` |
| Admin | `admin@hungryhub.com` | `Admin@123` |

---

## 🚀 Installation & Setup Guide

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/hungryhub.git
cd hungryhub
```

### 2. Set up the database

```bash
psql -U postgres -c "CREATE DATABASE hungryhub;"
psql -U postgres -d hungryhub -f database/schema.sql
psql -U postgres -d hungryhub -f database/seed.sql
```

### 3. Configure and run the backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Example `.env`:

```env
PORT=5000
DATABASE_URL=postgresql://postgres:password@localhost:5432/hungryhub
JWT_SECRET=change_this_secret
```

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📡 API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a JWT |

### Restaurants & Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/restaurants` | List restaurants |
| `GET` | `/api/restaurants/:id/menu` | Get a restaurant's menu |
| `POST` | `/api/menu` | Add a menu item (restaurant) |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Place an order |
| `GET` | `/api/orders/:id` | Get order details |
| `PATCH` | `/api/orders/:id/status` | Update order status |

### Delivery & Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/deliveries/assigned` | Deliveries assigned to the partner |
| `PATCH` | `/api/deliveries/:id/status` | Update delivery status |
| `GET` | `/api/admin/users` | List all users (admin only) |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push and open a Pull Request

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
