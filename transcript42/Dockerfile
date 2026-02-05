FROM node:20-bookworm-slim AS builder

# Install system dependencies for node-canvas
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    pkg-config \
    libcairo2-dev \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    librsvg2-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG NEXT_PUBLIC_FORTYTWO_UID
ARG NEXT_PUBLIC_OAUTH_REDIRECT_URI
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY 
ARG NEXT_PUBLIC_APP_URL

ENV NEXT_PUBLIC_FORTYTWO_UID=$NEXT_PUBLIC_FORTYTWO_UID
ENV NEXT_PUBLIC_OAUTH_REDIRECT_URI=$NEXT_PUBLIC_OAUTH_REDIRECT_URI
ENV NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build


FROM node:20-bookworm-slim AS runner

# Install runtime dependencies for node-canvas
RUN apt-get update && apt-get install -y \
    libcairo2 \
    libjpeg62-turbo \
    libpango-1.0-0 \
    libgif7 \
    librsvg2-2 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/assets ./assets

EXPOSE 8000

CMD ["npm", "run", "start", "--", "-p", "8000"]