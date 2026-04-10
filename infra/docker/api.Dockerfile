FROM node:20-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends libreoffice \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY . .
RUN corepack enable && pnpm install --frozen-lockfile=false && pnpm --filter @pptx-to-pdf/shared build && pnpm --filter @pptx-to-pdf/api build

EXPOSE 3001
CMD ["pnpm", "--filter", "@pptx-to-pdf/api", "start"]
