# Paytm Project

Fresh monorepo setup for rebuilding the Paytm project from scratch.

## Structure

- `apps/user-app`: minimal Next.js app shell
- `packages/db`: Prisma database package
- `packages/typescript-config`: shared TypeScript config

## Setup

Install dependencies:

```sh
npm install
```

Create a root `.env` or `packages/db/.env` file with:

```sh
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

Generate the Prisma client:

```sh
npm run generate --workspace @repo/db
```

Run the app:

```sh
npm run dev
```

Build everything:

```sh
npm run build
```
