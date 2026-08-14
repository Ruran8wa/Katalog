# Katalog

A React + TypeScript e-commerce storefront with a mocked backend — product catalog with search/filtering, a shopping cart, authentication, order checkout, and an admin dashboard for managing products and variants.

There is no real backend: the "API" layer under `src/api` simulates network latency and reads/writes an in-memory dataset (`src/mocks/db.ts`), so the app runs entirely client-side.

## Tech stack

- [React 19](https://react.dev/) + [React Router 7](https://reactrouter.com/) for routing
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) for dev server and build
- [Tailwind CSS v4](https://tailwindcss.com/) + [Base UI](https://base-ui.com/) (unstyled primitives, e.g. the cart drawer) + [shadcn](https://ui.shadcn.com/)
- [Lucide](https://lucide.dev/) icons

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build         # typecheck + production build
npm run lint          # eslint
npm run format        # prettier --write
npm run format:check  # prettier --check
npm run preview       # preview a production build
```

## Routes

| Path                  | Access     | Description                                                         |
| --------------------- | ---------- | ------------------------------------------------------------------- |
| `/`                   | Public     | Product grid with keyword search, category, and price-range filters |
| `/products/:id`       | Public     | Product detail — variant picker, quantity, add to cart              |
| `/login`              | Public     | Sign in                                                             |
| `/admin`              | Admin only | Product list (including inactive), create new product               |
| `/admin/products/:id` | Admin only | Edit a product and its variants (`:id` is `new` to create)          |
| `*`                   | —          | 404 page                                                            |

Signing in as an admin lands on `/admin` and is confined to the dashboard — an admin account is redirected away from the storefront (`/`, `/products/:id`) and can't check out; non-admins can browse and buy but have no access to `/admin`.

## Auth & accounts

Auth is a mocked JWT flow (`src/api/mockJwt.ts`, `src/api/authService.ts`) with the token persisted to `localStorage`. Seeded accounts (`src/mocks/db.ts`):

| Role  | Email              | Password   |
| ----- | ------------------ | ---------- |
| USER  | `user@katalog.rw`  | `user123`  |
| ADMIN | `admin@katalog.rw` | `admin123` |

## Cart

The cart (`src/context/CartContext.tsx`, `src/components/CartDrawer.tsx`) is a right-side slide-over, persisted to `localStorage` and scoped per account (`katalog.cart.<userId>`, or `katalog.cart.guest` while signed out). Items added while browsing as a guest are merged into your cart on login; logging out never copies a cart back into the guest bucket.

## Project layout

```
src/
  api/          mocked "backend": auth, products, orders, session/token storage
  components/   shared UI (layout/nav, cart drawer, route guards, shadcn primitives)
  context/      React context providers (auth, cart)
  mocks/        in-memory seed data acting as the database
  pages/        route-level components
  types/        shared domain types
  utils/        small pure helpers (e.g. stock status derivation)
```
