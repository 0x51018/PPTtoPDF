FROM node:20-bookworm-slim

WORKDIR /app
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=""
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

RUN corepack enable && pnpm install --frozen-lockfile=false && pnpm --filter @pptx-to-pdf/web build

EXPOSE 3000
CMD ["pnpm", "--filter", "@pptx-to-pdf/web", "start"]
