# syntax=docker/dockerfile:1

FROM node:22-alpine AS backend
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3005
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
EXPOSE 3005
CMD ["node", "server.js"]

FROM node:22-alpine AS frontend
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build && npm prune --omit=dev
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
