# Dayna's System — Cloud Run-ready container.
# Build:  docker build -t dayna-system .
# Run:    docker run -p 8080:8080 -e PORT=8080 -e GEMINI_API_KEY=... -e DATABASE_URL=... dayna-system
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY server.ts api.ts ./
COPY lib ./lib
EXPOSE 8080
CMD ["npx", "tsx", "server.ts"]
