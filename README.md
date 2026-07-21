# Commerce Platform

A full-stack commerce application built with React, Express, and MongoDB. The repository is organized as a monorepo with separate frontend and backend applications.

## Project Structure

```
.
├── apps
│   ├── api
│   └── web
├── package.json
├── package-lock.json
└── README.md
```

- `apps/api` contains the Express backend.
- `apps/web` contains the React frontend.
- The project is organized as a JavaScript monorepo.

## Features

### Authentication

- Express Session
- User registration
- Login and logout
- Email OTP verification
- OTP resend

### Products

- Create product
- Retrieve product
- Update product
- Delete product

### Categories

- Create category
- Retrieve category

### Users

- Retrieve authenticated user profile

### Cart

- View cart
- Add item
- Remove item

### Orders

- Create order from cart
- View order history
- View order details

### Payments

- Payment webhook integration (HMAC-SHA256 signature verification)

## Technology Stack

### Backend

- Node.js
- Express
- Express Session
- MongoDB
- Mongoose

### Frontend

- React
- Vite

## Requirements

- Node.js 20.12.0 or newer
- A running MongoDB instance

## Getting Started

### Install dependencies

```sh
npm i
```

### Configure environment variables

The backend requires several environment variables, including a valid MongoDB connection string. Use `apps/api/.env.example` as a reference when creating your own `.env` file.

> The example file is not intended to run without modification. You must provide your own MongoDB URI and any other required credentials before starting the application.

### Start the development server

From the project root:

```sh
# Start the backend
npm run dev -w api

# Start the frontend
npm run dev -w web
```

The frontend dev server proxies `/api` to the backend at
`http://localhost:3000`, so no CORS configuration is needed while developing.
Authentication uses the session cookie set by the backend.

The web app is a minimal, mobile-friendly storefront: browse and search
products, manage a cart, check out, view order history and details, and manage
your account. It is styled with Tailwind CSS and DaisyUI.

## API Documentation

Interactive API documentation is available while the backend is running at `/api/docs`.

## API Endpoints

All API endpoints are prefixed with `/api/v1/`.

### Authentication

Prefixed with `/auth/`.

| Method | Endpoint      |
| ------ | ------------- |
| POST   | `/signup`     |
| POST   | `/resend-otp` |
| POST   | `/verify-otp` |
| POST   | `/login`      |
| POST   | `/logout`     |

### Users

Prefixed with `/user/`.

| Method | Endpoint       |
| ------ | -------------- |
| GET    | `/get-profile` |

### Categories

Prefixed with `/category/`.

| Method | Endpoint                    |
| ------ | --------------------------- |
| POST   | `/create-category`          |
| GET    | `/get-category/:categoryId` |
| GET    | `/list-categories`          |

### Products

Prefixed with `/product/`.

| Method | Endpoint                     |
| ------ | ---------------------------- |
| POST   | `/create-product`            |
| GET    | `/get-product/:productId`    |
| GET    | `/list-products`             |
| PATCH  | `/update-product/:productId` |
| DELETE | `/delete-product/:productId` |

### Cart

Prefixed with `/cart/`. Requires an authenticated session.

| Method | Endpoint                  |
| ------ | ------------------------- |
| GET    | `/get-cart`               |
| POST   | `/add-item`               |
| DELETE | `/remove-item/:productId` |

### Orders

Prefixed with `/order/`. Requires an authenticated session.

| Method | Endpoint                  |
| ------ | ------------------------- |
| POST   | `/create-order`           |
| GET    | `/order-history`          |
| GET    | `/order-details/:orderId` |

### Payments

Prefixed with `/payment/`. The webhook verifies an HMAC-SHA256 signature sent in the `x-payment-signature` header against `PAYMENT_WEBHOOK_SECRET`.

| Method | Endpoint   |
| ------ | ---------- |
| POST   | `/webhook` |

## Roadmap

Planned work is tracked in [ROADMAP.md](ROADMAP.md).

## Attribution

This project originated from a coursework assignment and has been substantially reorganized and extended. The current repository represents continued development beyond the original class requirements.

## License

This project is released under the Unlicense. See [LICENSE.txt](LICENSE.txt) for details.
