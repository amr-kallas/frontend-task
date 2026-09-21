# Mini Store — Next.js SSR

A small product catalog built on real server-side rendering with the Next.js App Router, using data from [FakeStoreAPI](https://fakestoreapi.com).

- **Live demo:** _add the Vercel URL here_
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, `jose` (session signing). No UI library.

| Route            | What it does                                                                    |
| ---------------- | ------------------------------------------------------------------------------- |
| `/products`      | Product table, rendered on every request, paginated on the server (`?page=N`).  |
| `/products/[id]` | Product details with metadata built from the product. Unknown id → real `404`.  |
| `/admin`         | Protected by a session cookie, checked on the server. No session → `307` to `/login`. |
| `/login`         | Credentials are checked against FakeStoreAPI; the app then issues its own session. |

**Demo login** (FakeStoreAPI's public test user): `mor_2314` / `83r5^_`

---

## Getting started

```bash
cp .env.example .env    # then fill in SESSION_SECRET
npm install
npm run dev
```

| Variable         | Purpose                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| `API_BASE_URL`   | Upstream API, `https://fakestoreapi.com`.                                |
| `SESSION_SECRET` | Signs the session cookie (at least 32 characters): `openssl rand -base64 32`. |

On Vercel, set both variables in **Project → Settings → Environment Variables**.

---

## Project structure

```
src/
├── proxy.ts                    # Next 16's name for middleware: guards /admin before rendering
├── app/
│   ├── layout.tsx              # header + title template
│   ├── error.tsx, not-found.tsx
│   ├── products/
│   │   ├── _components/        # products-only UI: table columns, section, skeleton, details
│   │   ├── (list)/             # route group → still /products
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   └── error.tsx
│   │   └── [id]/
│   │       ├── page.tsx        # generateMetadata + notFound()
│   │       └── not-found.tsx
│   ├── admin/                  # page.tsx + _components/
│   └── login/                  # page.tsx + _components/login-form.tsx
├── actions/auth.actions.ts     # login / logout Server Actions
├── services/                   # API-specific data access (server-only)
├── lib/
│   ├── fetch.ts                # http client: timeout, ApiError, typed cache policy
│   └── auth/                   # session.ts (sign/verify cookie), dal.ts (verifySession)
├── components/
│   ├── ui/                     # generic: table/, pagination/, button/, input/, skeleton/, empty-state/
│   └── layout/                 # site-header, page-header
├── constants/                  # api-routes.ts, routes.ts
└── types/
```

---

## Architecture decisions

**Layered data access.** `lib/fetch.ts` knows HTTP (timeouts, errors, cache policy). `services/*` knows FakeStoreAPI (endpoints, pagination, "not found"). Pages only call services. Services and session code import `server-only`, so they fail the build if a Client Component ever imports them.

**Server-first components.** Everything is a Server Component except the two that must run in the browser: `error.tsx` (error boundaries are client-only) and `LoginForm` (pending state and inline errors). `Table` and `Pagination` are generic Server Components. Pagination is plain `<Link>`s to `?page=N` (real `<a>` tags), so every page has its own shareable, server-rendered URL and no client state.

**Server-side pagination.** FakeStoreAPI supports `?limit` but no offset, so it cannot return "page 3" by itself. The service fetches the collection, slices it on the server and returns `IPaginationResponse<Product>`. The browser only receives the rows for the current page. Invalid values (`?page=abc`, `?page=-1`) fall back to page 1. An out-of-range page (`?page=99`) shows an empty state.

**Real 404 → `(list)` route group.** Once Next.js starts streaming a response, the status is already `200` and cannot change. A `loading.tsx` in `app/products/` would wrap `/products/[id]` too, so `notFound()` there would produce a "soft 404" (200 + `noindex`). Moving the list into the `(list)` group scopes its `loading.tsx` to the list only. The details page then calls `notFound()` before anything is sent, and an unknown id gets an actual `404` status.

**Loading states.** `loading.tsx` is shown immediately when navigating to `/products`. Inside the page, `<Suspense key={page}>` streams the table: the header arrives right away and the rows follow, and the key makes the skeleton show again on every page change. Both use the same skeleton component, so nothing jumps when one replaces the other.

**Auth, checked twice on the server.**
1. `proxy.ts` verifies the cookie's signature and expiry, then redirects with a `307` before any rendering happens. Expired or forged cookies are also deleted.
2. `verifySession()` in the admin page checks again. Proxy is an optimistic layer, and the page should not depend on it having run. This is the defense against bypasses like CVE-2025-29927.

The session is an HS256 JWT in an `httpOnly`, `sameSite=lax` cookie (`secure` in production). FakeStoreAPI's own token is not stored: it is signed with a secret we don't have, so the server could never verify it. FakeStoreAPI checks the credentials, and the app issues a session that it can verify.

**Input validation.** Product ids must be numeric before they reach the API. Without that check, `/products/..%2Fusers` would resolve upstream to `/users`.

---

## Caching decision

**Decision: `no-store` for the products list** (`PRODUCTS_LIST_CACHE` in `services/products.service.ts`).

The policy is passed explicitly rather than inherited from the http layer's default. If that default changes later, this page won't change silently.

**Why:**

1. The task requires the list to fetch from the API **on every request**. `no-store` does exactly that.
2. The page is dynamic anyway because it reads `searchParams`, so its HTML is never cached. The only open question was whether the upstream `fetch` should go through the Data Cache. With `no-store`, a price change shows up on the next request, with no stale window.
3. The dataset is small (20 products, about 10 KB), so fetching it again costs little.

**Trade-off:** every request depends on FakeStoreAPI's latency and availability. The app handles this with an 8-second timeout in the http layer, a streamed skeleton, and `error.tsx` with a retry button. If traffic grew, the next step would be `{ mode: "revalidate", seconds: 60, tags: ["products"] }`. The `CachePolicy` union in `lib/fetch.ts` makes that a one-line change, and the tag allows on-demand invalidation.

The details page uses the same policy, so a product never shows one price in the list and another on its own page.

---

## SSR decisions

| Page             | Type    | Reason |
| ---------------- | ------- | ------ |
| `/products`      | **SSR** | Rendered per request: it reads `?page=` and fetches with `no-store`. Pagination runs on the server, and the HTML always contains the current data. |
| `/products/[id]` | **SSR** | The product is fetched on the server for each request. `generateMetadata` builds the title and description from the real data. Whether the id exists is known before the response starts, which is what allows a real `404`. (ISR would also work, since product data rarely changes. SSR keeps it consistent with the list.) |
| `/admin`         | **SSR** | Depends on the request's cookie, so it must never be cached or shared between users. The session is checked on the server (Proxy + page). CSR is excluded because the check would run in the browser. |

---

## Problems found while building

**FakeStoreAPI doesn't return 404.** An unknown id returns `200` with an **empty body**. The http layer called `res.json()` on it, which threw "malformed JSON", so a missing product showed the error page instead of the 404 page. Fix: the http layer now treats an empty body as "no content" (like a `204`), and the service maps it to `null`. The page then calls `notFound()`. Together with the route-group decision above, `/products/9999` now returns a real `404` with the custom page.

**Cache-related issue in the data layer: request memoization was silently off.** Next.js deduplicates identical `GET` fetches within one render. That is how `generateMetadata` and the page can both request the same product without making two calls. However, a fetch that receives an `AbortSignal` is **never memoized**, and the http layer attaches `AbortSignal.timeout()` to every request. The details page was therefore calling the API twice per request. Fix: `getProductById` is wrapped in React `cache()`, which dedupes at the function level no matter what `fetch` options are used.

---

## Quick verification

```bash
curl -sI localhost:3000/products/9999 | head -1   # HTTP/1.1 404 Not Found
curl -sI localhost:3000/admin | grep -i location  # location: /login (307)
curl -s localhost:3000/products/1 | grep -o '<title>[^<]*'
```

To see `error.tsx`, point `API_BASE_URL` at an unreachable address (for example `http://127.0.0.1:9`) and open `/products`.
