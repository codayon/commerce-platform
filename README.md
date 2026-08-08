# Commerce Platform

Express + MongoDB API and a React (Vite) storefront, organized as an npm-workspaces monorepo.

## Structure

- `apps/api` — Express backend (port 3000)
- `apps/web` — React storefront (Vite dev server)

## Requirements

- Node.js 20.12.0+
- A running MongoDB instance

## Setup

```sh
npm i

# Backend env: copy apps/api/.env.example to apps/api/.env and fill in
#   MONGODB_URI, SESSION_SECRET, EMAIL_USER, EMAIL_PASS, PAYMENT_WEBHOOK_SECRET
```

## Run

```sh
npm run dev -w api   # http://localhost:3000
npm run dev -w web   # proxies /api -> http://localhost:3000
```

## API

Base path: `/api/v1/`. Endpoints marked (auth) require a session cookie.

```
Auth        /auth/      POST /signup /resend-otp /verify-otp /login /logout
User (auth) /user/      GET  /get-profile
Category    /category/  POST /create-category
                        GET  /get-category/:categoryId /list-categories
Product     /product/   POST /create-product
                        GET  /get-product/:productId /list-products
                        PATCH /update-product/:productId
                        DELETE /delete-product/:productId
Cart (auth) /cart/      GET  /get-cart
                        POST /add-item
                        PATCH /update-quantity/:productId
                        DELETE /remove-item/:productId
Order (auth) /order/    POST /create-order
                        GET  /order-history /order-details/:orderId
Payment     /payment/   POST /webhook   (HMAC-SHA256 via x-payment-signature)
```

License: Unlicense (see LICENSE.txt).
