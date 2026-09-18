# syntax=docker/dockerfile:1

# Install pnpm
FROM node:22-alpine3.24 AS base
RUN npm install -g pnpm@12.4.1
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Migrator
FROM build AS migrator
CMD ["pnpm", "db:migrate"]

# Seeder (demo accounts) — needs the full source tree for demo_data/*.txt
# and devDependencies for tsx, so it's based on `build` like the migrator.
FROM build AS seeder
CMD ["pnpm", "seed:demo-accounts"]

# Run app
FROM node:22-alpine3.24 AS runner
WORKDIR /app
RUN apk add --no-cache curl
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
