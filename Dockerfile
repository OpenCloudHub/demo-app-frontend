ARG NODE_VERSION=22

#################################################################
# Base stage
#################################################################
FROM node:${NODE_VERSION}-slim AS base
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
ENV PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH" \
    NEXT_TELEMETRY_DISABLED=1

#################################################################
# Dependencies stage
#################################################################
FROM base AS dependencies
ENV NODE_ENV=
COPY package.json pnpm-lock.yaml* ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

#################################################################
# Development stage
#################################################################
FROM dependencies AS development
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "dev"]

#################################################################
# Builder stage
#################################################################
FROM dependencies AS builder
ENV NODE_ENV=production

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY . .
RUN pnpm run build

#################################################################
# Production stage
#################################################################
FROM node:${NODE_VERSION}-slim AS production
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000 \
    HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]