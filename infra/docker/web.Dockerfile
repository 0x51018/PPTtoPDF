FROM node:20-bookworm-slim

WORKDIR /app
COPY . .

ARG NEXT_PUBLIC_API_BASE_URL=""
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

ARG NEXT_PUBLIC_LOCALE="en"
ENV NEXT_PUBLIC_LOCALE=${NEXT_PUBLIC_LOCALE}

RUN corepack enable && pnpm install --frozen-lockfile=false && pnpm --filter @pptx-to-pdf/web build
RUN mkdir -p apps/web/.next/standalone/apps/web/.next \
  && cp -R apps/web/.next/static apps/web/.next/standalone/apps/web/.next/static \
  && if [ -d apps/web/public ]; then cp -R apps/web/public apps/web/.next/standalone/apps/web/public; fi

EXPOSE 3000
CMD ["pnpm", "--filter", "@pptx-to-pdf/web", "start"]
