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

## API Documentation

Interactive API documentation is available while the backend is running at `/api/docs`.

## API Endpoints

All API endpoints are prefixed with `/api/v1/`.

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | `/auth/signup`     |
| POST   | `/auth/login`      |
| POST   | `/auth/logout`     |
| POST   | `/auth/verify-otp` |
| POST   | `/auth/resend-otp` |

### Users

| Method | Endpoint        |
| ------ | --------------- |
| GET    | `/user/profile` |

### Categories

| Method | Endpoint                |
| ------ | ----------------------- |
| POST   | `/category`             |
| GET    | `/category/:categoryId` |

### Products

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | `/product`            |
| GET    | `/product/:productId` |
| PATCH  | `/product/:productId` |
| DELETE | `/product/:productId` |

## Roadmap

Planned work is tracked in [ROADMAP.md](ROADMAP.md).

## Attribution

This project originated from a coursework assignment and has been substantially reorganized and extended. The current repository represents continued development beyond the original class requirements.

## License

This project is released under the Unlicense. See [LICENSE.txt](LICENSE.txt) for details.
